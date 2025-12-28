import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  // Danh sách các URL không cần token
  const publicUrls = [
    '/connect/token', // OAuth login endpoint
    '/connect/authorize', // OAuth authorize endpoint
  ];

  // Kiểm tra xem URL có phải là public endpoint không
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Nếu là public endpoint, không thêm token
  if (isPublicUrl) {
    return next(req);
  }

  // Lấy token từ TokenService
  const token = tokenService.getAccessToken();

  // Chỉ thêm token nếu có và không rỗng
  if (token && token.trim() !== '') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
