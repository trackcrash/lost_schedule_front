import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, SimpleGrid, useDisclosure, VStack, Image, Center } from '@chakra-ui/react';
import { fetchSchedulesInfo, userAddToSchedule } from 'RaidManagement/api/ScheduleApi';
import { fetchAllCharacters, fetchCharactersBycharacterId } from 'myinfo/api/MyInfoApi';
import { CharacterDTO } from 'myinfo/entity/characterDto';
import { AddUserToSchedule } from 'RaidManagement/entity/Schedules';

const RaidUserAdd: React.FC<{ scheduleId: number }> = ({ scheduleId }) => {
    const [characters, setCharacters] = useState<CharacterDTO[]>([]);
    const [parties, setParties] = useState<(CharacterDTO | null)[][]>([]);
    const [currentSlot, setCurrentSlot] = useState<{ partyIndex: number; slotIndex: number } | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterDTO | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 스케줄 정보와 캐릭터 정보를 가져오는 useEffect
    useEffect(() => {
        const loadData = async () => {
            const scheduleData = await fetchSchedulesInfo(scheduleId);
        
            const partyCount = scheduleData.maxPlayers / 4;
            const emptyParties: (CharacterDTO | null)[][] = Array.from({ length: partyCount }, () => Array(4).fill(null));
        
            const characterPromises = scheduleData.characterIds.map(member =>
                fetchCharactersBycharacterId(member.characterId).then(detail => ({
                    ...detail,
                    characterIndex: member.characterIndex
                }))
            );
        
            const charactersDetails = await Promise.all(characterPromises);
            charactersDetails.forEach(char => {
                const partyIndex = Math.floor((char.characterIndex - 1) / 4);
                const indexInParty = (char.characterIndex - 1) % 4;
                emptyParties[partyIndex][indexInParty] = char;
            });
        
            setParties(emptyParties);
            fetchAllCharacters().then(setCharacters);
        };
        loadData();
    }, [scheduleId]);

    const handleOpenCharacterSelect = (partyIndex: number, slotIndex: number) => {
        setCurrentSlot({ partyIndex, slotIndex });
        onOpen();
    };

    // 캐릭터 선택 처리
    const handleCharacterSelect = (character: CharacterDTO) => {
        if (character.isAssigned) {
            alert("This character is already assigned and cannot be selected.");
            return;
        }
        if (currentSlot && parties[currentSlot.partyIndex][currentSlot.slotIndex] === null) {
            const newParties = [...parties];
            newParties[currentSlot.partyIndex][currentSlot.slotIndex] = character;
            setParties(newParties);
        }
        setSelectedCharacter(character);
        onClose();
    };

    // 캐릭터 제거 처리
    const handleRemoveCharacter = (partyIndex: number, slotIndex: number) => {
        const newParties = [...parties];
        if (selectedCharacter && parties[partyIndex][slotIndex]?.id === selectedCharacter.id) {
            newParties[partyIndex][slotIndex] = null;
            setSelectedCharacter(null);
        }
        setParties(newParties);
    };

    // 변경 사항 서버에 제출
    const handleSubmitChanges = async () => {
        if (selectedCharacter && currentSlot) {
            const characterIndex = currentSlot.partyIndex * 4 + currentSlot.slotIndex + 1;
            const addCharacter: AddUserToSchedule = {
                scheduleId,
                character: {
                    characterId: selectedCharacter.id,
                    characterIndex
                }
            };
            await userAddToSchedule(addCharacter);
        }
    };

    return (
        <Box p={5}>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>캐릭터 선택</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={5}>
                        {characters.map(character => (
                            <Box 
                                key={character.id} 
                                p={3} 
                                boxShadow="base" 
                                borderRadius="lg" 
                                cursor={character.isAssigned ? "not-allowed" : "pointer"}
                                opacity={character.isAssigned ? 0.5 : 1}
                                onClick={() => {
                                    if (!character.isAssigned) {
                                        handleCharacterSelect(character);
                                    }
                                }}
                            >
                                <VStack>
                                    <Image src={character.characterImage} alt={character.characterName} boxSize="100px" objectFit="cover" />
                                    <Text fontWeight="bold">{character.characterName}</Text>
                                    <Text fontSize="sm">{character.characterClassName}</Text>
                                    <Text fontSize="sm">{character.itemMaxLevel}</Text>
                                </VStack>
                            </Box>
                        ))}
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <VStack align="stretch" spacing={5}>
                {parties.map((party, partyIndex) => (
                    <Box key={partyIndex}>
                        <Text fontSize="xl" fontWeight="bold">{partyIndex + 1}파티</Text>
                        <SimpleGrid columns={1} spacing={2}>
                            {party.map((char, index) => (
                                <Center key={index} p={2} borderWidth="1px" borderRadius="lg" boxShadow="sm" height="100px">
                                    {char ? (
                                            <>
                                                <Text>{char.characterName}</Text>
                                                {selectedCharacter && char.id === selectedCharacter.id && (
                                                    <Button size="xs" colorScheme="red" onClick={() => handleRemoveCharacter(partyIndex, index)}>취소</Button>
                                                )}
                                            </>
                                        ) : (
                                            <Button colorScheme="teal" onClick={() => handleOpenCharacterSelect(partyIndex, index)}>캐릭터 추가</Button>
                                    )}
                                </Center>
                            ))}
                        </SimpleGrid>
                    </Box>
                ))}
            </VStack>
            <Button mt={4} onClick={handleSubmitChanges} colorScheme="blue">참가하기</Button>
        </Box>
    );
};

export default RaidUserAdd;
