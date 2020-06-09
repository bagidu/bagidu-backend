import { HttpException, Catch, ArgumentsHost } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        // const gqlHost = GqlArgumentsHost.create(host)
        return exception
    }
}