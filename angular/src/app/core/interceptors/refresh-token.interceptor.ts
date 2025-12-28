import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Không xử lý các request đến endpoint refresh token để tránh vòng lặp
  const isRefreshTokenRequest = req.url.includes('/connect/token');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Chỉ xử lý lỗi 401 (Unauthorized) và không phải là request refresh token
      if (error.status === 401 && !isRefreshTokenRequest) {
        const refreshToken = authService.getRefreshToken();

        // Nếu có refresh token, thử refresh
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap(newTokenResponse => {
              // Retry request với token mới
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokenResponse.access_token}`,
                },
              });
              return next(clonedRequest);
            }),
            catchError(refreshError => {
              // Nếu refresh thất bại, đăng xuất
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Không có refresh token, đăng xuất
          authService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};
