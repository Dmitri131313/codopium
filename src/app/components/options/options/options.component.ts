import {Component, OnInit} from '@angular/core';
import {EditorComponent, EditorType} from "../editor/editor.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {IconComponent, IconSet} from "../../../shared/components/icon/icon.component";
import {CodeBundle, CodeService} from "../../../shared/services/code.service";
import {MatToolbar} from "@angular/material/toolbar";
import {UrlPatternGroupsListComponent} from "../url-pattern-groups-list/url-pattern-groups-list.component";
import {UrlPatternsGroupValidator} from "../../../shared/validators/url-patterns-group.validator";
import {
  UrlPatternsGroupRequirementsComponent
} from "../../../shared/components/url-patterns-group-requirements/url-patterns-group-requirements.component";
import {ChromeService} from "../../../shared/services/chrome.service";
import {
  HowtoActivateDeveloperModeComponent
} from "../../../shared/components/howto-activate-developer-mode/howto-activate-developer-mode.component";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    UrlPatternGroupsListComponent,
    EditorComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    IconComponent,
    MatToolbar,
    UrlPatternsGroupRequirementsComponent,
    HowtoActivateDeveloperModeComponent,
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent implements OnInit {
  isDeveloperModeEnabled: boolean | undefined
  codeBundleForm = new FormGroup({
    id: new FormControl<string>(''),
    urlPatternsCommaSeparated: new FormControl<string>('', [Validators.required, UrlPatternsGroupValidator.urlPatternsGroupValidator()]),
    js: new FormControl<string>(''),
    css: new FormControl<string>(''),
  })

  protected readonly EditorType = EditorType;
  protected readonly IconSet = IconSet;

  private loadedCodeBundle: CodeBundle | undefined

  constructor(
    private codeService: CodeService,
    private chromeService: ChromeService,
  ) {
  }

  ngOnInit(): void {
    this.isDeveloperModeEnabled = this.chromeService.isChromeUserscriptsAvailable()
    this.codeService.onLoadBundleDemand.subscribe(this.loadCodeBundle.bind(this))
    this.loadURLPatternFromQueryString()
    this.loadCodeBundleFromURLQueryString()
  }

  saveCodeBundle(): void {
    if (this.codeBundleForm.valid && this.codeBundleForm.value) {
      const id: string = this.codeBundleForm.value.id!
      const urlPatternsCommaSeparated: string = this.codeBundleForm.value.urlPatternsCommaSeparated!
      const css: string = this.codeBundleForm.value.css!
      const js: string = this.codeBundleForm.value.js!
      const urlPatterns: string[] = this.codeService.getUrlPatternsFromCommaSeparatedString(urlPatternsCommaSeparated)
      const codeBundle: CodeBundle = {
        id,
        urlPatterns: urlPatterns,
        js,
        css,
        isEnabled: this.loadedCodeBundle?.isEnabled ?? true,
      }
      this.codeService.saveCodeBundleAndReturnIdAsync(codeBundle).then((returnedId: string): void => {
        this.setCodeBundleId(returnedId)
        this.codeBundleForm.markAsPristine()
      })
    }
  }

  removeCodeBundle(): void {
    if (confirm('Are you sure to remove current code bundle?')) {
      if (this.codeBundleForm.value.id) {
        this.codeService.removeCodeBundleAsync(this.codeBundleForm.value.id).then(() => {
          this.codeBundleForm.reset()
        })
      }
    }
  }

  addNewCodeBundle() {
    this.codeService.newCodeBundleDemand()
  }

  private setCodeBundleId(id: string) {
    if (!this.codeBundleForm.value.id) {
      this.codeBundleForm.patchValue({id})
    }
  }

  private loadCodeBundle(codeBundle: CodeBundle | void) {
    this.loadedCodeBundle = codeBundle ?? undefined
    this.codeBundleForm.patchValue({
      urlPatternsCommaSeparated: codeBundle?.urlPatternsCommaSeparated ?? '',
      id: codeBundle?.id ?? '',
      css: codeBundle?.css ?? '',
      js: codeBundle?.js ?? '',
    })
    this.codeBundleForm.markAsPristine()
  }

  private loadURLPatternFromQueryString() {
    const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
    const url: string | null = queryParams.get('url');
    if (url) {
      this.setUrlPatternsGroup(url)
    }
  }

  private setUrlPatternsGroup(urlPatternsCommaSeparated: string) {
    this.codeBundleForm.patchValue({
      urlPatternsCommaSeparated,
    })
  }

  private loadCodeBundleFromURLQueryString() {
    const queryParams: URLSearchParams = new URLSearchParams(window.location.search);
    const id: string | null = queryParams.get('id');
    if (id !== null) {
      this.codeService.loadCodeBundleByIdDemand(id)
    }
  }

}
