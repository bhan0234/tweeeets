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
import { useAuth } from '../contexts/AuthContext';

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

const MyTweets: React.FC = () => {
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const toast = useToast();
  const observer = useRef<IntersectionObserver>();
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
      const response = await tweets.getMyTweets(pageNum);
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
        description: 'Failed to fetch tweets',
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

  const handleDelete = async (id: string) => {
    try {
      await tweets.delete(id);
      setTweetList(prev => prev.filter(tweet => tweet.id !== id));
      toast({
        title: 'Success',
        description: 'Tweet deleted successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tweet',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (id: string, content: string) => {
    try {
      await tweets.update(id, content);
      setTweetList(prev =>
        prev.map(tweet =>
          tweet.id === id ? { ...tweet, content } : tweet
        )
      );
      toast({
        title: 'Success',
        description: 'Tweet updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tweet',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleLike = async (id: string) => {
    try {
      await tweets.like(id);
      setTweetList(prev =>
        prev.map(tweet =>
          tweet.id === id
            ? {
                ...tweet,
                isLiked: !tweet.isLiked,
                likesCount: tweet.isLiked ? tweet.likesCount - 1 : tweet.likesCount + 1,
              }
            : tweet
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like tweet',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRetweet = async (id: string) => {
    try {
      await tweets.retweet(id);
      // Refresh the list to show the updated state
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

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">My Tweets</Heading>
        {tweetList.length === 0 ? (
          <Text color="gray.500">You haven't tweeted anything yet.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {tweetList.map((tweet, index) => (
              <div
                key={tweet.id}
                ref={index === tweetList.length - 1 ? lastTweetRef : undefined}
              >
                <Tweet
                  {...tweet}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onRetweet={handleRetweet}
                  onUpdate={handleUpdate}
                />
              </div>
            ))}
          </VStack>
        )}
        
        {isLoadingMore && (
          <Center py={4}>
            <Spinner />
          </Center>
        )}
        
        {!hasMore && tweetList.length > 0 && (
          <Center py={4}>
            <Text color="gray.500">No more tweets to load</Text>
          </Center>
        )}
      </VStack>
    </Container>
  );
};

export default MyTweets; 