import {Component, Input, OnInit} from '@angular/core';
import {MatIcon, MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

export enum IconSet {
  save = 'save',
  delete = 'delete',
  warning = 'warning',
  error = 'error',
}

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    MatIcon,
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent implements OnInit {
  @Input({required: true}) icon!: IconSet
  @Input() color: string | undefined
  style: {[key: string]: string} = {
    '--icon-color': 'black',
  }

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {
    if (this.color) {
      this.style['--icon-color'] = this.color
    }
    this.registerSVGIcons()
  }

  private registerSVGIcons() {
    for (let icon in IconSet) {
      const iconPath = `icons/svg/${icon}.svg`
      this.iconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(iconPath))
    }
  }
}
