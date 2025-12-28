import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Bỏ qua thông báo lỗi cho một số API không quan trọng
      const skipNotificationUrls = [
        '/api/abp/application-configuration',
        '/.well-known/openid-configuration',
      ];
      const shouldSkipNotification = skipNotificationUrls.some(url => req.url.includes(url));

      let errorMessage = 'Đã xảy ra lỗi không xác định';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Lỗi: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage =
              error.error?.error?.message ||
              error.error?.error_description ||
              'Yêu cầu không hợp lệ';
            break;
          case 401:
            // Lỗi 401 sẽ được xử lý bởi refresh token interceptor trước
            // Chỉ hiển thị thông báo nếu refresh token cũng đã hết hạn hoặc không có refresh token
            errorMessage =
              error.error?.error_description ||
              'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
            break;
          case 403:
            errorMessage =
              error.error?.error?.message || 'Bạn không có quyền truy cập tài nguyên này';
            break;
          case 404:
            errorMessage = error.error?.error?.message || 'Không tìm thấy tài nguyên';
            break;
          case 500:
            errorMessage = error.error?.error?.message || 'Lỗi máy chủ. Vui lòng thử lại sau';
            break;
          case 0:
            // Lỗi kết nối (CORS, network, SSL, server không chạy)
            const url = error.url || req.url;
            errorMessage = `Không thể kết nối đến máy chủ (${url}). 
Vui lòng kiểm tra:
- Server có đang chạy không?
- CORS đã được cấu hình đúng chưa?
- SSL certificate có hợp lệ không?`;
            break;
          default:
            errorMessage =
              error.error?.error?.message ||
              error.error?.error_description ||
              `Lỗi ${error.status}: ${error.message || 'Unknown error'}`;
        }
      }

      // Chỉ hiển thị thông báo lỗi nếu không skip
      if (!shouldSkipNotification) {
        messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: errorMessage,
          life: 5000,
        });
      } else {
        // Vẫn log lỗi để debug
        console.warn('API call failed (silent):', req.url, error);
      }

      return throwError(() => error);
    })
  );
};
