import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like } from 'src/like/entities/like.entity';
import { Tweet } from './entities/tweet.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet, User, Like]), UserModule,
  ],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
