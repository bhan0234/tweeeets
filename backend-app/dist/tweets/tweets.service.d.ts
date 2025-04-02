import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './entities/tweet.entity';
import { User } from '../user/entities/user.entity';
import { Like } from '../like/entities/like.entity';
export declare class TweetsService {
    private tweetRepository;
    private likeRepository;
    constructor(tweetRepository: Repository<Tweet>, likeRepository: Repository<Like>);
    create(createTweetDto: CreateTweetDto, user: User): Promise<Tweet>;
    updateTweet(user: User, id: number, content: string): Promise<Tweet>;
    getAllTweets(currentUser?: User, page?: number, limit?: number): Promise<{
        tweets: Tweet[];
        total: number;
    }>;
    getUserTweets(user: User): Promise<Tweet[]>;
    remove(id: number, user: User): Promise<void>;
    retweet(user: User, tweetId: number): Promise<Tweet>;
}
