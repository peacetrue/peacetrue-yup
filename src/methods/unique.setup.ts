import {addMethod, array, defaultLocale, TestContext} from "yup";
import _ from "lodash";
import {UniqueExtra, UniqueProps} from "./unique";

function rawValue(key: string, _record: Record<string, number[]>) {
  return `${key}`;
  // return `${key}[${record[key].join(",")}]`;
}

addMethod(array, 'unique', function (props: UniqueProps = {}) {
  return this.test({
    name: "unique",
    // @ts-ignore
    message: props.message || defaultLocale.array.unique || "${path} must be unique, ${itemLabel}${rawValue} is duplicated!",
    params: {itemLabel: "value", rawValue: ""} as UniqueExtra,
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
        return value.length === new Set(value).size
          || context.createError({
            params: {itemLabel,},
          });
      }

      const grouped = _(value)
        .map((item, index) => ({value: item, index}))
        .groupBy('value')
        .pickBy((value, _key) => value.length > 1)
        .mapValues((value, _key) => value.map(item => item.index))
        .value()
      ;
      const keys = Object.keys(grouped);
      if (keys.length > 0) {
        return context.createError({
          params: {itemLabel, rawValue: keys.map(key => rawValue(key, grouped)).join(','),},
        });
      }
      return true;
    }
  });
});



