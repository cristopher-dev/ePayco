import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cliente extends Document {
  @Prop({ required: true, unique: true })
  documento: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  celular: string;

  @Prop({ default: 0 })
  saldo: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
