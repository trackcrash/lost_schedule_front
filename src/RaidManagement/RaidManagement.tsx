import React, { useState, useEffect } from 'react';
import { Box, Grid, VStack, Heading, Text, Button, useColorModeValue, Divider, Flex, Center } from '@chakra-ui/react';
import ScheduleCard from './ScheduleCard';
import RaidScheduleModal from './modals/CreateSchedule';
import { fetchSchedules } from './api/ScheduleApi';
import { Schedules } from './entity/Schedules';

const days = ['로요일', '목요일', '금요일', '토요일', '일요일', '월요일', '화요일'];

const RaidSchedule: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const dayColor = useColorModeValue('white', 'white');
  const [schedules, setSchedules] = useState<Schedules[]>([]);


  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayIndex = date.getDay();
    const customDays = ['일요일', '월요일', '화요일', '로요일', '목요일', '금요일', '토요일'];
    return customDays[dayIndex];
  };

  useEffect(() => {
    fetchSchedules().then(data => setSchedules(data)).catch(err => console.error('Failed to fetch schedules', err));
  }, []);

  return (
    <Box p={5} bg={bg} borderRadius="lg" boxShadow="lg">
      <Center mb={4}>
        <Heading size="lg" color="white.500">숙제표</Heading>
      </Center>
      <Flex justify="flex-end" mb={4}>
        <RaidScheduleModal />
      </Flex>
      <Grid templateColumns="repeat(7, 1fr)" gap={4} p={3}>
        {days.map((day, index) => (
          <VStack key={index} spacing={4} align="stretch" divider={<Divider borderColor={borderColor} />}>
            <Heading size="md" my={2} textAlign="center" color={dayColor}>{day}</Heading>
            {schedules.filter(schedule => getDayName(schedule.scheduleDateTime) === day).length > 0 ? (
              schedules.filter(schedule => getDayName(schedule.scheduleDateTime) === day)
                .map(schedule => (
                  <ScheduleCard
                    key={schedule.id}
                    id={schedule.id}
                    scheduleName={schedule.scheduleName}
                    raidDifficulty={schedule.raidDifficulty}
                    createdBy={schedule.createdBy}
                    raidName={schedule.raidName}
                    raidImage={schedule.raidImage}
                    scheduleDateTime={schedule.scheduleDateTime}
                    completedStatus={schedule.completedStatus}
                    characterName={schedule.characterName}
                  />
                ))
            ) : (
              <Box p={4} shadow="md" borderWidth="1px" borderRadius="lg" bg="yellow.200" display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="lg" fontWeight="bold" textAlign="center" color="gray.700">숙제 없다 개꿀</Text>
              </Box>
            )}
          </VStack>
        ))}
      </Grid>
    </Box>
  );
};

export default RaidSchedule;