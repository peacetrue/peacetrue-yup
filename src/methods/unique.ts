import {
  addMethod,
  array,
  defaultLocale,
  Flags,
  Message,
  TestContext,
} from 'yup';
import _ from 'lodash';
// https://github.com/jquense/yup?tab=readme-ov-file#extending-built-in-schema-with-new-methods
// https://github.com/jquense/yup/issues/345
declare module 'yup' {
  // eslint-disable-next-line no-unused-vars
  interface ArraySchema<
    TIn extends any[] | null | undefined,
    TContext,
    TDefault = undefined,
    TFlags extends Flags = ''
  > {
    unique(props?: UniqueProps): this;
  }

  interface ArrayLocale {
    unique?: Message<UniqueExtra>;
  }
}

export type UniqueProps = {
  /** if the item of array is object, fieldName used to associate a unique field */
  fieldName?: string;
  /** get the duplicated values */
  verbose?: boolean;
  /** custom message */
  message?: Message<UniqueExtra>;
};

export type UniqueExtra = {
  /** if {@link UniqueProps#fieldName} assigned, this will be fieldLabel */
  itemLabel: string;
  /** value join by ',' */
  rawValue?: string;
};

/** `${key}[${record[key].join(",")}]` */
function rawValue(key: string, _record: Record<string, number[]>) {
  return `${key}`;
}

export function addUniqueMethod() {
  addMethod(array, 'unique', function(props: UniqueProps = {}) {
    return this.test({
      name: 'unique',
      // @ts-ignore
      message: props.message || defaultLocale.array.unique,
      params: { itemLabel: 'value', rawValue: '' } as UniqueExtra,
      test(value: any[] | undefined, context: TestContext) {
        if (!value || value.length <= 1) return true;
        // arraySchema, itemSchema, fieldSchema
        let itemSchema = context.schema.innerType;
        const fieldName = props.fieldName;
        if (fieldName) {
          // itemSchema <- fieldSchema
          itemSchema = itemSchema.fields[fieldName];
          value = value.map((item: any) => item[fieldName]);
        }
        const itemLabel = itemSchema.spec.label;
        if (props.verbose !== true) {
          return (
            value.length === new Set(value).size ||
            context.createError({
              params: { itemLabel },
            })
          );
        }

        const grouped = _.chain(value)
          .map((item, index) => ({ value: item, index }))
          .groupBy('value')
          // @ts-ignore: 'pickBy' does not exist on type 'ObjectChain<Dictionary<{ value: any; index: number; }[]>>'
          .pickBy((value, _key) => value.length > 1)
          // @ts-ignore: Parameter 'value' implicitly has an 'any' type.
          .mapValues((value, _key) => value.map(item => item.index))
          .value();
        const keys = Object.keys(grouped);
        if (keys.length > 0) {
          return context.createError({
            params: {
              itemLabel,
              rawValue: keys.map(key => rawValue(key, grouped)).join(','),
            },
          });
        }
        return true;
      },
    });
  });
}
