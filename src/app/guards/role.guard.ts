import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRole = route.data['expectedRole'];
  const user = authService.currentUser();
  
  if (user && user.role === expectedRole) {
    return true;
  }
  
  // Don't have the right role (e.g. Bank trying to access Court portal)
  return false; 
};
