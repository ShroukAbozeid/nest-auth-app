import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AccessTokenPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  id: number;
}