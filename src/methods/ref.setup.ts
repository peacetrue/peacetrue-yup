import {addMethod, defaultLocale, Schema, TestContext} from "yup";
import {RefProps} from "./ref";

addMethod<any>(Schema, 'ref', function (props: RefProps) {
  return this.test({
    name: "ref",
    // @ts-ignore
    message: props.message || defaultLocale.mixed.ref,
    params: {},
    test(value: any, context: TestContext) {
      if (value == null) return true;
      // [persons[0], wives] <- persons[0].wives
      const segments = this.path.split(".");
      const length = 2;
      if (segments.length < length || this.options.from.length < length)
        throw new Error("path segments length must >= 2, egg: persons[0].wives");
      const segment = segments[segments.length - length];// persons[0]
      const prop = segment.substring(0, segment.indexOf('[')); // persons
      const element = this.options.from[length - 1];
      const refValues = (element.value[prop] as any[]).map(item => item[props.name]);
      const isArray = Array.isArray(value);
      if ((isArray && value.every(item => refValues.includes(item)))
        || (!isArray && refValues.includes(value))) {
        return true;
      }
      return context.createError({
        params: {
          rawValue: isArray ? value.join(',') : value,
          refLabel: this.from[0].schema.fields[props.name].spec.label,
        },
      });
    }
  });
});
