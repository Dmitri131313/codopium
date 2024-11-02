import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class UrlPatternsGroupValidator {

  static urlPatternsGroupValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const urlPatternsGroupCommaSeparated = (control.value ?? '').trim()
      let urlPatternsGroup = urlPatternsGroupCommaSeparated.split(',')
      if (urlPatternsGroupCommaSeparated.length === 0) {
        return null
      }
      urlPatternsGroup = urlPatternsGroup.filter((value: string) => value)
      urlPatternsGroup = urlPatternsGroup.map((urlPattern: string) => urlPattern.trim())
      const isValid: boolean = !urlPatternsGroup.some((urlPattern: string): boolean => !this.isURLPatternValid(urlPattern))
      return isValid ? null : {wrongPatternsGroup: true}
    }
  }

  private static isURLPatternValid(pattern: string): boolean {
    const regExp: RegExp = new RegExp('^!?(?<scheme>(http|https|\\*)://)(?<host>(?<subdomains_wildcard>\\*\\.)?(?<subdomains>[a-zA-Z0-9-.]+\\.)?(?<domain>[a-zA-Z0-9-]+)\\.(?<zone>[a-zA-Z]+)|\\*)(?<path>/([a-zA-Z0-9-_/*]+)?)(?:[?#].*)?$')
    return regExp.test(pattern)
  }

}
