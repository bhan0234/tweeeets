import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { tweets } from '../services/api';
import Tweet from './Tweet';

interface Tweet {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  likesCount: number;
  isLiked: boolean;
  isRetweet: boolean;
  originalTweet?: {
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
  createdAt: string;
}

const MyLikes: React.FC = () => {
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const toast = useToast();

  const lastTweetRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, isLoadingMore]);

  const fetchTweets = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      const response = await tweets.getLikedTweets(pageNum);
      const newTweets = response.data;
      
      if (pageNum === 1) {
        setTweetList(newTweets);
      } else {
        setTweetList(prev => [...prev, ...newTweets]);
      }
      
      setHasMore(newTweets.length === 15); // If we got less than 15 tweets, we've reached the end
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch liked tweets',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTweets(page);
  }, [page]);

  const handleLike = async (tweetId: string) => {
    try {
      await tweets.like(tweetId);
      setTweetList(prev =>
        prev.filter(tweet => tweet.id !== tweetId)
      );
      toast({
        title: 'Success',
        description: 'Tweet unliked',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unlike tweet',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRetweet = async (tweetId: string) => {
    try {
      await tweets.retweet(tweetId);
      setPage(1);
      await fetchTweets(1);
      toast({
        title: 'Tweet retweeted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      if (error.response?.data?.message === 'You have already retweeted this tweet') {
        toast({
          title: 'Already Retweeted',
          description: 'You have already retweeted this tweet',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to retweet',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const handleUpdate = (id: string, content: string) => {
    setTweetList(prev =>
      prev.map(tweet =>
        tweet.id === id
          ? { ...tweet, content }
          : tweet
      )
    );
  };

  const handleDelete = (deletedTweetId: string) => {
    setTweetList(prev =>
      prev.filter(tweet => tweet.id !== deletedTweetId)
    );
  };

  if (isLoading && page === 1) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Liked Tweets</Heading>
        {tweetList.length === 0 ? (
          <Text color="gray.500">You haven't liked any tweets yet.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {tweetList.map((tweet, index) => (
              <Box
                key={tweet.id}
                ref={index === tweetList.length - 1 ? lastTweetRef : undefined}
              >
                <Tweet
                  {...tweet}
                  onLike={handleLike}
                  onRetweet={handleRetweet}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </Box>
            ))}
          </VStack>
        )}
        {isLoadingMore && (
          <Center py={4}>
            <Spinner />
          </Center>
        )}
        {!hasMore && tweetList.length > 0 && (
          <Text textAlign="center" color="gray.500">
            No more liked tweets to load
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default MyLikes; 