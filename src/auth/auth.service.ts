import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findBy({ $or: [{ username }, { email: username }] })
        if (user) {
            const correct = await bcrypt.compare(pass, user.password)
            if (correct) {
                return user
            }
        }
        return null
    }
}
