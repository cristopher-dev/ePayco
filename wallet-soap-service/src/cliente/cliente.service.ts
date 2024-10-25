import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cliente } from '../schemas/cliente.schema';
import { RegistroClienteDto } from '../dto/registro-cliente.dto';
import { RecargaBilleteraDto } from '../dto/recarga-billetera.dto';
import { ServiceResponse } from '../interfaces/response.interface';
import { SesionPago } from '../schemas/sesion-pago.schema';
import { Transaccion, EstadoTransaccion } from '../schemas/transaccion.schema';
import { ConfirmarPagoDto } from '../dto/confirmar-pago.dto';
import { IniciarPagoDto } from '../dto/iniciar-pago.dto';
import { ConsultarSaldoDto } from '../dto/consultar-saldo.dto';
import { SaldoRespuesta } from '../interfaces/saldo-respuesta.interface';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<Cliente>,
    @InjectModel(SesionPago.name) private sesionPagoModel: Model<SesionPago>,
    @InjectModel(Transaccion.name) private transaccionModel: Model<Transaccion>,
    private readonly emailService: EmailService,
  ) {}
  private generarToken(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
  async registroCliente(
    datos: RegistroClienteDto,
  ): Promise<ServiceResponse<Cliente>> {
    try {
      const clienteExistente = await this.clienteModel.findOne({
        $or: [{ documento: datos.documento }, { email: datos.email }],
      });

      if (clienteExistente) {
        return {
          success: false,
          cod_error: '02',
          message_error: 'Cliente ya registrado',
          data: null,
        };
      }

      const nuevoCliente = await this.clienteModel.create(datos);

      return {
        success: true,
        cod_error: '00',
        message_error: '',
        data: nuevoCliente,
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null,
      };
    }
  }
  async recargarBilletera(
    datos: RecargaBilleteraDto,
  ): Promise<ServiceResponse> {
    try {
      const cliente = await this.clienteModel.findOne({
        documento: datos.documento,
        celular: datos.celular,
      });

      if (!cliente) {
        return {
          success: false,
          cod_error: '01',
          message_error: 'Cliente no encontrado',
          data: null,
        };
      }

      const saldoActual = cliente.saldo + datos.valor;

      await this.clienteModel.updateOne(
        { _id: cliente._id },
        { $set: { saldo: saldoActual } },
      );

      return {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          documento: cliente.documento,
          saldoAnterior: cliente.saldo,
          valorRecarga: datos.valor,
          saldoNuevo: saldoActual,
        },
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null,
      };
    }
  }

  async iniciarPago(datos: IniciarPagoDto): Promise<ServiceResponse> {
    try {
      const cliente = await this.clienteModel.findOne({
        documento: datos.documento,
        celular: datos.celular,
      });

      if (!cliente) {
        return {
          success: false,
          cod_error: '01',
          message_error: 'Cliente no encontrado',
          data: null,
        };
      }

      if (cliente.saldo < datos.valor) {
        return {
          success: false,
          cod_error: '02',
          message_error: 'Saldo insuficiente',
          data: null,
        };
      }

      const token = this.generarToken();
      const fechaExpiracion = new Date(Date.now() + 3600000);

      const sesionPago = await this.sesionPagoModel.create({
        documento: cliente.documento,
        valor: datos.valor,
        token: token,
        estado: 'PENDIENTE',
        fechaExpiracion,
      });
      // console.log(
      //   'Email: ',
      //   cliente.email,
      //   'Token: ',
      //   token,
      //   'Valor: ',
      //   datos.valor,
      // );
      await this.emailService.enviarTokenPago(
        cliente.email,
        token,
        datos.valor,
      );

      return {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          sesionId: sesionPago._id,
          mensaje: 'Token enviado al correo registrado',
          valor: datos.valor,
        },
      };
    } catch (error) {
      console.log('Error: ', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null,
      };
    }
  }

  async confirmarPago(datos: ConfirmarPagoDto): Promise<ServiceResponse> {
    try {
      const sesionPago = await this.sesionPagoModel.findOne({
        _id: new Types.ObjectId(datos.sesionId),
        estado: 'PENDIENTE',
      });

      if (!sesionPago) {
        return {
          success: false,
          cod_error: '01',
          message_error: 'Sesión de pago no encontrada o ya procesada',
          data: null,
        };
      }

      if (sesionPago.token !== datos.token) {
        await this.sesionPagoModel.updateOne(
          { _id: sesionPago._id },
          {
            $inc: { intentos: 1 },
            $set: {
              estado: sesionPago.intentos >= 2 ? 'CANCELADO' : 'PENDIENTE',
            },
          },
        );

        return {
          success: false,
          cod_error: '03',
          message_error: 'Token inválido',
          data: null,
        };
      }

      if (new Date() > new Date(sesionPago.fechaExpiracion)) {
        await this.sesionPagoModel.updateOne(
          { _id: sesionPago._id },
          { $set: { estado: 'EXPIRADO' } },
        );

        return {
          success: false,
          cod_error: '03',
          message_error: 'Token expirado',
          data: null,
        };
      }

      const cliente = await this.clienteModel.findOne({
        documento: sesionPago.documento,
      });

      if (!cliente) {
        return {
          success: false,
          cod_error: '01',
          message_error: 'Cliente no encontrado',
          data: null,
        };
      }

      if (cliente.saldo < sesionPago.valor) {
        await this.sesionPagoModel.updateOne(
          { _id: sesionPago._id },
          { $set: { estado: 'FALLIDO', motivoFallo: 'SALDO_INSUFICIENTE' } },
        );

        return {
          success: false,
          cod_error: '04',
          message_error: 'Saldo insuficiente',
          data: null,
        };
      }

      const saldoAnterior = cliente.saldo;
      const saldoNuevo = saldoAnterior - sesionPago.valor;

      const clienteActualizado = await this.clienteModel.findOneAndUpdate(
        {
          _id: cliente._id,
          saldo: saldoAnterior,
        },
        {
          $set: { saldo: saldoNuevo },
        },
        { new: true },
      );

      if (!clienteActualizado) {
        return {
          success: false,
          cod_error: '05',
          message_error:
            'Error al actualizar saldo, por favor intente nuevamente',
          data: null,
        };
      }

      const transaccion = await this.transaccionModel.create({
        clienteId: cliente._id,
        tipo: 'PAGO',
        valor: sesionPago.valor,
        saldoAnterior,
        saldoNuevo,
        estado: EstadoTransaccion.COMPLETADA,
        sesionPagoId: sesionPago._id,
      });

      await this.sesionPagoModel.updateOne(
        { _id: sesionPago._id },
        {
          $set: {
            estado: 'COMPLETADO',
            fechaCompletado: new Date(),
          },
        },
      );

      try {
        await this.emailService.enviarConfirmacionPago(
          cliente.email,
          sesionPago.valor,
          saldoNuevo,
          transaccion._id.toString(),
        );
      } catch (emailError) {
        console.error('Error al enviar email de confirmación:', emailError);
      }

      return {
        success: true,
        cod_error: '00',
        message_error: '',
        data: {
          transaccionId: transaccion._id,
          valor: sesionPago.valor,
          saldoAnterior,
          saldoNuevo,
          fecha: new Date(),
        },
      };
    } catch (error) {
      console.error('Error en confirmarPago:', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null,
      };
    }
  }
  async consultarSaldo(
    datos: ConsultarSaldoDto,
  ): Promise<ServiceResponse<SaldoRespuesta>> {
    try {
      const cliente = await this.clienteModel.findOne({
        documento: datos.documento,
        celular: datos.celular,
      });

      if (!cliente) {
        return {
          success: false,
          cod_error: '01',
          message_error: 'Cliente no encontrado',
          data: null,
        };
      }

      const ultimosMovimientos = await this.transaccionModel
        .find({
          clienteId: cliente._id,
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('tipo valor createdAt');

      const respuesta: SaldoRespuesta = {
        documento: cliente.documento,
        nombres: cliente.nombres,
        email: cliente.email,
        saldo: cliente.saldo,
        ultimosMovimientos: ultimosMovimientos.map((mov) => ({
          tipo: mov.tipo,
          valor: mov.valor,
        })),
      };

      return {
        success: true,
        cod_error: '00',
        message_error: '',
        data: respuesta,
      };
    } catch (error) {
      console.error('Error en consultarSaldo:', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error interno del servidor',
        data: null,
      };
    }
  }
}
