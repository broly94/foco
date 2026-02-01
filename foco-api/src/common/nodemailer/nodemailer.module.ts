import { Module } from '@nestjs/common';
import { NodemailerService } from '@app/common/nodemailer/services/nodemailer.service';
import { NodemailerController } from '@app/common/nodemailer/controllers/nodemailer.controller';
import { MailerModule } from 'nestjs-mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@app/users/entities/users.entity';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        config: {
          transport: {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          },
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [NodemailerService],
  controllers: [NodemailerController],
  exports: [NodemailerModule],
})
export class NodemailerModule {}
