import { Component } from '@angular/core';
import {EditorComponent, EditorType} from "../editor/editor.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {IconComponent, IconSet} from "../../../shared/components/icon/icon.component";

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

  saveCodeBundle(): void {

  }

  removeCodeBundle(): void {

  }

}
