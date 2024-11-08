import {Component, OnInit} from '@angular/core';
import {CodeBundle, CodeService} from "../../../shared/services/code.service";
import {ChromeService} from "../../../shared/services/chrome.service";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, FormsModule} from "@angular/forms";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {UrlPatternsGroupValidator} from "../../../shared/validators/url-patterns-group.validator";
import {
  HowtoActivateDeveloperModeComponent
} from "../../../shared/components/howto-activate-developer-mode/howto-activate-developer-mode.component";

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    MatSlideToggle,
    FormsModule,
    MatButton,
    MatToolbar,
    MatAnchor,
    HowtoActivateDeveloperModeComponent,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {
  codeBundles: CodeBundle[] = []
  currentUrl: string | undefined
  urlToAddRuleForDomain: string = ''
  urlToAddRuleForPage: string = ''
  isDeveloperModeEnabled: boolean | undefined

  constructor(
    private codeService: CodeService,
    private chromeService: ChromeService,
  ) {

  }

  ngOnInit(): void {
    this.isDeveloperModeEnabled = this.chromeService.isChromeUserscriptsAvailable()
    this.fetchCurrentUrl().then(() => {
      this.initAddRuleUrls()
      if (this.currentUrl !== undefined) {
        this.codeService.getCodeBundlesForUrlAsync(this.currentUrl).then((codeBundles: CodeBundle[]): void => {
          this.codeBundles = codeBundles
        })
      }
    })
  }

  isActiveChange(codeBundle: CodeBundle, checked: boolean) {
    codeBundle.isEnabled = checked
    this.codeService.saveCodeBundleAndReturnIdAsync(codeBundle)
  }

  getOptionsPageUrlForRule(id: string): string {
    return this.chromeService.getOptionsPageUrl({id})
  }

  private fetchCurrentUrl(): Promise<void> {
    return this.chromeService.getCurrentUrlAsync().then((currentUrl: string | undefined): void => {
      if (currentUrl && this.isValidUrl(currentUrl)) {
        this.currentUrl = currentUrl
      }
    })
  }

  private isValidUrl(url: string): boolean {
    return UrlPatternsGroupValidator.urlPatternsGroupValidator()(new FormControl(url)) === null
  }

  protected readonly encodeURIComponent = encodeURIComponent;

  private initAddRuleUrls() {
    if (this.currentUrl !== undefined) {
      const domainURLPattern = new URL(this.currentUrl).origin + '/*'
      this.urlToAddRuleForDomain = this.chromeService.getOptionsPageUrl({url: domainURLPattern})
      this.urlToAddRuleForPage = this.chromeService.getOptionsPageUrl({url: this.currentUrl})
    }
  }

}
