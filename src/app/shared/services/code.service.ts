import { Injectable } from '@angular/core';
import {ChromeService} from "./chrome.service";

export interface CodeBundle {
  id: string
  urlPatterns: string[]
  urlPatternsCommaSeparated?: string
  js: string
  css: string
}

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  constructor(
    private chromeService: ChromeService,
  ) { }

  saveCodeBundleAndReturnIdAsync(codeBundle: CodeBundle): Promise<string> {
    if (!codeBundle.id) {
      codeBundle.id = this.getNewId()
    }
    return Promise.all([
      this.chromeService.saveJSToChromeRegisteredScriptsAsync(codeBundle),
      this.chromeService.saveCSSToChromeRegisteredScriptsAsync(codeBundle),
    ])
      .then(() => codeBundle.id)
  }

  getUrlPatternsFromCommaSeparatedString(urlPatternsCommaSeparated: string): string[] {
    let urlPatterns: string[] = urlPatternsCommaSeparated.split(',')
    urlPatterns = urlPatterns.map(urlPattern => urlPattern.trim())
    return urlPatterns
  }

  private getNewId(): string {
    return window.crypto.randomUUID()
  }
}
