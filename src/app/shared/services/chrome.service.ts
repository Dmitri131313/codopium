import { Injectable } from '@angular/core';
import {CodeBundle} from "./code.service";

@Injectable({
  providedIn: 'root'
})
export class ChromeService {

  constructor() { }

  isChromeUserscriptsAvailable(): boolean {
    try {
      chrome.userScripts;
      return true;
    } catch {
      return false;
    }
  }

  saveOrRemoveJSToChromeRegisteredScriptsAsync(codeBundle: CodeBundle): Promise<void> {
    if (codeBundle.isEnabled) {
      return this.saveToChromeRegisteredScriptsAsync(codeBundle.id, codeBundle.urlPatterns, codeBundle.js, "document_start")
    } else {
      return this.removeFromChromeRegisteredScriptAsync(codeBundle.id)
    }
  }

  saveOrRemoveCSSToChromeRegisteredScriptsAsync(codeBundle: CodeBundle): Promise<void> {
    const id: string = codeBundle.id + ':css'
    const codeCSSWrappedWithJS: string = this.wrapCSSCodeWithJS(codeBundle.css)
    if (codeBundle.isEnabled) {
      return this.saveToChromeRegisteredScriptsAsync(id, codeBundle.urlPatterns, codeCSSWrappedWithJS, "document_end")
    } else {
      return this.removeFromChromeRegisteredScriptAsync(id)
    }
  }

  saveToChromeRegisteredScriptsAsync(scriptId: string, urlPatterns: string[], codeJS: string, runAt: chrome.userScripts.RunAt): Promise<void> {
    const includeMatches: string[] = this.filterIncludePatternsOnly(urlPatterns)
    const excludeMatches: string[] = this.filterExcludePatternsOnly(urlPatterns)
    const chromeRegisteredScript: chrome.userScripts.RegisteredUserScript = {
      id: scriptId,
      matches: includeMatches,
      excludeMatches: excludeMatches,
      js: [{code: codeJS}],
      runAt,
      world: "MAIN",
    }
    return this.removeFromChromeRegisteredScriptAsync(scriptId).then(() =>
      chrome.userScripts.register([chromeRegisteredScript])
    )
  }

  removeFromChromeRegisteredScriptAsync(id: string): Promise<void> {
    return this.ifChromeRegisteredScriptExistAsync(id).then(ifExist => (ifExist ? chrome.userScripts.unregister({ids: [id]}) : Promise.resolve()))
  }

  ifChromeRegisteredScriptExistAsync(scriptId: string): Promise<boolean> {
    return chrome.userScripts.getScripts({
      ids: [scriptId]
    }).then((foundScripts: chrome.userScripts.RegisteredUserScript[]) => foundScripts.length !== 0)
  }

  getOptionsPageUrl(queryParams: {[key: string]: string} = {}): string {
    const queryString: string = Object.entries(queryParams)
      .map(([key, value]: [string, string]): string =>
        `${key}=${encodeURIComponent(value)}`
      ).
      join("&")
    return chrome.runtime.getURL('index.html') + '?' + queryString + '#options'
  }

  getCurrentUrlAsync(): Promise<string | undefined> {
    return chrome.tabs.query({
      active: true,
      currentWindow: true,
    }).then((tabs: chrome.tabs.Tab[]) => tabs[0].url)
  }

  filterIncludePatternsOnly(patterns: string[]): string[] {
    return patterns.filter(pattern => !pattern.startsWith('!'))
  }

  filterExcludePatternsOnly(patterns: string[]): string[] {
    return patterns
      .filter(pattern => pattern.startsWith('!'))
      .map(pattern => pattern.substring(1))
  }

  private wrapCSSCodeWithJS(codeCSS: string): string {
    return '(() => {' +
      '\n\tconst style = document.createElement(\'style\')' +
      '\n\tstyle.textContent = /*user style start*/`' + codeCSS + '`/*user style end*/' +
      '\n\tdocument.documentElement.appendChild(style)' +
      '\n})()'
  }

}
