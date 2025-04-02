import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280) // Optional limit (like Twitter)
  content: string;
}

export class UpdateTweetDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  content: string;
}