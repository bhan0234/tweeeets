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
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("./entities/like.entity");
const tweet_entity_1 = require("../tweets/entities/tweet.entity");
let LikeService = class LikeService {
    likeRepository;
    tweetRepository;
    constructor(likeRepository, tweetRepository) {
        this.likeRepository = likeRepository;
        this.tweetRepository = tweetRepository;
    }
    async toggleLike(user, tweetId) {
        const tweet = await this.tweetRepository.findOne({
            where: { id: tweetId },
        });
        if (!tweet) {
            throw new common_1.NotFoundException(`Tweet with ID ${tweetId} not found`);
        }
        const existingLike = await this.likeRepository.findOne({
            where: {
                user: { id: user.id },
                tweet: { id: tweetId },
            },
        });
        if (existingLike) {
            await this.likeRepository.remove(existingLike);
            return { liked: false };
        }
        else {
            const like = this.likeRepository.create({
                user,
                tweet,
            });
            await this.likeRepository.save(like);
            return { liked: true };
        }
    }
    async getLikedTweets(user) {
        const likes = await this.likeRepository.find({
            where: { user: { id: user.id } },
            relations: ['tweet', 'tweet.user', 'tweet.likes', 'tweet.originalTweet', 'tweet.originalTweet.user'],
            order: {
                id: 'DESC'
            }
        });
        const tweetsWithLikesInfo = await Promise.all(likes.map(async (like) => {
            const tweet = like.tweet;
            const likesCount = await this.likeRepository.count({
                where: { tweet: { id: tweet.id } },
            });
            return {
                ...tweet,
                likesCount,
                isLiked: true,
            };
        }));
        return tweetsWithLikesInfo;
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(1, (0, typeorm_1.InjectRepository)(tweet_entity_1.Tweet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LikeService);
//# sourceMappingURL=like.service.js.map