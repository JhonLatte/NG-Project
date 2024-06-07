import { Component, ViewChild, inject, viewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {
  AppTranslateService,
  AuthService,
  BreakpointService,
  CartService,
  NavigationService,
} from '@app-shared/services';
import { LANGUAGES, TITLE } from '@app-shared/consts';
import { BehaviorSubject, delay, filter, map, skip, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LangaugeLocals } from '@app-shared/enums';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from './features/cart/cart.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    TranslateModule,
    AsyncPipe,
   
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(MatSidenav) sideNavRef!: MatSidenav;

  private readonly route = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly breakpointService = inject(BreakpointService);
  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly translateService = inject(AppTranslateService);
  private readonly cartService = inject(CartService);

  private readonly routeTitle$ = new BehaviorSubject<string>(LangaugeLocals.EN);

  readonly navigation$ = this.navigationService.navigation$;
  readonly user$ = this.authService.user$;

  readonly isHandset$ = this.breakpointService.isHandset$.pipe(
    tap((match) => {
      if (!this.sideNavRef) {
        return;
      }

      if (!match) {
        this.sideNavRef.close();
      }
    }),
  );

  readonly title$ = this.routeTitle$.pipe(
    skip(1),
    map((key) => {
      return this.translateService.translate(`navigations.${key}`);
    }),
  );

  readonly showHorizontalLine$ = this.route.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => {
      let root = this.activatedRoute.snapshot;

      while (root.firstChild) {
        root = root.firstChild;
      }

      return !(root.data['hideHorizontalLine'] || false);
    }),
  );

  readonly title = TITLE;
  readonly langauges = LANGUAGES;

  constructor() {
    this.translateService.init();
    this.cartService.init();
    this.translateService.language$
      .pipe(
        delay(100),
        tap(() => {
          let root = this.activatedRoute.snapshot;

          while (root.firstChild) {
            root = root.firstChild;
          }

          this.routeTitle$.next(root.title || '');
        }),
      )
      .subscribe();
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          let root = this.activatedRoute.snapshot;

          while (root.firstChild) {
            root = root.firstChild;
          }

          if (this.authService.user && !this.authService.user.verified) {
            this.route.navigateByUrl('/verify');
          }

          this.routeTitle$.next(root.title || '');
        }),
      )
      .subscribe();
  }

  logOut() {
    this.authService.logOut();
  }

  loadLanguage(langauge: LangaugeLocals) {
    this.translateService.language = langauge;
  }

  openCart() {
    this.dialog.open(CartComponent, {
      data: null,
      height: '100vh',
      maxWidth: 500,
      minWidth: 280,
      position: {
        top: '0',
        right: '0',
      },
    });
  }
}
