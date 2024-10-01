import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {Ace} from "ace-builds"
import * as ace from 'ace-builds/src-noconflict/ace'
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/snippets/javascript"
import "ace-builds/src-noconflict/snippets/css"

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editor') private editorElement: ElementRef<HTMLElement> | undefined

  ngAfterViewInit(): void {
    this.initEditor()
  }

  private initEditor(): void {
    if (this.editorElement) {
      // Setting base directory where additional Ace library files for loading could be found
      ace.config.set('basePath', 'ace');
      // This option is required for correct work as a Chrome extension
      ace.config.set("loadWorkerFromBlob", false)
    }
  }
}
