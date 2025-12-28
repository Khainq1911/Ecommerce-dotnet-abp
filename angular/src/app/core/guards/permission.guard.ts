import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Chưa login
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['auth/login']);
  }

  // 2. Check permission
  const permission = route.data?.['permission'] as string;

  if (!auth.hasPermission(permission)) {
    return router.createUrlTree(['/auth/access']);
  }

  return true;
};
