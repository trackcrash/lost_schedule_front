import React, { useState, useEffect } from 'react';
import {
  Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  SimpleGrid, Text, Image, useDisclosure, useToast, Center, Flex, VStack
} from '@chakra-ui/react';
import { RaidGroupMembers } from 'RaidGroup/entity/RaidMember';
import { CharacterDTO } from 'myinfo/entity/characterDto';
import { fetchRaidGroupMembers } from 'RaidGroup/api/RaidGroupApi';
import { fetchCharactersById } from 'myinfo/api/MyInfoApi';


interface RaidGroupMembersSelectModalProps {
  raidGroupId?: number;
  onCharacterSelect: React.Dispatch<React.SetStateAction<CharacterDTO[]>>;
}

export const RaidCharacterSelect: React.FC<RaidGroupMembersSelectModalProps> = ({ raidGroupId, onCharacterSelect }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [members, setMembers] = useState<RaidGroupMembers[]>([]);
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<CharacterDTO[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (!raidGroupId) {
        return; // raidGroupId가 없다면 여기서 함수 실행을 중지
    }
    const loadMembers = async () => {
      try {
        const loadedMembers = await fetchRaidGroupMembers(raidGroupId);
        setMembers(loadedMembers);
      } catch (error) {
        console.error('Failed to fetch raid group members', error);
        toast({
          title: 'Error',
          description: 'Failed to load raid group members data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    loadMembers();
  }, [raidGroupId]);

  const handleDeselectCharacter = (characterName:String) => {
    const newSelectedCharacters = selectedCharacters.filter(char => char.characterName !== characterName);
    setSelectedCharacters(newSelectedCharacters);
    onCharacterSelect(newSelectedCharacters);  // 업데이트된 목록을 부모 컴포넌트에 전달
  
    toast({
      title: 'Character Deselected',
      description: `${characterName} has been deselected.`,
      status: 'info',
      duration: 4000,
      isClosable: true,
    });
  };
  
  const handleCharacterSelect = (character:CharacterDTO) => {
    //이미 할당된 캐릭터
    if (character.isAssigned) {
      toast({
        title: 'Character Unavailable',
        description: `${character.characterName} is already assigned and cannot be selected.`,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (selectedCharacters.some(selected => selected.characterName === character.characterName)) {
      handleDeselectCharacter(character.characterName);
      return;
    }
    setSelectedCharacters(prevCharacters => [...prevCharacters, character]);
    onCharacterSelect(prevCharacters => [...prevCharacters, character]);
    toast({
      title: 'Character Selected',
      description: `${character.characterName} has been added to your selection.`,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
    onClose();
  };

  const handleMemberClick = async (userId: number) => {
    try {
      const loadedCharacters = await fetchCharactersById(userId);
      setCharacters(loadedCharacters);
    } catch (error) {
      console.error('Failed to fetch characters', error);
      toast({
        title: 'Error',
        description: 'Failed to load characters data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Center>
        <Button colorScheme="green" onClick={onOpen} mt={4} >레이드 멤버 편성</Button>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>멤버 선택</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={4} spacing={4}>
              {members.map(member => (
                <Box key={member.id} p={3} borderWidth="1px" borderRadius="lg" shadow="md" cursor="pointer" onClick={() => handleMemberClick(member.id)}>
                  <Text fontSize="lg" fontWeight="bold">{member.username}</Text>
                </Box>
              ))}
            </SimpleGrid>
          {characters.length > 0 && (
            <SimpleGrid columns={4} spacing={2} mt={4}>
            {characters.map(character => (
              <Box key={character.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  shadow="md"
                  cursor={character.isAssigned ? "not-allowed" : "pointer"}
                  opacity={character.isAssigned ? 0.5 : 1}
                  onClick={() => handleCharacterSelect(character)}
              >
                <VStack spacing={2} align="center">
                  <Image src={character.characterImage} alt={character.characterName} boxSize="150px" objectFit="cover" />
                  {selectedCharacters.some(selected => selected.characterName === character.characterName) && (
                    <Flex direction="column" align="center" mt={2}>
                      <Button size="sm" colorScheme="red" onClick={(e) => {
                        e.stopPropagation();
                        handleDeselectCharacter(character.characterName);
                      }}>선택 취소</Button>
                    </Flex>
                  )}
                  <Text fontSize="lg" fontWeight="bold">{character.characterName}</Text>
                  <Text fontSize="sm">{character.characterClassName} ({character.itemMaxLevel})</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RaidCharacterSelect;