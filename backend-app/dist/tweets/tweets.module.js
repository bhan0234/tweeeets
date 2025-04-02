"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetsModule = void 0;
const common_1 = require("@nestjs/common");
const tweets_service_1 = require("./tweets.service");
const tweets_controller_1 = require("./tweets.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const like_entity_1 = require("../like/entities/like.entity");
const tweet_entity_1 = require("./entities/tweet.entity");
const user_module_1 = require("../user/user.module");
let TweetsModule = class TweetsModule {
};
exports.TweetsModule = TweetsModule;
exports.TweetsModule = TweetsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tweet_entity_1.Tweet, user_entity_1.User, like_entity_1.Like]), user_module_1.UserModule,
        ],
        controllers: [tweets_controller_1.TweetsController],
        providers: [tweets_service_1.TweetsService],
    })
], TweetsModule);
//# sourceMappingURL=tweets.module.js.map