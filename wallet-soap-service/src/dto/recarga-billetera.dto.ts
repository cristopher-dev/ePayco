import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class RecargaBilleteraDto {
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  documento: string;

  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  celular: string;

  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsNumber()
  @Min(1000, { message: 'El valor mínimo de recarga es 1000' })
  valor: number;
}
