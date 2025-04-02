import { LikeService } from './like.service';
import { Request } from 'express';
export declare class LikeController {
    private readonly likeService;
    constructor(likeService: LikeService);
    toggleLike(req: Request, tweetId: string): Promise<{
        liked: boolean;
    }>;
    getLikedTweets(req: Request): Promise<import("../tweets/entities/tweet.entity").Tweet[]>;
}
