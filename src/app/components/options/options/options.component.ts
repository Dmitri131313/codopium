import { Component } from '@angular/core';
import {EditorComponent, EditorType} from "../editor/editor.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {IconComponent, IconSet} from "../../../shared/components/icon/icon.component";
import {CodeBundle, CodeService} from "../../../shared/services/code.service";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    EditorComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    IconComponent,
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

  codeBundleForm = new FormGroup({
    id: new FormControl<string>(''),
    urlPatternsCommaSeparated: new FormControl<string>('', [Validators.required]),
    js: new FormControl<string>(''),
    css: new FormControl<string>(''),
  })

  protected readonly EditorType = EditorType;
  protected readonly IconSet = IconSet;

  constructor(
    private codeService: CodeService,
  ) {
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
      }
      this.codeService.saveCodeBundleAndReturnIdAsync(codeBundle).then((returnedId: string): void => {
        this.setCodeBundleId(returnedId)
        this.codeBundleForm.markAsPristine()
      })
    }
  }

  removeCodeBundle(): void {

  }

  private setCodeBundleId(id: string) {
    if (!this.codeBundleForm.value.id) {
      this.codeBundleForm.patchValue({id})
    }
  }

}
