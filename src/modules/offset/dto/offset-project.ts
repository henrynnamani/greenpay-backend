import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OffsetProjectDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  offsetAmount: number;
}
