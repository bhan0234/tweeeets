import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './entities/tweet.entity';
import { User } from '../user/entities/user.entity';
import { Like } from '../like/entities/like.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createTweetDto: CreateTweetDto, user: User): Promise<Tweet> {
    const tweet = this.tweetRepository.create({
      ...createTweetDto,
      user,
    });
    return await this.tweetRepository.save(tweet);
  }

  async updateTweet(user: User, id: number, content: string): Promise<Tweet> {
    const tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }

    if (tweet.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own tweets');
    }

    if (tweet.isRetweet) {
      throw new ForbiddenException('You cannot edit a retweet');
    }

    tweet.content = content;
    return await this.tweetRepository.save(tweet);
  }

  async getAllTweets(currentUser?: User, page: number = 1, limit: number = 15): Promise<{ tweets: Tweet[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [tweets, total] = await Promise.all([
      this.tweetRepository.find({
        relations: ['user', 'likes', 'originalTweet', 'originalTweet.user'],
        order: {
          createdAt: 'DESC',
        },
        skip,
        take: limit,
      }),
      this.tweetRepository.count()
    ]);

    // Get likes count and like state for each tweet
    const tweetsWithLikesInfo = await Promise.all(
      tweets.map(async (tweet) => {
        const likesCount = await this.likeRepository.count({
          where: { tweet: { id: tweet.id } },
        });

        let isLiked = false;
        if (currentUser) {
          const userLike = await this.likeRepository.findOne({
            where: {
              tweet: { id: tweet.id },
              user: { id: currentUser.id },
            },
          });
          isLiked = !!userLike;
        }

        return {
          ...tweet,
          likesCount,
          isLiked,
        };
      })
    );

    return {
      tweets: tweetsWithLikesInfo,
      total
    };
  }

  async getUserTweets(user: User): Promise<Tweet[]> {
    const tweets = await this.tweetRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'likes', 'originalTweet', 'originalTweet.user'],
      order: {
        updatedAt: 'DESC',
      },
    });

    // Get likes count and like state for each tweet
    const tweetsWithLikesInfo = await Promise.all(
      tweets.map(async (tweet) => {
        const likesCount = await this.likeRepository.count({
          where: { tweet: { id: tweet.id } },
        });

        const userLike = await this.likeRepository.findOne({
          where: {
            tweet: { id: tweet.id },
            user: { id: user.id },
          },
        });

        return {
          ...tweet,
          likesCount,
          isLiked: !!userLike,
        };
      })
    );

    return tweetsWithLikesInfo;
  }

  async remove(id: number, user: User): Promise<void> {
    const tweet = await this.tweetRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!tweet) {
      throw new NotFoundException(`Tweet with ID ${id} not found`);
    }

    if (tweet.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own tweets');
    }

    await this.tweetRepository.remove(tweet);
  }

  async retweet(user: User, tweetId: number): Promise<Tweet> {
    // Find the tweet to retweet
    const tweetToRetweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['user', 'originalTweet'],
    });

    if (!tweetToRetweet) {
      throw new NotFoundException(`Tweet with ID ${tweetId} not found`);
    }

    // If the tweet is already a retweet, get the original tweet
    const originalTweet = tweetToRetweet.isRetweet ? tweetToRetweet.originalTweet : tweetToRetweet;

    // Check if user has already retweeted this tweet (either the original or any retweet of it)
    const existingRetweet = await this.tweetRepository.findOne({
      where: [
        {
          user: { id: user.id },
          originalTweet: { id: originalTweet.id },
          isRetweet: true,
        },
        {
          user: { id: user.id },
          id: tweetId,
          isRetweet: true,
        }
      ],
    });

    if (existingRetweet) {
      throw new ForbiddenException('You have already retweeted this tweet');
    }

    // Create a new retweet
    const retweet = this.tweetRepository.create({
      content: originalTweet.content,
      user,
      isRetweet: true,
      originalTweet,
    });

    const savedRetweet = await this.tweetRepository.save(retweet);
    
    // Fetch the saved retweet with selected fields
    const result = await this.tweetRepository.findOne({
      where: { id: savedRetweet.id },
      relations: ['user', 'originalTweet', 'originalTweet.user'],
      select: {
        id: true,
        content: true,
        isRetweet: true,
        createdAt: true,
        updatedAt: true,
        user: {
          username: true,
        },
        originalTweet: {
          id: true,
          content: true,
          isRetweet: true,
          createdAt: true,
          updatedAt: true,
          user: {
            username: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Failed to create retweet');
    }

    return result;
  }
}
