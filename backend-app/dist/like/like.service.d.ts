import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Tweet } from '../tweets/entities/tweet.entity';
import { User } from '../user/entities/user.entity';
export declare class LikeService {
    private likeRepository;
    private tweetRepository;
    constructor(likeRepository: Repository<Like>, tweetRepository: Repository<Tweet>);
    toggleLike(user: User, tweetId: number): Promise<{
        liked: boolean;
    }>;
    getLikedTweets(user: User): Promise<Tweet[]>;
}
