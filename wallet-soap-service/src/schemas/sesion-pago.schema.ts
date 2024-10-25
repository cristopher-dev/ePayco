import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SesionPago extends Document {
  @Prop({ required: true })
  documento: string;

  @Prop({ required: true })
  valor: number;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, default: 'PENDIENTE' })
  estado: string;

  @Prop({ required: true, expires: 3600 }) // TTL de 1 hora
  fechaExpiracion: Date;

  @Prop({ default: 0 })
  intentos: number;
}

export const SesionPagoSchema = SchemaFactory.createForClass(SesionPago);
