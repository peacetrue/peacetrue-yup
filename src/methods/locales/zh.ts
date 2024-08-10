import {LocaleObject} from "yup";

export const peaceZhMessages: LocaleObject = {
  mixed: {
    // @ts-ignore
    ref: "${path}必须是有效的引用，值‘${rawValue}’不存在于${refLabel}中!",
  },
  array: {
    // @ts-ignore
    unique: "${path}必须是唯一的，${itemLabel}${rawValue}重复了!",
  }
};
