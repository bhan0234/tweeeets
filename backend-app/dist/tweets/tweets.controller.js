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
exports.TweetsController = void 0;
const common_1 = require("@nestjs/common");
const tweets_service_1 = require("./tweets.service");
const create_tweet_dto_1 = require("./dto/create-tweet.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TweetsController = class TweetsController {
    tweetsService;
    constructor(tweetsService) {
        this.tweetsService = tweetsService;
    }
    create(createTweetDto, req) {
        return this.tweetsService.create(createTweetDto, req.user);
    }
    findAll(req, page = 1, limit = 3) {
        return this.tweetsService.getAllTweets(req.user, page, limit);
    }
    getMyTweets(req) {
        return this.tweetsService.getUserTweets(req.user);
    }
    update(id, updateTweetDto, req) {
        return this.tweetsService.updateTweet(req.user, +id, updateTweetDto.content);
    }
    remove(id, req) {
        return this.tweetsService.remove(+id, req.user);
    }
    retweet(id, req) {
        return this.tweetsService.retweet(req.user, +id);
    }
};
exports.TweetsController = TweetsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tweet_dto_1.CreateTweetDto, Object]),
    __metadata("design:returntype", void 0)
], TweetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], TweetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TweetsController.prototype, "getMyTweets", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tweet_dto_1.CreateTweetDto, Object]),
    __metadata("design:returntype", void 0)
], TweetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TweetsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/retweet'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TweetsController.prototype, "retweet", null);
exports.TweetsController = TweetsController = __decorate([
    (0, common_1.Controller)('tweets'),
    __metadata("design:paramtypes", [tweets_service_1.TweetsService])
], TweetsController);
//# sourceMappingURL=tweets.controller.js.map