import * as Yup from "yup";
import {consoleLogger} from "peacetrue-logger";
import {yupMetaLocaleMessages} from "../src";
import {peaceLocaleMessages} from "../src";
import * as yupLocaleMessages from "yup-locales";
import {addLocaleMessages,} from "../src";
import "../src/setup";

test('string', () => {
  try {
    addLocaleMessages(yupLocaleMessages as any);
    addLocaleMessages(yupMetaLocaleMessages);
    addLocaleMessages(peaceLocaleMessages);
    Yup.object({
      person: Yup.object({
        name: Yup.string().label("姓名").required(),
        nickname: Yup.string().label("昵称").required(),
      }).label("人物")
    }).validateSync({}, {abortEarly: false});
  } catch (e) {
    if (e instanceof Yup.ValidationError)
      consoleLogger.error("result: \n", e.errors.join("\n"));
    else
      throw e;
  }
});
