import * as Yup from 'yup';

type DeepRequired<T> = {
  [K in keyof T]-?: DeepRequired<T[K]>;
};
export const metaMessages: DeepRequired<Yup.LocaleObject> = {
  mixed: {
    default: 'mixed.default',
    required: 'mixed.required',
    oneOf: 'mixed.oneOf',
    notOneOf: 'mixed.notOneOf',
    notType: 'mixed.notType',
    defined: 'mixed.defined',
    notNull: 'mixed.notNull',
  },
  string: {
    length: 'string.length',
    min: 'string.min',
    max: 'string.max',
    matches: 'string.matches',
    email: 'string.email',
    url: 'string.url',
    uuid: 'string.uuid',
    trim: 'string.trim',
    lowercase: 'string.lowercase',
    uppercase: 'string.uppercase',
    datetime: 'string.datetime',
    datetime_offset: 'string.datetime_offset',
    datetime_precision: 'string.datetime_precision',
  },
  number: {
    min: 'number.min',
    max: 'number.max',
    lessThan: 'number.lessThan',
    moreThan: 'number.moreThan',
    positive: 'number.positive',
    negative: 'number.negative',
    integer: 'number.integer',
  },
  date: {
    min: 'date.min',
    max: 'date.max',
  },
  boolean: {
    isValue: 'boolean.isValue',
  },
  object: {
    noUnknown: 'object.noUnknown',
  },
  array: {
    min: 'array.min',
    max: 'array.max',
    length: 'array.length',
  },
  tuple: {
    notType: 'tuple.notType',
  },
};

export const PROP_META = 'meta';
export const yupMetaLocaleMessages: Record<
  string,
  Required<Yup.LocaleObject>
> = {
  [PROP_META]: metaMessages,
};
