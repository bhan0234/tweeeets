import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TweetsModule } from './tweets/tweets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { LikeModule } from './like/like.module';
import { Tweet } from './tweets/entities/tweet.entity';
import { User } from './user/entities/user.entity';
import { Like } from './like/entities/like.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/jwtconstants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tweets',
      password: 'postgres',
      database: 'twitter',
      entities: [Tweet, User, Like],
      synchronize: true,
      // logging: true,
    }),
    TweetsModule,
    UserModule,
    LikeModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
