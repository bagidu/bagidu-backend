import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'mongoose';
import { DonationModule } from './donation/donation.module';
import { XenditModule } from './xendit/xendit.module';
import { ScheduleModule } from '@nestjs/schedule'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    UserModule,
    AuthModule,
    DonationModule,
    XenditModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  connection: Connection
  constructor(@InjectConnection() connection: Connection) {
    this.connection = connection
  }
}
