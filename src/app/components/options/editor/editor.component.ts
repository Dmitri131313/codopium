import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {Ace} from "ace-builds"
import * as ace from 'ace-builds/src-noconflict/ace'
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/snippets/javascript"
import "ace-builds/src-noconflict/snippets/css"
import {FormGroupDirective} from "@angular/forms";

export enum EditorType {
  CSS = 'css',
  JS = 'javascript'
}

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit, OnInit {

  @Input({required: true}) type!: EditorType
  @ViewChild('editor') private editorElement: ElementRef<HTMLElement> | undefined

  private editor: Ace.Editor | undefined
  private ifBlockEditorChangeListener: boolean = false
  private ifBlockFormChangeListener: boolean = false

  constructor(
    private formGroupDirective: FormGroupDirective,
  ) {
  }

  ngOnInit(): void {
    this.formGroupDirective.form.get(this.isJSCode() ? 'js' : 'css')?.valueChanges.subscribe(this.loadCode.bind(this))
  }

  ngAfterViewInit(): void {
    this.initEditor()
  }

  private loadCode(code: string): void {
    if (!this.ifBlockFormChangeListener) {
      this.ifBlockEditorChangeListener = true
      this.setEditorValue(code)
      this.ifBlockEditorChangeListener = false
    }
  }

  private initEditor(): void {
    if (this.editorElement) {
      // Setting base directory where additional Ace library files for loading could be found
      ace.config.set('basePath', 'ace');
      // This option is required for correct work as a Chrome extension
      ace.config.set("loadWorkerFromBlob", false)
      const mode = 'ace/mode/' + this.type.toString()
      const placeholder = 'Start typing ' + (this.isJSCode() ? 'Javascript' : 'CSS') + ' here...'
      this.editor = ace.edit(this.editorElement.nativeElement, {
        mode,
        placeholder,
      })
      this.editor?.setOptions({
        //enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        wrap: true,
        showPrintMargin: false,
        useSoftTabs: false,
        fontSize: 16,
      })
      this.bindEditorEvents()
    }
  }

  private bindEditorEvents() {
    if (this.editor) {
      this.editor.session.on('change', this.onChanged.bind(this))
    }
  }

  private onChanged() {
    if (!this.ifBlockEditorChangeListener) {
      const formControlName = this.isJSCode() ? 'js' : 'css'
      this.ifBlockFormChangeListener = true
      this.formGroupDirective.form.patchValue({
        [formControlName]: this.getEditorValue(),
      })
      this.ifBlockFormChangeListener = false
      this.formGroupDirective.form.get(formControlName)?.markAsDirty()
    }
  }

  private getEditorValue(): string {
    return this.editor?.session.getValue() ?? ''
  }

  private setEditorValue(code: string): void {
    this.editor?.session.setValue(code)
  }

  private isJSCode(): boolean {
    return this.type === EditorType.JS
  }
}
