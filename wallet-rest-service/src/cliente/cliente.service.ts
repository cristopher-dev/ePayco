import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RegistroClienteDto } from '../dto/registro-cliente.dto';
import { ConfigService } from '@nestjs/config';
import { ServiceResponse } from '../interfaces/response.interface';
import { RecargaBilleteraDto } from '../dto/recarga-billetera.dto';
import { IniciarPagoDto } from '../dto/iniciar-pago.dto';
import { ConfirmarPagoDto } from '../dto/confirmar-pago.dto';
import { ConsultarSaldoDto } from '../dto/consultar-saldo.dto';

@Injectable()
export class ClienteService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async registroCliente(datos: RegistroClienteDto): Promise<ServiceResponse> {
    const soapUrl = this.configService.get<string>('SOAP_SERVICE_URL');

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${soapUrl}/soap/cliente/registro`,
        datos,
      );

      return data;
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error al comunicarse con el servicio SOAP',
        data: null,
      };
    }
  }
  async recargarBilletera(datos: RecargaBilleteraDto) {
    const soapUrl = this.configService.get<string>('SOAP_SERVICE_URL');

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${soapUrl}/soap/cliente/recarga`,
        datos,
      );

      return data;
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error al comunicarse con el servicio SOAP',
        data: null,
      };
    }
  }
  async iniciarPago(datos: IniciarPagoDto) {
    const soapUrl = this.configService.get<string>('SOAP_SERVICE_URL');

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${soapUrl}/soap/cliente/iniciar-pago`,
        datos,
      );

      return data;
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error al comunicarse con el servicio SOAP',
        data: null,
      };
    }
  }

  async confirmarPago(datos: ConfirmarPagoDto) {
    const soapUrl = this.configService.get<string>('SOAP_SERVICE_URL');

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${soapUrl}/soap/cliente/confirmar-pago`,
        datos,
      );

      return data;
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error al comunicarse con el servicio SOAP',
        data: null,
      };
    }
  }
  async consultarSaldo(datos: ConsultarSaldoDto) {
    const soapUrl = this.configService.get<string>('SOAP_SERVICE_URL');

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${soapUrl}/soap/cliente/consultar-saldo`,
        datos,
      );

      return data;
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        cod_error: '99',
        message_error: 'Error al comunicarse con el servicio SOAP',
        data: null,
      };
    }
  }
}
