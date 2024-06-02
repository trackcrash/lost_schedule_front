import React from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiLogIn, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from './AuthContext';


interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, isLoggedIn } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  const linkItems: Array<LinkItemProps> = [
    { name: '홈', icon: FiHome, link: '/' },
    { name: '내 정보', icon: FiStar, link: '/myinfo' },
    { name: '레이드 관리', icon: FiTrendingUp, link: '/raidmanagement' },
    { name: '공대관리', icon: FiCompass, link: '/raidgroup' },
    { name: isLoggedIn ? '로그아웃' : '로그인', icon: isLoggedIn ? FiLogOut : FiLogIn, link: isLoggedIn ? '#' : '/signin' }
  ];

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <Box bg={bg} borderRight="1px" borderRightColor={borderColor} w={{ base: 'full', md: 60 }} pos="fixed" left={0} top="50%" transform="translateY(-50%)" h="100vh" borderRadius="lg" shadow="xl">
      <Flex h="20" flexDirection="column" justifyContent="center" mx="8">
        <Text fontSize="2xl" fontWeight="bold">숙제조와</Text>
        <Text fontSize="xl" fontWeight="bold" color="gray.400">
          {isLoggedIn ? `${localStorage.getItem('userNickname')}님 환영합니다` : '로그인해주세요'}
        </Text>
      </Flex>
      <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} position="absolute" right="8px" top="8px" />
      {linkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link} hoverBg={hoverBg} onClick={link.name === '로그아웃' ? handleLogoutClick : undefined}>
          {link.name}
        </NavItem>
      ))}
      <Flex justifyContent="center" alignItems="center" p="4">
        <IconButton
          aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          isRound={true}
        />
      </Flex>
    </Box>
  );
};

interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  link: string;
  hoverBg: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, children, link, hoverBg, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (onClick) {
          e.preventDefault();
          onClick();
      }
  };

  return (
    <Link
        as={RouterLink}
        to={link === "#" ? "/" : link}
        style={{ textDecoration: 'none' }}
        onClick={handleClick}
        _focus={{ boxShadow: 'none' }}
    >
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
                bg: hoverBg,
                color: 'white',
            }}
            transition="background 0.3s ease"
        >
            {icon && <Icon mr="4" fontSize="16" as={icon} />}
            {children}
        </Flex>
    </Link>
  );
};
export default Sidebar;
