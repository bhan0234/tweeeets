import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService 
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async generateToken(user: any) {
    console.log('JWT Secret:', this.jwtService['options']?.secret); // Check if secret is set

    const payload = { id: user.id, email: user.email , username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    // Check if email or username already exists
    const existingUser = await this.userRepository.findOne({ 
        where: [{ email: createUserDto.email }, { username: createUserDto.username }] 
    });

    if (existingUser) {
        throw new BadRequestException('Email or username already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

}
