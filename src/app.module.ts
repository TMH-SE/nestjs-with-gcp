import {
  Inject,
  Module,
  OnApplicationBootstrap,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import configuration from './config/configuration';
import { Environment, EnvironmentConfig } from './config/env.configuration';
import { AppSeeder } from './seeder';
import { FirebaseModule } from './shared/modules/firebase/firebase.module';
import { DatabaseModule } from './shared/modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { appProviders, APP_SEEDER } from './app.providers';
@Module({
  imports: [
    FirebaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
    }),
    DatabaseModule,
    UserModule,
  ],
  providers: [
    ...appProviders,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          exposeUnsetFields: false,
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transformerPackage: {
          plainToClass: plainToInstance,
          classToPlain: instanceToPlain,
        },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  static port: number;
  static nodeEnv: Environment;

  constructor(
    @Inject(EnvironmentConfig.KEY)
    private readonly env: ConfigType<typeof EnvironmentConfig>,
    @Inject(APP_SEEDER)
    private readonly seeder: AppSeeder,
  ) {
    AppModule.port = this.env.port;
    AppModule.nodeEnv = this.env.nodeEnv;
  }

  async onApplicationBootstrap() {
    await this.seeder.perform();
  }
}
