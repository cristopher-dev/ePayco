export interface SesionPago {
  id: string;
  documento: string;
  valor: number;
  token: string;
  fechaCreacion: Date;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO';
}
