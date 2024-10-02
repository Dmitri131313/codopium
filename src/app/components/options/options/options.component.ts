import { Component } from '@angular/core';
import {EditorComponent, EditorType} from "../editor/editor.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    EditorComponent,
    ReactiveFormsModule,
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

  test() {
    this.codeBundleForm.patchValue({
      js: 'js code',
      css: 'css code',
    })
  }
}
