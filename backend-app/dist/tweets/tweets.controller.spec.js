"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tweets_controller_1 = require("./tweets.controller");
const tweets_service_1 = require("./tweets.service");
describe('TweetsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [tweets_controller_1.TweetsController],
            providers: [tweets_service_1.TweetsService],
        }).compile();
        controller = module.get(tweets_controller_1.TweetsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=tweets.controller.spec.js.map