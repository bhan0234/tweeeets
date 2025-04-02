import { Tweet } from "src/tweets/entities/tweet.entity";
import { User } from "src/user/entities/user.entity";
export declare class Like {
    id: number;
    user: User;
    tweet: Tweet;
}
