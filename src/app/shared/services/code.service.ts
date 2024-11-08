import { Injectable } from '@angular/core';
import {ChromeService} from "./chrome.service";
import {Subject} from "rxjs";

export interface CodeBundle {
  id: string
  urlPatterns: string[]
  urlPatternsCommaSeparated?: string
  js: string
  css: string
  isEnabled: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  onLoadBundleDemand: Subject<CodeBundle|void> = new Subject<CodeBundle|void>()
  onCodeBundlesUpdate: Subject<void> = new Subject<void>()

  constructor(
    private chromeService: ChromeService,
  ) { }

  saveCodeBundleAndReturnIdAsync(codeBundle: CodeBundle): Promise<string> {
    if (!codeBundle.id) {
      codeBundle.id = this.getNewId()
    }
    return Promise.all([
      this.chromeService.saveOrRemoveJSToChromeRegisteredScriptsAsync(codeBundle),
      this.chromeService.saveOrRemoveCSSToChromeRegisteredScriptsAsync(codeBundle),
      this.saveToLocalStorage(codeBundle),
    ])
      .then(() => codeBundle.id)
  }

  getCodeBundlesAsync(): Promise<CodeBundle[]> {
    return chrome.storage.local.get({codeBundles: []}).then(items => {
      const codeBundles: CodeBundle[] = items['codeBundles']
      this.addAdditionalPropertiesToCodeBundles(codeBundles)
      return codeBundles
    })
  }

  getUrlPatternsFromCommaSeparatedString(urlPatternsCommaSeparated: string): string[] {
    let urlPatterns: string[] = urlPatternsCommaSeparated.split(',')
    urlPatterns = urlPatterns.map(urlPattern => urlPattern.trim())
    return urlPatterns
  }

  loadCodeBundleDemand(codeBundle: CodeBundle): void {
    this.onLoadBundleDemand.next(codeBundle)
  }

  newCodeBundleDemand(): void {
    this.onLoadBundleDemand.next()
  }

  removeCodeBundleAsync(id: string): Promise<void> {
    return Promise.all([
      this.removeChromeRegisteredScript(id),
      this.removeFromLocalStorage(id),
    ]).then()
  }

  getCodeBundlesForUrlAsync(currentUrl: string): Promise<CodeBundle[]> {
    return this.getCodeBundlesAsync()
      .then((codeBundles: CodeBundle[]): CodeBundle[] =>
        codeBundles.filter((codeBundle: CodeBundle): boolean =>
          this.isUrlMatchPatterns(currentUrl, codeBundle.urlPatterns)
        )
      )
  }

  loadCodeBundleByIdDemand(id: string): void {
    this.getCodeBundleByIdAsync(id).then((codeBundle: CodeBundle | null): void => {
      if (codeBundle !== null) {
        this.loadCodeBundleDemand(codeBundle)
      }
    })
  }

  private getCodeBundleByIdAsync(id: string): Promise<CodeBundle | null> {
    return this.getCodeBundlesAsync()
      .then((codeBundles: CodeBundle[]): CodeBundle[] =>
        codeBundles
          .filter((codeBundle: CodeBundle): boolean => codeBundle.id === id)
      )
      .then((filterCodeBundles: CodeBundle[]) =>
        filterCodeBundles.length ? filterCodeBundles[0] : null
      )
  }

  private isUrlMatchPatterns(url: string, patterns: string[]): boolean {
    const includePatternsOnly = this.chromeService.filterIncludePatternsOnly(patterns)
    const isIncludePatternsMatch = includePatternsOnly.some((pattern: string): boolean => {
      const regExpString: string = pattern.replace(/\W/g, "\\$&").replace(/\\\*/g, ".*")
      const regExp: RegExp = new RegExp(regExpString, "i")
      return regExp.test(url)
    })
    if (isIncludePatternsMatch) {
      const excludePatternsOnly = this.chromeService.filterExcludePatternsOnly(patterns)
      const isExcludePatternsMatch = excludePatternsOnly.some((pattern: string): boolean => {
        const regExpString: string = pattern.replace(/\W/g, "\\$&").replace(/\\\*/g, ".*")
        const regExp: RegExp = new RegExp(regExpString, "i")
        return regExp.test(url)
      })
      return !isExcludePatternsMatch
    }
    return false
  }

  private removeChromeRegisteredScript(id: string): Promise<void> {
    return chrome.userScripts.unregister({ids: [id, id + ':css']});
  }

  private removeFromLocalStorage(id: string): Promise<void> {
    return this.getCodeBundlesAsync().then((codeBundles: CodeBundle[]) => {
      codeBundles = codeBundles.filter((codeBundle: CodeBundle): boolean => codeBundle.id !== id)
      return chrome.storage.local.set({codeBundles}).then(
        this.notifyCodeBundlesUpdated.bind(this)
      )
    })
  }

  private addAdditionalPropertiesToCodeBundles(codeBundles: CodeBundle[]): void {
    codeBundles.forEach((codeBundle: CodeBundle): CodeBundle => {
      codeBundle.urlPatternsCommaSeparated = codeBundle.urlPatterns.join(', ')
      return codeBundle
    })
  }

  private saveToLocalStorage(codeBundle: CodeBundle): Promise<void> {
    return this.getCodeBundlesAsync().then((codeBundles: CodeBundle[]) => {
      codeBundles = this.getCodeBundlesAfterAddOrUpdate(codeBundles, codeBundle)
      return chrome.storage.local.set({codeBundles}).then(
        this.notifyCodeBundlesUpdated.bind(this)
      )
    })
  }

  private notifyCodeBundlesUpdated() {
    this.onCodeBundlesUpdate.next()
  }

  private getCodeBundlesAfterAddOrUpdate(codeBundles: CodeBundle[], newOrUpdatedCodeBundle: CodeBundle): CodeBundle[] {
    const ifUpdated: boolean = codeBundles.some((codeBundle: CodeBundle, codeBundleIndex: number): boolean => {
      if (codeBundle.id === newOrUpdatedCodeBundle.id) {
        codeBundles[codeBundleIndex] = newOrUpdatedCodeBundle
        return true
      } else {
        return false
      }
    })
    if (!ifUpdated) {
      codeBundles.push(newOrUpdatedCodeBundle)
    }
    return codeBundles
  }

  private getNewId(): string {
    return window.crypto.randomUUID()
  }
}
