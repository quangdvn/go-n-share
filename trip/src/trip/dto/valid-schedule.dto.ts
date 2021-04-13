import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';

export function ValidSchedule(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ValidScheduleConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidSchedule', async: false })
export class ValidScheduleConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value === 'string') {
      return (
        dayjs(value, 'YYYY-MM-DD').diff(dayjs().add(7, 'days'), 'day') >= 0
      );
    }
    return false;
  }

  defaultMessage() {
    return `Ngày khởi hành không đúng quy định`;
  }
}
