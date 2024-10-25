import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmarPagoDto {
  @IsNotEmpty()
  @IsString()
  sesionId: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'El token debe tener 6 dígitos' })
  token: string;
}
