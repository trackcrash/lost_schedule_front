import React, { useState, useEffect } from 'react';
import {
    Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    SimpleGrid, Image, Text, Center, useDisclosure, useToast
} from '@chakra-ui/react';
import { fetchAllRaids } from '../api/ScheduleApi';
import { raids, RaidDifficulty } from '../entity/ScheduleCreate';

interface RaidSelectModalProps {
  setSelectedRaid: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedRaidDetails: React.Dispatch<React.SetStateAction<raids | null>>;
}

const RaidSelectModal: React.FC<RaidSelectModalProps> = ({ setSelectedRaid, setSelectedRaidDetails }) => {
    
    const translateDifficulty = (difficulty: RaidDifficulty) => {
        switch (difficulty) {
          case RaidDifficulty.NORMAL:
            return "노말";
          case RaidDifficulty.HARD:
            return "하드";
          case RaidDifficulty.HELL:
            return "헬";
          default:
            return "Unknown";
        }
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [raidsList, setRaidsList] = useState<raids[]>([]);
    const toast = useToast();

    useEffect(() => {
        const loadRaids = async () => {
            try {
                const loadedRaids = await fetchAllRaids();
                setRaidsList(loadedRaids);
            } catch (error) {
                console.error('Failed to fetch raids', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load raids data.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        loadRaids();
    }, []);

    const handleRaidSelection = (raid: raids) => {
        setSelectedRaid(raid.id);
        setSelectedRaidDetails(raid);
        toast({
            title: "레이드 선택됨",
            description: `${raid.raidName}`,
            status: "info",
            duration: 5000,
            isClosable: true,
        });
        onClose();
    };

    return (
        <>
            <Center>
                <Button colorScheme="green" onClick={onOpen} mt={4} textColor={'gray.800'}>레이드 선택</Button>
            </Center>
            <Modal isOpen={isOpen} onClose={onClose} size="2xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>레이드 선택</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={4} spacing={4}>
                            {raidsList.map(raid => (
                                <Box key={raid.id} p={3} borderWidth="1px" borderRadius="lg" shadow="md" cursor="pointer" onClick={() => handleRaidSelection(raid)}>
                                    <Image src={raid.raidImage} alt={raid.raidName} borderRadius="md" />
                                    <Text mt={2} fontSize="lg" fontWeight="bold">{raid.raidName + " (" + translateDifficulty(raid.raidDifficulty) + ")"}</Text>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RaidSelectModal;
