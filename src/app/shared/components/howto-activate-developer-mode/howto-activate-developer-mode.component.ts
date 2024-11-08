import { Component } from '@angular/core';
import {IconComponent, IconSet} from "../icon/icon.component";

@Component({
  selector: 'app-howto-activate-developer-mode',
  standalone: true,
  imports: [
    IconComponent
  ],
  templateUrl: './howto-activate-developer-mode.component.html',
  styleUrl: './howto-activate-developer-mode.component.scss'
})
export class HowtoActivateDeveloperModeComponent {

    protected readonly IconSet = IconSet;
}
