import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
export declare class TweetsController {
    private readonly tweetsService;
    constructor(tweetsService: TweetsService);
    create(createTweetDto: CreateTweetDto, req: any): Promise<import("./entities/tweet.entity").Tweet>;
    findAll(req: any, page?: number, limit?: number): Promise<{
        tweets: import("./entities/tweet.entity").Tweet[];
        total: number;
    }>;
    getMyTweets(req: any): Promise<import("./entities/tweet.entity").Tweet[]>;
    update(id: string, updateTweetDto: CreateTweetDto, req: any): Promise<import("./entities/tweet.entity").Tweet>;
    remove(id: string, req: any): Promise<void>;
    retweet(id: string, req: any): Promise<import("./entities/tweet.entity").Tweet>;
}
