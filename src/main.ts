import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as CookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({ origin: true, credentials: true })
  app.use(CookieParser())

  await app.listen(process.env.PORT || 3030, '0.0.0.0')
}
bootstrap()
