import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Tweet {
    id: number;
    content: string;
    user: User;
    likes: Like[];
    isRetweet: boolean;
    createdAt: Date;
    updatedAt: Date;
    originalTweet: Tweet;
}
