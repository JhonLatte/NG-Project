import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { API_BASE_URL } from '@app-shared/consts';
import { StorageKeys } from '@app-shared/enums';
import {
  ErrorResponse,
  JwtTokens,
  RecoveryResponse,
  SignInUser,
  SignUpUser,
  User,
} from '@app-shared/interfaces';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, EMPTY, catchError, tap } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly jwtService = inject(JwtHelperService);
  private readonly alertSerivce = inject(AlertService);

  readonly #user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this.#user$.asObservable();

  readonly baseUrl = `${API_BASE_URL}/auth`;

  constructor() {
    this.init();

    setInterval(() => {
      this.checkUser();
    }, 300000);
  }

  get user() {
    return this.#user$.value;
  }

  set user(user: User | null) {
    this.#user$.next(user);
  }

  get accessToken() {
    return localStorage.getItem(StorageKeys.AccessToken);
  }

  set accessToken(token: string | null) {
    if (!token) {
      return;
    }

    localStorage.setItem(StorageKeys.AccessToken, token);
  }

  get refreshToken() {
    return localStorage.getItem(StorageKeys.RefreshToken);
  }

  set refreshToken(token: string | null) {
    if (!token) {
      return;
    }

    localStorage.setItem(StorageKeys.RefreshToken, token);
  }

  signUp(user: SignUpUser) {
    return this.http.post<User>(`${this.baseUrl}/sign_up`, { ...user });
  }

  signIn(user: SignInUser) {
    return this.http.post<JwtTokens>(`${this.baseUrl}/sign_in`, { ...user });
  }

  init() {
    if (this.accessToken && this.refreshToken) {
      this.user = this.jwtService.decodeToken(this.accessToken);
      this.checkUser();
    } else if (!this.accessToken && this.refreshToken) {
      this.handleRefresh();
    } else {
      this.removeTokens();
      return;
    }
  }

  checkUser() {
    if (!this.accessToken || !this.refreshToken) {
      return;
    }

    this.http
      .get<User>(this.baseUrl)
      .pipe(
        tap((user) => {
          this.user = user;
        }),
        catchError((err) => {
          const error = err.error as ErrorResponse;
          if (error.errorKeys.includes('errors.token_expired')) {
            this.handleRefresh();
            return EMPTY;
          }
          this.logOut(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  handleRefresh() {
    if (!this.refreshToken) {
      this.logOut(false);
      return;
    }

    this.http
      .post<Omit<JwtTokens, 'refresh_token'>>(`${this.baseUrl}/refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((token) => {
          this.accessToken = token.access_token;
        }),
        catchError(() => {
          this.logOut(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  handleSignIn(tokens: JwtTokens) {
    this.user = this.jwtService.decodeToken(tokens.access_token);
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;

    if (!this.user?.verified) {
      this.router.navigateByUrl('/verify');
      return;
    }

    this.router.navigateByUrl('/');
  }

  logOut(showMessage = true) {
    this.user = null;
    this.removeTokens();
    if (showMessage) {
      this.alertSerivce.toast('Successfully log out', 'success', 'green');
    }
    this.router.navigateByUrl('/');
  }

  removeTokens() {
    localStorage.removeItem(StorageKeys.AccessToken);
    localStorage.removeItem(StorageKeys.RefreshToken);
  }

  recovery(email: string) {
    this.http
      .post<RecoveryResponse>(`${this.baseUrl}/recovery`, { email })
      .pipe(
        tap((response) => {
          this.alertSerivce.alert('Recovery', 'info', response.message);
          this.router.navigateByUrl('/auth');
        }),
        catchError((err) => {
          this.alertSerivce.error(err);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  canActivate() {
    if (!this.accessToken || !this.refreshToken) {
      this.router.navigateByUrl('/');
      return false;
    }

    try {
      const user = this.jwtService.decodeToken(this.accessToken) as User;

      if (user.verified) {
        return true;
      }
      this.router.navigateByUrl('/verify');
      return false;
    } catch (err) {
      this.router.navigateByUrl('/');
      this.removeTokens();
      return false;
    }
  }

  canVerify() {
    if (!this.accessToken || !this.refreshToken) {
      this.router.navigateByUrl('/');
      return false;
    }

    try {
      const user = this.jwtService.decodeToken(this.accessToken) as User;

      if (user.verified) {
        this.router.navigateByUrl('/');
        return false;
      }

      return true;
    } catch (err) {
      this.router.navigateByUrl('/');
      this.removeTokens();
      return false;
    }
  }

  canAuth() {
    if (!this.accessToken || !this.refreshToken) {
      return true;
    }

    this.router.navigateByUrl('/');
    return false;
  }

  canOpenNotAuthPage() {
    if (this.accessToken || this.refreshToken) {
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }
}

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canActivate();
};

export const canVerify: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canVerify();
};

export const canAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canAuth();
};

export const canOpenNotAuthPage: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).canOpenNotAuthPage();
};
