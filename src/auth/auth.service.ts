import * as bcrypt from 'bcrypt';
import { Prisma, User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;

  async signin(
    params: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.user({ email: params.email });
    if (!user) throw new NotFoundException('User not found');

    const passwordMatch = bcrypt.compare(params.password, user.email);
    if (!passwordMatch) throw new NotFoundException('Invalid credentials');
    const { password, ...result } = user;
    return result;
  }
}
