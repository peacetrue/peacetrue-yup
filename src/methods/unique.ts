import {Flags, Message} from 'yup';
// https://github.com/jquense/yup?tab=readme-ov-file#extending-built-in-schema-with-new-methods
// https://github.com/jquense/yup/issues/345
declare module 'yup' {
  // eslint-disable-next-line no-unused-vars
  interface ArraySchema<TIn extends any[] | null | undefined, TContext, TDefault = undefined, TFlags extends Flags = ''> {
    unique(props?: UniqueProps): this;
  }

  interface ArrayLocale {
    unique?: Message<UniqueExtra>;
  }
}

export type UniqueProps = {
  /** if the item of array is object, fieldName used to associate a unique field */
  fieldName?: string,
  /** get the duplicated values */
  verbose?: boolean,
  /** custom message */
  message?: Message<UniqueExtra>,
};

export type UniqueExtra = {
  /** if {@link UniqueProps#fieldName} assigned, this will be fieldLabel */
  itemLabel: string;
  /** value join by ',' */
  rawValue?: string;
};

