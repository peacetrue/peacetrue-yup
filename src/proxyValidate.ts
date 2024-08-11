import { Schema, ValidationError } from 'yup';
import { ValidationErrorHandler } from './globalErrorHandlers';

export function proxyValidate(errorHandler: ValidationErrorHandler) {
  const originalValidate = Schema.prototype.validate;
  Schema.prototype.validate = function(value, options) {
    try {
      return originalValidate.call(this, value, options);
    } catch (e) {
      if (e instanceof ValidationError) {
        errorHandler(e, this);
      }
      throw e;
    }
  };

  const originalValidateSync = Schema.prototype.validateSync;
  Schema.prototype.validateSync = function(value, options) {
    try {
      return originalValidateSync.call(this, value, options);
    } catch (e) {
      if (e instanceof ValidationError) {
        errorHandler(e, this);
      }
      throw e;
    }
  };
}
