"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tweet_entity_1 = require("./entities/tweet.entity");
const like_entity_1 = require("../like/entities/like.entity");
let TweetsService = class TweetsService {
    tweetRepository;
    likeRepository;
    constructor(tweetRepository, likeRepository) {
        this.tweetRepository = tweetRepository;
        this.likeRepository = likeRepository;
    }
    async create(createTweetDto, user) {
        const tweet = this.tweetRepository.create({
            ...createTweetDto,
            user,
        });
        return await this.tweetRepository.save(tweet);
    }
    async updateTweet(user, id, content) {
        const tweet = await this.tweetRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!tweet) {
            throw new common_1.NotFoundException(`Tweet with ID ${id} not found`);
        }
        if (tweet.user.id !== user.id) {
            throw new common_1.ForbiddenException('You can only update your own tweets');
        }
        if (tweet.isRetweet) {
            throw new common_1.ForbiddenException('You cannot edit a retweet');
        }
        tweet.content = content;
        return await this.tweetRepository.save(tweet);
    }
    async getAllTweets(currentUser, page = 1, limit = 15) {
        const skip = (page - 1) * limit;
        const [tweets, total] = await Promise.all([
            this.tweetRepository.find({
                relations: ['user', 'likes', 'originalTweet', 'originalTweet.user'],
                order: {
                    createdAt: 'DESC',
                },
                skip,
                take: limit,
            }),
            this.tweetRepository.count()
        ]);
        const tweetsWithLikesInfo = await Promise.all(tweets.map(async (tweet) => {
            const likesCount = await this.likeRepository.count({
                where: { tweet: { id: tweet.id } },
            });
            let isLiked = false;
            if (currentUser) {
                const userLike = await this.likeRepository.findOne({
                    where: {
                        tweet: { id: tweet.id },
                        user: { id: currentUser.id },
                    },
                });
                isLiked = !!userLike;
            }
            return {
                ...tweet,
                likesCount,
                isLiked,
            };
        }));
        return {
            tweets: tweetsWithLikesInfo,
            total
        };
    }
    async getUserTweets(user) {
        const tweets = await this.tweetRepository.find({
            where: { user: { id: user.id } },
            relations: ['user', 'likes', 'originalTweet', 'originalTweet.user'],
            order: {
                updatedAt: 'DESC',
            },
        });
        const tweetsWithLikesInfo = await Promise.all(tweets.map(async (tweet) => {
            const likesCount = await this.likeRepository.count({
                where: { tweet: { id: tweet.id } },
            });
            const userLike = await this.likeRepository.findOne({
                where: {
                    tweet: { id: tweet.id },
                    user: { id: user.id },
                },
            });
            return {
                ...tweet,
                likesCount,
                isLiked: !!userLike,
            };
        }));
        return tweetsWithLikesInfo;
    }
    async remove(id, user) {
        const tweet = await this.tweetRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!tweet) {
            throw new common_1.NotFoundException(`Tweet with ID ${id} not found`);
        }
        if (tweet.user.id !== user.id) {
            throw new common_1.ForbiddenException('You can only delete your own tweets');
        }
        await this.tweetRepository.remove(tweet);
    }
    async retweet(user, tweetId) {
        const tweetToRetweet = await this.tweetRepository.findOne({
            where: { id: tweetId },
            relations: ['user', 'originalTweet'],
        });
        if (!tweetToRetweet) {
            throw new common_1.NotFoundException(`Tweet with ID ${tweetId} not found`);
        }
        const originalTweet = tweetToRetweet.isRetweet ? tweetToRetweet.originalTweet : tweetToRetweet;
        const existingRetweet = await this.tweetRepository.findOne({
            where: [
                {
                    user: { id: user.id },
                    originalTweet: { id: originalTweet.id },
                    isRetweet: true,
                },
                {
                    user: { id: user.id },
                    id: tweetId,
                    isRetweet: true,
                }
            ],
        });
        if (existingRetweet) {
            throw new common_1.ForbiddenException('You have already retweeted this tweet');
        }
        const retweet = this.tweetRepository.create({
            content: originalTweet.content,
            user,
            isRetweet: true,
            originalTweet,
        });
        const savedRetweet = await this.tweetRepository.save(retweet);
        const result = await this.tweetRepository.findOne({
            where: { id: savedRetweet.id },
            relations: ['user', 'originalTweet', 'originalTweet.user'],
            select: {
                id: true,
                content: true,
                isRetweet: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    username: true,
                },
                originalTweet: {
                    id: true,
                    content: true,
                    isRetweet: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        username: true,
                    },
                },
            },
        });
        if (!result) {
            throw new common_1.NotFoundException('Failed to create retweet');
        }
        return result;
    }
};
exports.TweetsService = TweetsService;
exports.TweetsService = TweetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tweet_entity_1.Tweet)),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TweetsService);
//# sourceMappingURL=tweets.service.js.map