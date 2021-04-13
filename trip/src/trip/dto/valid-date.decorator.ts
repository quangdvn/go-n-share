import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';

export function ValidDate(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ValidDateConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidDate', async: false })
export class ValidDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value === 'string') {
      // console.log(value);
      // const test = dayjs('2021/04/17');

      // const test1 = dayjs().add(8, 'days');

      // console.log(test.diff(test1, 'day'));

      return (
        /^[1-9]\d*[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])$/.test(value) &&
        dayjs(value, 'YYYY-MM-DD').isValid()
      );
    }
    return false;
  }

  defaultMessage() {
    return `Ngày khởi hành không đúng định dạng`;
  }
}
