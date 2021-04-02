import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: number[], _args: ValidationArguments) {
    return value.every(
      (num, i) =>
        (i === 0 &&
          (num === value[i + 1] - 1 || num === value[value.length - 1] / 7)) ||
        num === value[i + 1] - 1 ||
        num === value[i - 1] + 1 ||
        (i === value.length - 1 &&
          (num === value[i - 1] + 1 || value[0] === num / 7)),
    );
  }

  defaultMessage() {
    return 'Lịch làm không phù hợp với quy định';
  }
}
