import React from 'react';
import { ChakraProvider, Box, Flex, Button, Text, useToast } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import MyTweets from './components/MyTweets';
import MyLikes from './components/MyLikes';
import UserMenu from './components/UserMenu';
import { Center, Spinner } from '@chakra-ui/react';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex as="nav" bg="blue.500" p={4} color="white" align="center" justify="space-between">
        <Text fontSize="xl" fontWeight="bold" cursor="pointer" onClick={() => navigate('/')}>
          Twitter Clone
        </Text>
        <Flex align="center" gap={4}>
          {isAuthenticated ? (
            <>
              <UserMenu />
              <Button variant="ghost" color="white" onClick={logout} _hover={{ bg: 'blue.600' }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" color="white" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outline" color="white" borderColor="white" _hover={{ bg: 'blue.600' }} onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      <Box maxW="container.md" mx="auto" py={8}>
        <Routes>
          {isLoading ? (
            <Route path="*" element={
              <Center h="100vh">
                <Spinner size="xl" />
              </Center>
            } />
          ) : !isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Feed />} />
              <Route path="/my-tweets" element={<MyTweets />} />
              <Route path="/my-likes" element={<MyLikes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
