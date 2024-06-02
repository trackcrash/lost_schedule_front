import React, { useEffect, useState } from 'react';
import {
  Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, useToast, Text, FormControl, FormLabel, Input, Image
} from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { createSchedules } from '../api/ScheduleApi';
import { CompletedStatus, ScheduleCreateDTO, raids, RaidDifficulty, members } from '../entity/ScheduleCreate';
import RaidSelectModal from './RaidsSelectModal';
import RaidGroupSelectModal from './RaidGroupSelectModal';
import { RaidGroup } from 'RaidGroup/entity/RaidGroup';
import RaidCharacterSelect from './CharacterSelect';
import { CharacterDTO } from 'myinfo/entity/characterDto';
import CharacterBatch from './CharactersBatch';
const RaidScheduleModal = () => {
  const { isOpen, onOpen, onClose: baseOnClose } = useDisclosure();
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleDateTime, setScheduleDateTime] = useState(new Date());
  const [selectedRaid, setSelectedRaid] = useState<number | null>(null);
  const [selectedRaidDetails, setSelectedRaidDetails] = useState<raids | null>(null);
  const [selectedRaidGroup, setSelectedRaidGroup] = useState<RaidGroup | null>(null);
  const [selectedCharacters, setSelectedCharacters] = useState<CharacterDTO[]>([]);
  const [parties, setParties] = useState<(CharacterDTO | null)[][]>([]);
  const toast = useToast();

  const formattedMembers = parties.flatMap(party =>
    party.map((character, charIndex) => character ? {
      characterId: character.id,
      positionInParty: charIndex + 1
    } : null).filter(item => item !== null)
  );

  const onClose = () => {
    setScheduleName('');
    setScheduleDateTime(new Date());
    setSelectedRaid(null);
    setSelectedRaidDetails(null);
    setSelectedRaidGroup(null);
    setSelectedCharacters([]);
    setParties([]);
    baseOnClose();
  };

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

  const ChakraDatePicker = ({ selected, onChange }: { selected: Date, onChange: (event:any) => void }) => {
    return (
      <Input
        as={DatePicker}
        selected={selected}
        onChange={onChange}
        showTimeSelect
        dateFormat="Pp"
        variant="filled"
        _hover={{
          borderColor: 'blue.500',
        }}
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px #3182ce',
        }}
      />
    );
  };

  const handleCreateSchedule = async () => {
    if (!selectedRaid) {
      toast({
        title: "Error",
        description: "Please select a raid before scheduling.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const formattedMembers: members[] = parties.flatMap((party, partyIndex) => 
        party.map((character, charIndex) => {
          if (character) {
            const globalCharIndex = charIndex + 1 + partyIndex * 4;
            return {
              characterId: character.id,
              characterIndex: globalCharIndex
            };
          }
          return null;
        }).filter(item => item !== null) as members[]
      );

      const schedule: ScheduleCreateDTO = {
        id: 0, 
        scheduleName: scheduleName,
        raidId: selectedRaid,
        createdBy: '',
        raidGroupId: selectedRaidGroup?.id || 0,
        completedStatus: CompletedStatus.NOT_COMPLETED,
        scheduleDateTime: scheduleDateTime.toISOString(),
        characterIds: formattedMembers
      };
      const result = await createSchedules(schedule);
      toast({
        title: "저장 완료",
        description: "레이드 일정 생성이 완료되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('오류가 발생했습니다', error);
      toast({
        title: "Error",
        description: "생성중 오류가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">숙제 생성</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>아 숙제하기 싫다</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mt={4}>
              <FormLabel>숙제 이름</FormLabel>
              <Input placeholder="숙제 이름" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>시간</FormLabel>
              <ChakraDatePicker
                selected={scheduleDateTime}
                onChange={(date: Date) => setScheduleDateTime(date)}
              />
            </FormControl >
            <RaidSelectModal setSelectedRaid={setSelectedRaid} setSelectedRaidDetails={setSelectedRaidDetails}/>
            {selectedRaidDetails && (
              <Box mt={4}>
                <Text fontSize="lg" fontWeight="bold">선택된 레이드: {selectedRaidDetails.raidName + "(" + translateDifficulty(selectedRaidDetails.raidDifficulty)+")"}</Text>
              </Box>
            )}
            <RaidGroupSelectModal setSelectedRaidGroup={setSelectedRaidGroup} />
            {selectedRaidGroup && (
                <Box key={selectedRaidGroup.id} p={4} borderWidth="1px" borderRadius="lg" shadow="md" cursor="pointer">
                  <Text fontSize="lg" fontWeight="bold" mb={2}>선택된 공대명: {selectedRaidGroup.raidGroupName}</Text>
                  <Image src={selectedRaidGroup.raidGroupImage} alt={selectedRaidGroup.raidGroupName} borderRadius="md" />
                </Box>
              )}
            <RaidCharacterSelect onCharacterSelect={setSelectedCharacters} raidGroupId={selectedRaidGroup?.id} />
            {selectedRaidDetails && (
              <CharacterBatch maxPlayers={parseInt(selectedRaidDetails.maxPlayers)} characters={selectedCharacters} saveAssignment={setParties} />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateSchedule}>숙제생성</Button>
            <Button variant="ghost" onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RaidScheduleModal;
