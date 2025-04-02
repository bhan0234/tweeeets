"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const tweets_service_1 = require("./tweets.service");
describe('TweetsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [tweets_service_1.TweetsService],
        }).compile();
        service = module.get(tweets_service_1.TweetsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=tweets.service.spec.js.map