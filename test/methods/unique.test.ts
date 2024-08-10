import {consoleLogger} from "peacetrue-logger";
import * as Yup from "yup";
import "../../src/methods/unique.setup"
import {peaceLocaleMessages} from "../../src";
Yup.setLocale(peaceLocaleMessages.zh);
let arraySchema =
  Yup.array(Yup.string().label("妻子").required())
    .label("妻子集合").required();
test('error', () => {
  expect(() => {
    arraySchema.validateSync(null, {abortEarly: false})
    // this is a required field
  }).toThrow(Yup.ValidationError);

  try {
    arraySchema.validateSync(null, {abortEarly: false});
  } catch (e) {
    const error = e as Yup.ValidationError;
    consoleLogger.error("result: \n", error.errors.join("\n"));
  }
});

test('unique', () => {
  try {
    let _arraySchema = arraySchema.unique({verbose: true,})
    _arraySchema.validateSync(['刘亦菲', '刘亦菲', '李小璐', '李小璐'], {abortEarly: false});
  } catch (e) {
    const error = e as Yup.ValidationError;
    consoleLogger.error("result: \n", error.errors.join("\n"));
  }
});

let personsSchema = Yup.array(Yup.object({
  name: Yup.string().label("姓名").required()
}).required().label("人物")).label("人物集合");

test('unique-persons', () => {
  try {
    personsSchema.unique({fieldName: 'name',}).validateSync([{name: '刘亦菲'}, {name: '刘亦菲'}, {name: '李小璐'}, {name: '李小璐'}], {abortEarly: false});
  } catch (e) {
    const error = e as Yup.ValidationError;
    // expect(error.message).toEqual("");
    consoleLogger.error("result: \n", error.errors.join("\n"));
  }
});

test('unique-persons-verbose', () => {
  try {
    personsSchema.unique({fieldName: 'name', verbose: true,}).validateSync([{name: '刘亦菲'}, {name: '刘亦菲'}, {name: '李小璐'}, {name: '李小璐'}], {abortEarly: false});
  } catch (e) {
    const error = e as Yup.ValidationError;
    consoleLogger.error("result: \n", error.errors.join("\n"));
  }
});
