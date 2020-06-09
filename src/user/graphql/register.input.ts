import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsEmail } from 'class-validator'

@InputType()
export class RegisterInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsNotEmpty()
    password: string;
}