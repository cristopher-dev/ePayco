import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum EstadoTransaccion {
  COMPLETADA = 'COMPLETADA',
  FALLIDA = 'FALLIDA',
}

@Schema({ timestamps: true })
export class Transaccion extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  clienteId: Types.ObjectId;

  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  valor: number;

  @Prop({ required: true })
  saldoAnterior: number;

  @Prop({ required: true })
  saldoNuevo: number;

  @Prop({ required: true })
  estado: EstadoTransaccion;

  @Prop({ type: Types.ObjectId, ref: 'SesionPago' })
  sesionPagoId: Types.ObjectId;
}

export const TransaccionSchema = SchemaFactory.createForClass(Transaccion);
