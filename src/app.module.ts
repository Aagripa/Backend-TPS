import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { LoggingInterceptor } from './core/modules/interceptors/logging.interceptor'; // Pastikan Anda mengimpor LoggingInterceptor dari lokasi yang benar
import { DatabaseModule } from './core/database/Database.module';
import { AuthModule } from './core/modules/auth/auth.module';
import { UsersModule } from './core/modules/users/users.module';
import { ProjectModule } from './core/modules/project/project.module';
import { TeamModule } from './core/modules/team/team.module';
import { MemberModule } from './core/modules/member/member.module';
import { TaskModule } from './core/modules/task/task.module';
import { MailModule } from './core/modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProjectModule,
    TeamModule,
    MemberModule,
    TaskModule,
    MailModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Implementasikan konfigurasi middleware di sini jika diperlukan
    // Contoh:
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
