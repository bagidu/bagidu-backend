import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { JwtStrategy } from './jwt.strategy'
import { AuthResolver } from './graphql/auth.resolver'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET') ||
          /* istanbul ignore next */
          'developSecretKey',
        signOptions: { expiresIn: '30m' }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService, AuthResolver],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule { }
