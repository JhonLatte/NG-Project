import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SalesComponent } from '../sales/sales.component';
import FooterComponent from '../footer/footer.component';
import { NewsleterComponent } from '../newsleter/newsleter.component';
import { SpendsaveComponent } from '../spendsave/spendsave.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SalesComponent, SpendsaveComponent, FooterComponent, NewsleterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
}
