import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  Textarea,
  Button,
  useToast,
  Container,
  Heading,
  HStack,
  Avatar,
  Text,
  Spinner,
  Center,
  IconButton,
} from '@chakra-ui/react';
import { tweets } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Tweet from './Tweet';
import { FaSync } from 'react-icons/fa';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

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

const Feed: React.FC = () => {
  const [tweetList, setTweetList] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState('');
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
      const response = await tweets.getAll(pageNum);
      const { tweets: newTweets, total } = response.data;
      
      if (pageNum === 1) {
        setTweetList(newTweets);
      } else {
        setTweetList(prev => [...prev, ...newTweets]);
      }
      
      setHasMore(tweetList.length + newTweets.length < total);
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

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) {
      toast({
        title: 'Error',
        description: 'Tweet content cannot be empty',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await tweets.create(newTweet);
      setNewTweet('');
      setPage(1); // Reset to first page
      await fetchTweets(1);
      toast({
        title: 'Success',
        description: 'Tweet created successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create tweet',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

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
      // Refresh the feed to show the new retweet at the top
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

  const handleRefresh = async () => {
    setPage(1);
    await fetchTweets(1);
  };

  const { isRefreshing, pullDistance, threshold } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          bg="white"
          boxShadow="sm"
        >
          <VStack spacing={4}>
            <Textarea
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              placeholder="What's happening?"
              size="lg"
              resize="none"
              rows={3}
            />
            <Button
              colorScheme="blue"
              onClick={handleCreateTweet}
              isLoading={isLoading}
              alignSelf="flex-end"
            >
              Tweet
            </Button>
          </VStack>
        </Box>

        <VStack spacing={4} align="stretch">
          {isLoading ? (
            <Center py={8}>
              <Spinner size="xl" />
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              <Box
                position="relative"
                height={pullDistance > 0 ? `${pullDistance}px` : '0'}
                transition="height 0.2s"
                overflow="hidden"
              >
                <Center
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  transform={`translateY(${Math.min(pullDistance, threshold)}px)`}
                >
                  <Spinner
                    size="md"
                    color="blue.500"
                    opacity={pullDistance >= threshold ? 1 : 0}
                    transition="opacity 0.2s"
                  />
                </Center>
              </Box>
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
          )}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Feed; 