import { Injectable, inject } from '@angular/core';
import { LANGUAGES } from '@app-shared/consts';
import { LangaugeLocals, StorageKeys } from '@app-shared/enums';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppTranslateService {
  private readonly translateService = inject(TranslateService);

  readonly #language$ = new BehaviorSubject<string>(LangaugeLocals.EN);
  readonly language$ = this.#language$.asObservable();

  get language() {
    return localStorage.getItem(StorageKeys.Language) || '';
  }

  set language(language: string) {
    if (!language || !LANGUAGES.find((lang) => lang.language === language)) {
      language = LangaugeLocals.EN;
    }

    localStorage.setItem(StorageKeys.Language, language);
    this.translateService.use(language);

    this.#language$.next(language);
  }

  init() {
    const prevLanguage = this.language;
    this.language = prevLanguage;
  }

  translate(key: string) {
    return this.translateService.instant(key);
  }
}
