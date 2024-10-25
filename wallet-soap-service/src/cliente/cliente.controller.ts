import { Controller, Post, Body } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { RegistroClienteDto } from '../dto/registro-cliente.dto';
import { RecargaBilleteraDto } from '../dto/recarga-billetera.dto';
import { IniciarPagoDto } from '../dto/iniciar-pago.dto';
import { ConfirmarPagoDto } from '../dto/confirmar-pago.dto';
import { ConsultarSaldoDto } from '../dto/consultar-saldo.dto';
@Controller('soap/cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('registro')
  async registroCliente(@Body() datos: RegistroClienteDto) {
    console.log('SOAP:Registro > Recibida petición de registro:', datos);
    return await this.clienteService.registroCliente(datos);
  }

  @Post('recarga')
  async recargarBilletera(@Body() datos: RecargaBilleteraDto) {
    console.log('SOAP:Recarga > Recibida petición de registro:', datos);
    return await this.clienteService.recargarBilletera(datos);
  }

  @Post('iniciar-pago')
  async iniciarPago(@Body() datos: IniciarPagoDto) {
    console.log('SOAP:Pagar > Recibida petición de registro:', datos);
    return await this.clienteService.iniciarPago(datos);
  }

  @Post('confirmar-pago')
  async confirmarPago(@Body() datos: ConfirmarPagoDto) {
    console.log('SOAP:confirmar > Recibida petición de registro:', datos);
    return await this.clienteService.confirmarPago(datos);
  }
  @Post('consultar-saldo')
  async consultarSaldo(@Body() datos: ConsultarSaldoDto) {
    return await this.clienteService.consultarSaldo(datos);
  }
}
