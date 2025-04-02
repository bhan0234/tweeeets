import React, { useState } from 'react';
import {
  Box,
  Text,
  HStack,
  IconButton,
  VStack,
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Textarea,
  Input,
} from '@chakra-ui/react';
import { FaHeart, FaRetweet, FaTrash, FaEllipsisH, FaEdit } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { tweets } from '../services/api';

interface TweetProps {
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
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  onRetweet?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
}

const Tweet: React.FC<TweetProps> = ({
  id,
  content,
  user,
  likesCount,
  isLiked,
  isRetweet,
  originalTweet,
  createdAt,
  onDelete,
  onLike,
  onRetweet,
  onUpdate,
}) => {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleLike = async () => {
    try {
      if (onLike) {
        await onLike(id);
        toast({
          title: isLiked ? 'Tweet unliked' : 'Tweet liked',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
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

  const handleRetweet = async () => {
    try {
      if (onRetweet) {
        await onRetweet(id);
      }
    } catch (error) {
      // Let the parent component handle the error
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(id);
      }
    } catch (error) {
      // Let the parent component handle the error
    }
  };

  const handleUpdate = async () => {
    if (isRetweet) {
      toast({
        title: 'Error',
        description: 'You cannot edit a retweet',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!editedContent.trim()) {
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
      if (onUpdate) {
        await onUpdate(id, editedContent);
        setIsEditing(false);
      }
    } catch (error) {
      // Let the parent component handle the error
    }
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Check if the retweet belongs to the current user
  const isMyRetweet = isRetweet && currentUser?.id === user.id;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      bg="white"
      boxShadow="sm"
    >
      <VStack align="stretch" spacing={2}>
        {isRetweet && originalTweet && (
          <HStack spacing={2} color="gray.500" fontSize="sm">
            <FaRetweet />
            <Text>Retweeted from @{originalTweet.user.username}</Text>
          </HStack>
        )}
        <HStack spacing={3}>
          <Avatar size="sm" name={user.username} />
          <VStack align="start" flex={1}>
            <HStack>
              <Text fontWeight="bold">{user.username}</Text>
              <Text color="gray.500" fontSize="sm">
                {formatTime(createdAt)}
              </Text>
            </HStack>
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                size="sm"
                resize="none"
                rows={3}
                isDisabled={isRetweet}
              />
            ) : (
              <Text>{content}</Text>
            )}
          </VStack>
          {currentUser?.id === user.id && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisH />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                {!isRetweet && (
                  <MenuItem icon={<FaEdit />} onClick={() => setIsEditing(true)}>
                    Edit
                  </MenuItem>
                )}
                <MenuItem icon={<FaTrash />} onClick={handleDelete}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
        <HStack spacing={4} justify="flex-start">
          <IconButton
            aria-label="Like"
            icon={<FaHeart />}
            variant="ghost"
            colorScheme={isLiked ? 'red' : 'gray'}
            onClick={handleLike}
            size="lg"
            _focus={{ boxShadow: "none", outline: "none" }}
          />
          <Text fontSize="sm" color="gray.500" ml="-4">
            {likesCount}
          </Text>
          <IconButton
            aria-label="Retweet"
            icon={<FaRetweet />}
            variant="ghost"
            colorScheme={isRetweet ? 'green' : 'gray'}
            onClick={handleRetweet}
            size="lg"
            _focus={{ boxShadow: "none", outline: "none" }}
          />
          {isEditing && (
            <HStack spacing={2} ml="auto">
              <Button size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" colorScheme="blue" onClick={handleUpdate}>
                Save
              </Button>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default Tweet;