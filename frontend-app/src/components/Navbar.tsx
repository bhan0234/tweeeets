import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Button
          variant="ghost"
          color="white"
          fontWeight="bold"
          fontSize="xl"
          onClick={() => navigate('/')}
        >
          Twitter Clone
        </Button>
        {user && (
          <Flex align="center" gap={4}>
            <UserMenu />
            <Button
              variant="ghost"
              color="white"
              onClick={handleLogout}
              _hover={{ bg: 'blue.600' }}
            >
              Logout
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 