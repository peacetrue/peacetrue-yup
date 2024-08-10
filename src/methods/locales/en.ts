import {LocaleObject} from "yup";

export const peaceEnMessages: LocaleObject = {
  mixed: {
    // @ts-ignore
    ref: "${path} must be a valid reference, the value '${rawValue}' does not exist in ${refLabel}!",
  },
  array: {
    // @ts-ignore
    unique: "${path} must be unique，${itemLabel}${rawValue} is duplicated!",
  }
};
