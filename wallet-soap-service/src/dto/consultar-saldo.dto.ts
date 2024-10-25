import { IsNotEmpty, IsString } from 'class-validator';

export class ConsultarSaldoDto {
  @IsNotEmpty({ message: 'El documento es requerido' })
  @IsString()
  documento: string;

  @IsNotEmpty({ message: 'El celular es requerido' })
  @IsString()
  celular: string;
}
