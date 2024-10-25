import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarTokenPago(email: string, token: string, valor: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Token de confirmación de pago',
      html: `
        <h1>Token de confirmación de pago</h1>
        <p>Tu token para confirmar el pago de $${valor} es:</p>
        <h2>${token}</h2>
        <p>Este token expirará en 1 hora.</p>
      `,
    });
  }
}
