import { Injectable, inject } from '@angular/core';
import { ErrorResponse } from '@app-shared/interfaces';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AppTranslateService } from './app-translate.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly translateService = inject(AppTranslateService);

  alert(title: string, icon: SweetAlertIcon, text = '') {
    Swal.fire({ title, icon, text });
  }

  toast(
    title: string,
    icon: SweetAlertIcon,
    color: string,
    time: number = 1500,
  ): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: color,
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: time,
      timerProgressBar: true,
    });
    Toast.fire({
      icon,
      title,
    });
  }

  error(response: ErrorResponse) {
    Swal.fire({
      title: response.error,
      icon: 'error',
      html: `<ul style="list-style: none; padding: 0">${response.errorKeys
        .map((key) => `<li>${this.translateService.translate(key)}</li>`)
        .join('')}</ul>`,
    });
  }
}
