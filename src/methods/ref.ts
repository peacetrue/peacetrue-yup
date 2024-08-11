import {addMethod, defaultLocale, Flags, Message, Schema, TestContext} from 'yup';
// https://github.com/jquense/yup?tab=readme-ov-file#extending-built-in-schema-with-new-methods
declare module 'yup' {
  interface Schema<
    TType = any,
    TContext = any,
    TDefault = any,
    TFlags extends Flags = ''
  > {
    ref(props?: RefProps): this;
  }

  // @ts-ignore
  interface LocaleObject {
    // @ts-ignore Property 'mixed' must be of type 'MixedLocale | undefined'
    mixed?: MixedLocale;
  }

  interface MixedLocale {
    ref?: Message<{
      refLabel: string;
      rawValue: string;
    }>;
  }
}

export type RefProps = {
  name: string;
  message?: Message;
};

export function addRefMethod() {
  // @ts-ignore: Type 'typeof Schema' provides no match for the signature '(...arg: any[]): any'.
  addMethod<any>(Schema, 'ref', function (props: RefProps) {
    return this.test({
      name: 'ref',
      // @ts-ignore
      message: props.message || defaultLocale.mixed.ref,
      params: {},
      test(value: any, context: TestContext) {
        if (value == null) return true;
        // [persons[0], wives] <- persons[0].wives
        const segments = this.path.split('.');
        const length = 2;
        if (segments.length < length || this.options.from.length < length)
          throw new Error(
            'path segments length must >= 2, egg: persons[0].wives'
          );
        const segment = segments[segments.length - length]; // persons[0]
        const prop = segment.substring(0, segment.indexOf('[')); // persons
        const element = this.options.from[length - 1];
        const refValues = (element.value[prop] as any[]).map(
          item => item[props.name]
        );
        const isArray = Array.isArray(value);
        if (
          // @ts-ignore: Parameter 'item' implicitly has an 'any' type.
          (isArray && value.every(item => refValues.includes(item)))
          || (!isArray && refValues.includes(value))
        ) {
          return true;
        }
        return context.createError({
          params: {
            rawValue: isArray ? value.join(',') : value,
            refLabel: this.from[0].schema.fields[props.name].spec.label,
          },
        });
      },
    });
  });
}
