import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

@Controller('like')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle/:tweetId')
  toggleLike(@Req() req: Request, @Param('tweetId') tweetId: string) {
    return this.likeService.toggleLike(req.user as User, +tweetId);
  }

  @Get('my-likes')
  getLikedTweets(@Req() req: Request) {
    return this.likeService.getLikedTweets(req.user as User);
  }
}
