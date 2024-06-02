import React, { useState, useEffect } from 'react';
import {
  Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, useToast, SimpleGrid, Image, Text,
  Center
} from '@chakra-ui/react';
import { RaidGroup } from 'RaidGroup/entity/RaidGroup';
import { fetchRaidGroupMemberStatus } from 'RaidGroup/api/RaidGroupApi';

interface RaidGroupSelectModalProps {
  setSelectedRaidGroup: React.Dispatch<React.SetStateAction<RaidGroup | null>>;
}

export const RaidGroupSelectModal: React.FC<RaidGroupSelectModalProps> = ({ setSelectedRaidGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [raidGroups, setRaidGroups] = useState<RaidGroup[]>([]);
  const toast = useToast();

  useEffect(() => {
    const loadRaidGroups = async () => {
      try {
        const groups = await fetchRaidGroupMemberStatus();
        setRaidGroups(groups);
      } catch (error) {
        console.error('Failed to fetch raid groups', error);
        toast({
          title: 'Error',
          description: 'Failed to load raid group data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    loadRaidGroups();
  }, []);

  const handleRaidGroupSelection = (group: RaidGroup) => {
    setSelectedRaidGroup(group);
    onClose(); // Optionally close the modal after selection
  };

  return (
    <>
    <Center mb={4}>
      <Button colorScheme="green" onClick={onOpen} mt={4}>공대 선택</Button>
    </Center>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>공대 선택</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={3} spacing={4}>
              {raidGroups.map(group => (
                <Box key={group.id} p={4} borderWidth="1px" borderRadius="lg" shadow="md" cursor="pointer" onClick={() => handleRaidGroupSelection(group)}>
                  <Image src={group.raidGroupImage} alt={group.raidGroupName} borderRadius="md" />
                  <Text mt={2} fontSize="lg" fontWeight="bold">{group.raidGroupName}</Text>
                  <Text fontSize="sm">{group.raidGroupDescription}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RaidGroupSelectModal;