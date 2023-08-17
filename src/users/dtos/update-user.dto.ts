import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  name: string;
  
  @IsBoolean()
  @IsOptional()
  emailConfirmed: boolean;
}