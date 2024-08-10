import {Flags, Message} from 'yup';
// https://github.com/jquense/yup?tab=readme-ov-file#extending-built-in-schema-with-new-methods
declare module 'yup' {
  interface Schema<TType = any, TContext = any, TDefault = any, TFlags extends Flags = ''> {
    ref(props?: RefProps): this;
  }

  interface LocaleObject {
    // @ts-ignore
    mixed?: MixedLocale;
  }

  interface MixedLocale {
    ref?: Message<{
      refLabel: string;
      rawValue: string,
    }>;
  }
}

export type RefProps = {
  name: string,
  message?: Message,
};


