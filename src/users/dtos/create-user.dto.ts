import { IsEmail, IsString, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  name: string;
}