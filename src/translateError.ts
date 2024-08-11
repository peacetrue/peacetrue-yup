import * as Yup from 'yup';
import { ValidationError } from 'yup';
import { getLocaleMessage } from './globalLocaleMessages';
import { addGlobalErrorHandlers } from './globalErrorHandlers';

type Translate<
  M extends string = string,
  O extends Record<string, any> = {}
> = (message: M, options?: O) => string;
let translateLocale: string = 'en';

export function setTranslateLocale(locale: string) {
  translateLocale = locale;
}

export let getTranslateLocale = () => {
  return translateLocale;
};

export function setTranslateLocaleGetter(getter: typeof getTranslateLocale) {
  getTranslateLocale = getter;
}

export function translateError(
  error: ValidationError,
  translate: Translate<string, any>
) {
  if (error.inner.length === 0) {
    error.errors.forEach((value, index, array) => {
      array[index] = translate(value, error.params);
    });
    error.message = error.errors.join('\n');
  } else {
    error.inner.forEach(value => translateError(value, translate));
    error.errors = error.inner.flatMap(value => value.errors);
    error.message = error.inner.map(value => value.message).join('\n');
  }
}

export function buildFormatErrorTranslate(
  locale: string
): Translate<string, any> {
  return (message, options) => {
    return Yup.ValidationError.formatError(
      getLocaleMessage(locale, message),
      options
    );
  };
}

export function addTranslateErrorHandler() {
  addGlobalErrorHandlers(error =>
    translateError(error, buildFormatErrorTranslate(getTranslateLocale()))
  );
}
