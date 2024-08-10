import {Schema, ValidationError} from "yup";

export const globalErrorHandlers: ValidationErrorHandler[] = [];
export type ValidationErrorHandler = (error: ValidationError, schema: Schema) => void;

export function addGlobalErrorHandlers(...handlers: ValidationErrorHandler[]) {
  globalErrorHandlers.push(...handlers);
}

export const defaultGlobalErrorHandler = (error: ValidationError, schema: Schema) => globalErrorHandlers.forEach(handler => handler(error, schema));
