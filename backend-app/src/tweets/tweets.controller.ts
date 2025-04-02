import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTweetDto: CreateTweetDto, @Req() req) {
    return this.tweetsService.create(createTweetDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    return this.tweetsService.getAllTweets(req.user, page, limit);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyTweets(@Req() req) {
    return this.tweetsService.getUserTweets(req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTweetDto: CreateTweetDto, @Req() req) {
    return this.tweetsService.updateTweet(req.user, +id, updateTweetDto.content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.tweetsService.remove(+id, req.user);
  }

  @Post(':id/retweet')
  @UseGuards(JwtAuthGuard)
  retweet(@Param('id') id: string, @Req() req) {
    return this.tweetsService.retweet(req.user, +id);
  }
}
