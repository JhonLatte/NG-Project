import { Component } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import FooterComponent from '../footer/footer.component';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatExpansionModule,MatTabsModule, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export default class ContactComponent {
  panelOpenState = false;
 
}
