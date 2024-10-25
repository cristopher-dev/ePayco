import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class IniciarPagoDto {
  @IsNotEmpty()
  @IsString()
  documento: string;

  @IsNotEmpty()
  @IsString()
  celular: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000, { message: 'El valor mínimo de pago es 1000' })
  valor: number;
}
