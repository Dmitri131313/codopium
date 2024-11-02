//import { TestBed } from '@angular/core/testing';
import {UrlPatternsGroupValidator} from "./url-patterns-group.validator";
import {AbstractControl, FormControl, ValidatorFn} from "@angular/forms";

const validUrlPatterns = [
  '',
  ' ',
  'https://*/',
  'https://*/message/second/',
  'https://*.mail.ru/',
  'https://mail.ru/',
  'http://e.sub.mail.ru/',
  'https://mail.ru/',
  'https://mail.ru/message/',
  '!https://mail.ru/message/',
  'https://mail.ru/message/#test-test',
  'https://mail.ru/message/?param1=v1&param2=v2',
  'https://mail.ru/message/?param1=v1&param2=v2#test',
  'https://habr.com/*, ',
  'https://habr.com/*, https://mail.ru/',
]
const invalidUrlPatterns = [
  'https://mail.ru',
  'ftp://www.mail.ru/',
  'https://habr.com/*, https://mail.ru',
]

describe('Testing url patterns validation', () => {

    const testInvalidResult = {wrongPatternsGroup: true}
    const testValidResult = null
    const urlPatternsAndExpectedValidValidationResults = new Map(validUrlPatterns.map((urlPattern: string) => [urlPattern, testValidResult]))
    const urlPatternsAndExpectedInvalidValidationResults = new Map(invalidUrlPatterns.map((urlPattern: string) => [urlPattern, testInvalidResult]))
    const urlPatternsAndExpectedValidationResults = new Map([...urlPatternsAndExpectedInvalidValidationResults, ...urlPatternsAndExpectedValidValidationResults])
    for (let [urlPattern, expectedValidationResult] of urlPatternsAndExpectedValidationResults.entries()) {
      const testingControl: AbstractControl = new FormControl(urlPattern)
      const validateFunction: ValidatorFn = UrlPatternsGroupValidator.urlPatternsGroupValidator()
      it(`Testing url pattern validation: ${urlPattern}`, () => {
        expect(validateFunction(testingControl)).toEqual(expectedValidationResult);
      })
    }


})
