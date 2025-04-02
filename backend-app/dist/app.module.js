"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const tweets_module_1 = require("./tweets/tweets.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const like_module_1 = require("./like/like.module");
const tweet_entity_1 = require("./tweets/entities/tweet.entity");
const user_entity_1 = require("./user/entities/user.entity");
const like_entity_1 = require("./like/entities/like.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'tweets',
                password: 'postgres',
                database: 'twitter',
                entities: [tweet_entity_1.Tweet, user_entity_1.User, like_entity_1.Like],
                synchronize: true,
            }),
            tweets_module_1.TweetsModule,
            user_module_1.UserModule,
            like_module_1.LikeModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map