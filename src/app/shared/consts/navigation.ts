import { Navigation } from '@app-shared/interfaces';

export const NAVIGATIONS: Navigation[] = [
  {
    title: 'Products',
    path: 'products',
    auth: false,
    hideAfterAuth: false,
  }, 
  {
    title: 'Contact Us',
    path: 'contact',
    auth: false,
    hideAfterAuth: false,
  },
  {
    title: "Log In",
    path: 'auth',
    auth: false,
    hideAfterAuth: true,
  },
];