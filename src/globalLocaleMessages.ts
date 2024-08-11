import { LocaleObject, Message, setLocale as setLocalMessages } from 'yup';
import { PROP_META } from './locales';
import get from 'lodash/get';

const globalLocaleMessages: Record<string, LocaleObject>[] = [];
let globalLocale: string = PROP_META;

export function addLocaleMessages(...locales: Record<string, LocaleObject>[]) {
  globalLocaleMessages.push(...locales);
  _setLocale(locales, globalLocale);
}

export function setGlobalLocale(locale: string) {
  globalLocale = locale;
  _setLocale(globalLocaleMessages, globalLocale);
}

export function getGlobalLocale() {
  return globalLocale;
}

function _setLocale(
  localeMessages: Record<string, LocaleObject>[],
  locale: string
) {
  localeMessages.forEach(
    value => locale in value && setLocalMessages(value[locale])
  );
}

export function getLocaleMessage<Extra extends Record<string, unknown> = any>(
  locale: string,
  key: string
) {
  for (const globalLocale of globalLocaleMessages) {
    const messages = globalLocale[locale];
    if (messages) {
      const message = get(messages, key);
      if (message) return message as Message<Extra>;
    }
  }
  return key;
  // throw new Error(`Can't get message from ${key} at ${locale}`);
}
