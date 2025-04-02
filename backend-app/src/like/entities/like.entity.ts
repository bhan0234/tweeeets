import { Tweet } from "src/tweets/entities/tweet.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['user', 'tweet']) // Prevents duplicate likes
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.likes, { onDelete: 'CASCADE' })
  tweet: Tweet;
}