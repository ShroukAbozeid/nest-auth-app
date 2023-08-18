import { IsEmail, IsString, IsNotEmpty, IsIn, IsBoolean } from "class-validator";

const providers = ['email', 'google', 'twitter', 'facebook']

export class GoogleUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsIn(providers)
  provider: string;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  emailConfirmed: boolean
}