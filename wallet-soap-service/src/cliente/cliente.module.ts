import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { Cliente, ClienteSchema } from '../schemas/cliente.schema';
import { Transaccion, TransaccionSchema } from '../schemas/transaccion.schema';
import { SesionPago, SesionPagoSchema } from 'src/schemas/sesion-pago.schema';
import { EmailModule } from '../email/email.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cliente.name, schema: ClienteSchema },
      { name: Transaccion.name, schema: TransaccionSchema },
      { name: SesionPago.name, schema: SesionPagoSchema },
    ]),
    EmailModule,
  ],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
