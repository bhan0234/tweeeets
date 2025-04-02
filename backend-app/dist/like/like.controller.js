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
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const like_service_1 = require("./like.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LikeController = class LikeController {
    likeService;
    constructor(likeService) {
        this.likeService = likeService;
    }
    toggleLike(req, tweetId) {
        return this.likeService.toggleLike(req.user, +tweetId);
    }
    getLikedTweets(req) {
        return this.likeService.getLikedTweets(req.user);
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.Post)('toggle/:tweetId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('tweetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LikeController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Get)('my-likes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LikeController.prototype, "getLikedTweets", null);
exports.LikeController = LikeController = __decorate([
    (0, common_1.Controller)('like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map