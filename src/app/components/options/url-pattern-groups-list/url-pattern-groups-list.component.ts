import {Component, Input, OnInit} from '@angular/core';
import {CodeBundle, CodeService} from "../../../shared/services/code.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-url-pattern-groups-list',
  standalone: true,
  imports: [
    MatSlideToggle,
    FormsModule,
  ],
  templateUrl: './url-pattern-groups-list.component.html',
  styleUrl: './url-pattern-groups-list.component.scss'
})
export class UrlPatternGroupsListComponent implements OnInit {
  @Input({required: true}) loadedCodeBundleId!: string | null | undefined
  codeBundles: CodeBundle[] | undefined

  constructor(
    private codeService: CodeService,
  ) {

  }

  ngOnInit() {
    this.requestCodeBundles()
    this.codeService.onCodeBundlesUpdate.subscribe(() => {
      this.codeService.getCodeBundlesAsync().then(this.requestCodeBundles.bind(this))
    })
  }

  requestCodeBundles() {
    this.codeService.getCodeBundlesAsync().then((codeBundles: CodeBundle[]) => {
      this.codeBundles = codeBundles
    })
  }

  loadCodeBundle(codeBundle: CodeBundle): void {
    this.codeService.loadCodeBundleDemand(codeBundle)
  }

  isActiveChange(codeBundle: CodeBundle, checked: boolean) {
    codeBundle.isEnabled = checked
    this.codeService.saveCodeBundleAndReturnIdAsync(codeBundle)
  }

}
