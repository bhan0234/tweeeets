import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Req } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const token = await this.userService.generateToken(user);
    return { ...token, user };
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.userService.generateToken(user);
    return { ...token, user };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: any): Promise<User> {
    const user = await this.userService.findOne(req.user.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Get('/verify')
  @UseGuards(JwtAuthGuard)
  async verifyUser(@Req() req: any) {
    return { user: req.user }; // Return user details if the token is valid
  }
}
