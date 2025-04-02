import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        color="white"
        _hover={{ bg: 'blue.600' }}
      >
        @{user.username}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate('/my-tweets')} color="gray.700">
          My Tweets
        </MenuItem>
        <MenuItem onClick={() => navigate('/my-likes')} color="gray.700">
          My Likes
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu; 