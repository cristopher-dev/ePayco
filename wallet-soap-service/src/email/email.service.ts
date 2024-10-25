import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarTokenPago(email: string, token: string, valor: number) {
    try {
      console.log(
        `<h1>Token de confirmación de pago</h1>
          <p>Tu token para confirmar el pago de $${valor} es:</p>
          <h2>${token}</h2>
          <p>Este token expirará en 1 hora.</p>`,
      );
      // await this.mailerService.sendMail({
      //   to: email,
      //   subject: 'Token de confirmación de pago',
      //   html: `
      //     <h1>Token de confirmación de pago</h1>
      //     <p>Tu token para confirmar el pago de $${valor} es:</p>
      //     <h2>${token}</h2>
      //     <p>Este token expirará en 1 hora.</p>
      //   `,
      // });
      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }
  async enviarConfirmacionPago(
    email: string,
    valor: number,
    saldoNuevo: number,
    transaccionId: string,
  ) {
    console.log(
      `<h1>Pago Confirmado</h1>
        <p>Tu pago ha sido procesado exitosamente:</p>
        <ul>
          <li>Valor: $${valor}</li>
          <li>Saldo restante: $${saldoNuevo}</li>
          <li>ID de transacción: ${transaccionId}</li>
          <li>Fecha: ${new Date().toLocaleString()}</li>
        </ul>`,
    );
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Confirmación de Pago',
    //   html: `
    //     <h1>Pago Confirmado</h1>
    //     <p>Tu pago ha sido procesado exitosamente:</p>
    //     <ul>
    //       <li>Valor: $${valor}</li>
    //       <li>Saldo restante: $${saldoNuevo}</li>
    //       <li>ID de transacción: ${transaccionId}</li>
    //       <li>Fecha: ${new Date().toLocaleString()}</li>
    //     </ul>
    //   `,
    // });
  }
}
