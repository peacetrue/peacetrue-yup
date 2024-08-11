import { consoleLogger } from 'peacetrue-logger';
import * as Yup from 'yup';
import '../../src/methods/ref.setup';
import { peaceLocaleMessages } from '../../src';

Yup.setLocale(peaceLocaleMessages.zh);

let clanSchema = Yup.object({
  persons: Yup.array(
    Yup.object({
      name: Yup.string()
        .label('姓名')
        .required(),
      parent: Yup.string()
        .label('父亲')
        .ref({ name: 'name' }),
      wives: Yup.array(Yup.string().required())
        .label('妻子')
        .ref({ name: 'name' }),
    })
      .required()
      .label('人物')
  ).label('人物集合'),
})
  .label('族谱')
  .required();

test('ref', () => {
  try {
    clanSchema.validateSync(
      {
        persons: [
          { name: '李小璐' },
          { name: '刘亦菲', parent: '李小璐1', wives: ['李小璐1'] },
        ],
      },
      { abortEarly: false }
    );
  } catch (e) {
    const error = e as Yup.ValidationError;
    // expect(error.message).toEqual("");
    consoleLogger.error('result: \n', error.errors.join('\n'));
  }
});
