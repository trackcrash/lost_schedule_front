import React, { useEffect, useState } from 'react';
import {
  Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, useDisclosure, SimpleGrid, Image
} from '@chakra-ui/react';
import { fetchRaidGroupMemberStatus } from 'RaidGroup/api/RaidGroupApi';
import { fetchSchedulesGroupId, fetchSchedulesInfo } from './api/ScheduleApi';
import { RaidGroup } from 'RaidGroup/entity/RaidGroup';
import { Schedules } from './entity/Schedules';
import RaidUserAdd from './modals/RaidUserAdd';
import { RaidDifficulty } from './entity/ScheduleCreate';


export const RaidGroupsAndSchedules: React.FC = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [raidGroups, setRaidGroups] = useState<RaidGroup[]>([]);
    const [schedules, setSchedules] = useState<Schedules[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedules | null>(null);

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


    useEffect(() => {
      const loadRaidGroups = async () => {
        try {
          const groups = await fetchRaidGroupMemberStatus();
          setRaidGroups(groups);
        } catch (error) {
          console.error("Error loading raid groups", error);
        }
      };
      loadRaidGroups();
    }, []);

    const handleGroupClick = async (groupId: number) => {
      setSelectedGroupId(groupId);
      try {
        const loadedSchedules = await fetchSchedulesGroupId(groupId);
        setSchedules(loadedSchedules);
      } catch (error) {
        console.error("Error fetching schedules", error);
      }
    };

    const handleScheduleClick = (scheduleId: number) => {
      const selected = schedules.find(schedule => schedule.id === scheduleId);
      if (selected) {
          setSelectedSchedule(selected);
          onOpen();
      } else {
          console.error("Selected schedule not found in loaded schedules");
      }
  };

  const RaidGroupCard = ({ group, onClick }: { group: RaidGroup, onClick: () => void }) => {
    return (
      <Box
        key={group.id}
        p={4}
        shadow="xl"
        borderWidth="1px"
        borderRadius="lg"
        _hover={{ bg: 'blue.500', color: 'white', transform: 'scale(1.05)', transition: 'all .2s ease-in-out' }}
        onClick={onClick}
        cursor="pointer"
        textAlign="center" // 중앙 정렬
      >
        <Image
          src={group.raidGroupImage}
          boxSize="120px" // 이미지 크기 조정
          objectFit="cover"
          alt={group.raidGroupName}
          m="auto" // 이미지를 상자 중앙에 위치
          mb={3} // 이미지와 텍스트 사이의 마진 조정
        />
        <Text fontSize="lg" fontWeight="bold">{group.raidGroupName}</Text>
      </Box>
    );
  };

    return (
      <Box p={5}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">공대 선택</Text>
      <SimpleGrid columns={4} spacing={5}>
      {raidGroups.map(group => (
        <RaidGroupCard key={group.id} group={group} onClick={() => handleGroupClick(group.id!)} />
      ))}
    </SimpleGrid>

      <Text fontSize="2xl" mt={6} mb={4} fontWeight="bold">공대 레이드일정</Text>
      <SimpleGrid columns={4} spacing={5}>
        {schedules.map(schedule => (
          <Box key={schedule.id} p={5} shadow="lg" borderWidth="1px" borderRadius="lg"
               _hover={{ bg: 'green.500', color: 'white', transform: 'scale(1.05)', transition: 'all .2s ease-in-out' }}
               onClick={() => handleScheduleClick(schedule.id)} cursor="pointer">
            <Text fontSize="lg" fontWeight="bold">{schedule.raidName}</Text>
            <Text fontSize="sm">{translateDifficulty(schedule.raidDifficulty)}</Text>
            <Text fontSize="sm">{new Date(schedule.scheduleDateTime).toLocaleDateString()}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {selectedSchedule && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>레이드 참가</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RaidUserAdd scheduleId={selectedSchedule.id} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
  
  export default RaidGroupsAndSchedules;
