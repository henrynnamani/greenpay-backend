import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: Date) {
    return date > new Date();
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a future date`;
  }
}

export class CreateSavingGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  target: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureDate)
  due: Date;
}
