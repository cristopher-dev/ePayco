export interface SaldoRespuesta {
  documento: string;
  nombres: string;
  email: string;
  saldo: number;
  ultimosMovimientos: {
    tipo: string;
    valor: number;
    fecha?: Date;
  }[];
}
