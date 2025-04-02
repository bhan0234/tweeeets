import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { Like } from 'src/like/entities/like.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ unique: true })
    username: string;

    @Column()
    password: string; 
    
    // A user can have multiple tweets
    @OneToMany(() => Tweet, (tweet) => tweet.user)
    tweets: Tweet[];
  
    // A user can like multiple tweets
    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];
}