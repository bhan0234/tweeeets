import { Tweet } from 'src/tweets/entities/tweet.entity';
import { Like } from 'src/like/entities/like.entity';
export declare class User {
    id: number;
    email: string;
    username: string;
    password: string;
    tweets: Tweet[];
    likes: Like[];
}
