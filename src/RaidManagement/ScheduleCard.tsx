import React from 'react';
import { Box, Heading, Text, Image, VStack, useColorModeValue, Button, useToast } from '@chakra-ui/react';
import { RaidDifficulty } from './entity/ScheduleCreate';
import { Schedules } from './entity/Schedules';
import { deleteSchdeduleByCharacterName } from './api/ScheduleApi';

const ScheduleCard: React.FC<Schedules> = ({
    scheduleName,
    createdBy,
    raidDifficulty,
    raidName,
    raidImage,
    scheduleDateTime,
    completedStatus,
    characterName,
}) => {
    const dateTime = new Date(scheduleDateTime).toLocaleString('ko-KR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const toast = useToast();
    const handleDelete = async () => {
      try {
        await deleteSchdeduleByCharacterName(characterName);
        toast({
          title: "스케줄 취소 성공",
          description: `${characterName}의 스케줄이 취소되었습니다.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // 스케줄 목록을 다시 불러오거나 상태를 업데이트 할 수 있습니다.
      } catch (error: any) {
        toast({
          title: "오류 발생",
          description: "스케줄 취소 중 문제가 발생했습니다: " + error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
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

    const difficultyLabel = translateDifficulty(raidDifficulty);

    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.700', 'white');
    const detailColor = useColorModeValue('gray.500', 'gray.300');

    return (
      <Box
        p={4}
        shadow="md"
        bg={cardBg}
        borderRadius="xl"
        borderWidth="2px"
        borderColor="gray.400"
        overflow="hidden"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: '2xl'
        }}
        transition="all 0.3s ease-in-out"
      >
        <VStack spacing={3} align="center" w="full"> {/* Changed align="start" to align="center" and added w="full" */}
          <Heading fontSize="xl" fontWeight="bold" color={textColor} mb={1}>
              {scheduleName}
          </Heading>
          <Image borderRadius="full" boxSize="80px" src={raidImage} alt={raidName} />
          <Text fontSize="md" color={detailColor} fontWeight="medium">
            {raidName} ({difficultyLabel})
          </Text>
          <Text fontSize="md" color={detailColor} fontWeight="medium">
            공대장 : {createdBy}
          </Text>
          <Text fontSize="md" color={detailColor} fontWeight="medium">
            참가 캐릭터: {characterName}
          </Text>
          <Text fontSize="md" color={detailColor}>
            {dateTime}
          </Text>
          <Button mt={3} colorScheme="red" onClick={handleDelete}>참가 취소</Button>
        </VStack>
      </Box>
    );
  };

export default ScheduleCard;
