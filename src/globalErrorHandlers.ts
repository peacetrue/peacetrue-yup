import {Schema, ValidationError} from 'yup';
import {proxyValidate} from "./proxyValidate";

export const globalErrorHandlers: ValidationErrorHandler[] = [];
export type ValidationErrorHandler = (
  error: ValidationError,
  schema: Schema
) => void;

export function addGlobalErrorHandlers(...handlers: ValidationErrorHandler[]) {
  globalErrorHandlers.push(...handlers);
}

const defaultGlobalErrorHandler = (
  error: ValidationError,
  schema: Schema
) => globalErrorHandlers.forEach(handler => handler(error, schema));

export function addGlobalErrorHandler() {
  proxyValidate(defaultGlobalErrorHandler);
}
