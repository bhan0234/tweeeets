import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Tweet } from '../tweets/entities/tweet.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
  ) {}

  async toggleLike(user: User, tweetId: number): Promise<{ liked: boolean }> {
    // Find the tweet
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
    });

    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${tweetId} not found`);
    }

    // Check if like already exists
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: user.id },
        tweet: { id: tweetId },
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await this.likeRepository.remove(existingLike);
      return { liked: false };
    } else {
      // Like: Create new like
      const like = this.likeRepository.create({
        user,
        tweet,
      });
      await this.likeRepository.save(like);
      return { liked: true };
    }
  }

  async getLikedTweets(user: User): Promise<Tweet[]> {
    // Get all likes for the user with tweet information
    const likes = await this.likeRepository.find({
      where: { user: { id: user.id } },
      relations: ['tweet', 'tweet.user', 'tweet.likes', 'tweet.originalTweet', 'tweet.originalTweet.user'],
      order: {
        id: 'DESC'
      }
    });

    // Extract tweets and add likes count and like status
    const tweetsWithLikesInfo = await Promise.all(
      likes.map(async (like) => {
        const tweet = like.tweet;
        const likesCount = await this.likeRepository.count({
          where: { tweet: { id: tweet.id } },
        });

        return {
          ...tweet,
          likesCount,
          isLiked: true, // Since these are liked tweets, isLiked is always true
        };
      })
    );

    return tweetsWithLikesInfo;
  }
}
