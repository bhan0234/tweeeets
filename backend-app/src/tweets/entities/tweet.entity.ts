import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany, JoinColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tweet {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    content: string;
  
    @ManyToOne(() => User, (user) => user.tweets, { onDelete: 'CASCADE' })
    user: User;
  
    // Likes on a tweet
    @OneToMany(() => Like, (like) => like.tweet)
    likes: Like[];
  
    // Retweet flag (true if it's a retweet)
    @Column({ default: false })
    isRetweet: boolean;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Stores the original tweet if it's a retweet
    @ManyToOne(() => Tweet, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'originalTweetId' })
    originalTweet: Tweet;
}
