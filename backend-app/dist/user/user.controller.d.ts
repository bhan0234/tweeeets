import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    getCurrentUser(req: any): Promise<User>;
    verifyUser(req: any): Promise<{
        user: any;
    }>;
}
