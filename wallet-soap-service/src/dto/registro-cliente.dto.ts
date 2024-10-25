import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class RegistroClienteDto {
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  documento: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombres: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  celular: string;
}
