import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginDto, LoginResponseDto } from 'src/app/shared/Dto/auth.dto';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private permissions: Record<string, boolean> = {};
  private tokenService = inject(TokenService);
  private router = inject(Router);

  constructor(private httpClient: HttpClient) {}

  /**
   * Đăng nhập
   */
  public login(payload: LoginDto): Observable<LoginResponseDto> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', environment.oAuthConfig.clientId)
      .set('username', payload.username)
      .set('password', payload.password)
      .set('scope', 'offline_access');

    return this.httpClient
      .post<LoginResponseDto>(environment.oAuthConfig.issuer + 'connect/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap(response => {
          // Lưu token và thông tin
          this.tokenService.setAccessToken(response.access_token);
          this.tokenService.setRefreshToken(response.refresh_token);
          this.tokenService.setTokenExpiry(response.expires_in);
        })
      );
  }

  /**
   * Đăng xuất
   */
  public logout(): void {
    this.tokenService.clearTokens();
    this.permissions = {};
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refresh token
   */
  public refreshToken(): Observable<LoginResponseDto> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', environment.oAuthConfig.clientId)
      .set('refresh_token', refreshToken);

    return this.httpClient
      .post<LoginResponseDto>(environment.oAuthConfig.issuer + 'connect/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap(response => {
          // Cập nhật token mới
          this.tokenService.setAccessToken(response.access_token);
          this.tokenService.setRefreshToken(response.refresh_token);
          this.tokenService.setTokenExpiry(response.expires_in);
        }),
        catchError(error => {
          // Nếu refresh token hết hạn, đăng xuất
          if (error.status === 400 || error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isLoggedIn(): boolean {
    const hasToken = this.tokenService.hasToken();
    const isExpired = this.tokenService.isTokenExpired();
    return hasToken && !isExpired;
  }

  /**
   * Lấy access token hiện tại
   */
  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  /**
   * Lấy refresh token hiện tại
   */
  getRefreshToken(): string | null {
    return this.tokenService.getRefreshToken();
  }

  /**
   * Kiểm tra token có sắp hết hạn không
   */
  isTokenExpiringSoon(): boolean {
    return this.tokenService.isTokenExpiringSoon();
  }

  /**
   * Tải permissions từ server
   */
  loadPermissions(): Observable<any> {
    // Sử dụng relative URL với proxy hoặc full URL từ environment
    // Proxy sẽ forward /api/* đến https://localhost:44321
    const apiUrl = '/api/abp/application-configuration?includeLocalizationResources=false';

    return this.httpClient.get<any>(apiUrl).pipe(
      tap(res => {
        this.permissions = res.auth?.grantedPolicies ?? {};
        // Lưu thông tin user nếu có
        if (res.currentUser) {
          this.tokenService.setUserInfo(res.currentUser);
        }
      }),
      catchError(error => {
        // Nếu không load được permissions, vẫn cho phép app chạy
        // Chỉ log lỗi, không throw để không crash app
        console.warn('Không thể load permissions:', error);
        // Trả về object rỗng để app vẫn chạy được
        return throwError(() => error);
      })
    );
  }

  /**
   * Kiểm tra quyền truy cập
   */
  hasPermission(permission?: string): boolean {
    if (!permission) return true;
    return this.permissions[permission] === true;
  }

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser(): any | null {
    return this.tokenService.getUserInfo();
  }

  /**
   * Lấy username của user hiện tại
   */
  getCurrentUsername(): string | null {
    const user = this.getCurrentUser();
    return user?.userName || user?.email || null;
  }
}
