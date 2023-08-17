import { IsEmail, IsString } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}