"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const like_controller_1 = require("./like.controller");
const like_service_1 = require("./like.service");
describe('LikeController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [like_controller_1.LikeController],
            providers: [like_service_1.LikeService],
        }).compile();
        controller = module.get(like_controller_1.LikeController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=like.controller.spec.js.map