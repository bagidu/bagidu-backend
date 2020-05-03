import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @Get()
    // async index() {
    //     return this.userService.all()
    // }

    // @Get(':id')
    // async detail(@Param('id') id: string) {
    //     const user = await this.userService.findById(id)
    //     if (!user) {
    //         throw new NotFoundException('User not found')
    //     }
    //     return user
    // }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const emailExists = await this.userService.findBy({ email: createUserDto.email })
        if (emailExists) {
            throw new BadRequestException('Email already in use')
        }

        const usernameExists = await this.userService.findBy({ username: createUserDto.username })
        if (usernameExists) {
            throw new BadRequestException('Username already in use')
        }

        return this.userService.create(createUserDto)
    }

}
