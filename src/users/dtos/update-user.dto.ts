import { IsBoolean, IsOptional, IsString, IsNotEmpty, IsStrongPassword } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;
  
  @IsBoolean()
  @IsOptional()
  emailConfirmed: boolean;
}