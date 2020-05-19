import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<User | null> {
        const user = await this.userService.findBy({ $or: [{ username }, { email: username }] })
        if (user) {
            const correct = await bcrypt.compare(pass, user.password)
            if (correct) {
                return user
            }
        }
        return null
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id }
        const exp = new Date()

        exp.setMinutes(exp.getMinutes() + 15)

        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            access_token: this.jwtService.sign(payload, {
                expiresIn: '15m'
            }),
            expired: exp.getTime()
        }
    }
}
