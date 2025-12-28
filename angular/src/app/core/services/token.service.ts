import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_INFO_KEY = 'user_info';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  /**
   * Lưu access token
   */
  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * Lấy access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Lưu refresh token
   */
  setRefreshToken(token: string | undefined): void {
    if (token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * Lấy refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Lưu thông tin user
   */
  setUserInfo(userInfo: any): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  /**
   * Lấy thông tin user
   */
  getUserInfo(): any | null {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Lưu thời gian hết hạn của token
   */
  setTokenExpiry(expiresIn: number): void {
    const expiryTime = Date.now() + expiresIn * 1000; // expiresIn tính bằng giây
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Kiểm tra token có hết hạn chưa
   */
  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() >= parseInt(expiryTime, 10);
  }

  /**
   * Kiểm tra token có sắp hết hạn không (trong vòng 5 phút)
   */
  isTokenExpiringSoon(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    const fiveMinutes = 5 * 60 * 1000; // 5 phút
    return Date.now() >= parseInt(expiryTime, 10) - fiveMinutes;
  }

  /**
   * Xóa tất cả token và thông tin user
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Kiểm tra có token không
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  }
}

