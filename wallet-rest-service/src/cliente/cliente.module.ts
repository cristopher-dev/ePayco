import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClienteController } from './cliente.controller';
import { ConfigModule } from '@nestjs/config';
import { ClienteService } from './cliente.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
