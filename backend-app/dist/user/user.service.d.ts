import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    findOne(id: number): Promise<User>;
    validateUser(email: string, password: string): Promise<User | null>;
    generateToken(user: any): Promise<{
        accessToken: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<User>;
}
