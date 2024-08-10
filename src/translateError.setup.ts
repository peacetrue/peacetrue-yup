import {addGlobalErrorHandlers} from "./globalErrorHandlers";
import {buildFormatErrorTranslate, getTranslateLocale, translateError} from "./translateError";

addGlobalErrorHandlers(error =>
  translateError(error, buildFormatErrorTranslate(getTranslateLocale()))
);
