import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, Input, Image, VStack, Text, Heading, useColorModeValue, Spinner, useToast, Stack } from '@chakra-ui/react';
import { CharacterDTO } from 'myinfo/entity/characterDto';
import { fetchAllCharacters, fetchCharactersByName } from 'myinfo/api/MyInfoApi';

const MyInfo: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch characters on component mount with GET request
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const characters = await fetchAllCharacters();
        setCharacters(characters);
      } catch (error: any) {
        toast({
          title: "캐릭터 로딩 실패",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error('Error loading character details:', error);
      }
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const fetchCharacterDetails = async () => {
    if (!playerName) return;
    setLoading(true);
    try {
      const characters = await fetchCharactersByName(playerName);
      setCharacters(characters);
    } catch (error: any) {
      toast({
        title: "캐릭터 로딩 실패",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const buttonBg = useColorModeValue('green.500', 'green.300');
  const textColor = useColorModeValue('white', 'white');
  const headerColor = useColorModeValue('green.500', 'green.300');
  const inputBg = useColorModeValue('gray.800', 'gray.600');

  return (
    <Box textAlign="center" color={textColor} minH="100vh" py="5" px="2">
      <Flex direction="column" align="center" mb="5">
        <Heading mb="5" color={headerColor}>캐릭터 목록 업데이트</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing="3" align="center">
          <Input
            placeholder="캐릭터명 입력"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            size="lg"
            width={{ base: 'full', md: 'auto' }}
            borderColor="gray.500"
            color={textColor}
            bg={inputBg}
            _placeholder={{ color: 'gray.400' }}
          />
          <Button onClick={fetchCharacterDetails} isLoading={loading} loadingText="Loading" bg={buttonBg} color={textColor} _hover={{ bg: 'green.600' }}>
            불러오기
          </Button>
        </Stack>
      </Flex>
      {loading ? (
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color={textColor} />
        </Flex>
      ) : (
        <Flex justify="center" wrap="wrap" gap="4">
          {characters.map((character) => (
            <Box key={character.characterName} bg={cardBg} borderRadius="lg" overflow="hidden" shadow="xl" maxWidth="300px"
              _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}>
              <Image src={character.characterImage} alt={character.characterName} width="100%" />
              <VStack p="4" align="start" spacing="4">
                <Heading size="md" color={textColor}>{character.characterName}</Heading>
                <Text color="gray.400">{character.characterClassName}</Text>
                <Text color="gray.400">템렙: {character.itemMaxLevel}</Text>
              </VStack>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default MyInfo;