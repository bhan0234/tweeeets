import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tweet, User, Like]),UserModule,
      ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
