import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, Input, useDisclosure, Text, useToast
} from '@chakra-ui/react';
import { RaidGroup } from './entity/RaidGroup';
import { createRaidGroup, fetchRaidGroups, addRequestRaidGroup } from 'RaidGroup/api/RaidGroupApi';
import RaidGroupDetailsModal from './RaidGroupDetailsModal';
import RaidGroupForm from './form/CreateRaidGroupForm';
import RaidGroupCard from './RaidGroupCard';
import { RaidGroupMember } from './entity/RaidMember';

const RaidGroups: React.FC = () => {
  const [raidGroups, setRaidGroups] = useState<RaidGroup[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRaidGroup, setSelectedRaidGroup] = useState<RaidGroup | null>(null);
  const { isOpen, onOpen, onClose: baseOnClose } = useDisclosure();
  const toast = useToast();

  const onClose = () => {
    setSelectedRaidGroup(null);
    baseOnClose();
  };

  const handleFetchRaidGroups = async () => {
    try {
      const groups = await fetchRaidGroups();
      if (Array.isArray(groups)) {
        setRaidGroups(groups);
      } else {
        setRaidGroups([]);
      }
    } catch (error: any) {
      toast({
        title: "공대 목록 불러오기 실패",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    handleFetchRaidGroups();
  }, []);



  const handleCreateRaidGroup = async (data: RaidGroup) => {
    try {
      await createRaidGroup(data);
      toast({
        title: "공대 생성 성공",
        description: "새로운 공대가 성공적으로 생성되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      await handleFetchRaidGroups();
    } catch (error : any) {
      toast({
        title: "공대 생성 실패",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleApplyToRaidGroup = async (raidGroupId : number) => {
    try {
      await addRequestRaidGroup(raidGroupId);
      toast({
        title: "가입 신청 성공",
        description: "공대 가입 신청이 성공적으로 완료되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error : any) {
      toast({
        title: "가입 신청 실패",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Flex mb={5}>
        <Input
          placeholder="공대 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mr={2}
        />
        <Button onClick={onOpen}>공대 추가</Button>
      </Flex>
      <Flex direction="column" gap={4}>
        {raidGroups.filter(group => group.raidGroupName.toLowerCase().includes(search.toLowerCase())).map(group => (
          <RaidGroupCard key={group.id} raidGroup={group} onOpenModal={() => { setSelectedRaidGroup(group); onOpen(); }} />
        ))}
      </Flex>
      {isOpen && selectedRaidGroup && (
        <RaidGroupDetailsModal
          raidGroup={selectedRaidGroup}
          isOpen={true}
          onClose={onClose}
          onApply={() => handleApplyToRaidGroup(selectedRaidGroup.id!)}
        />
      )}
      {isOpen && !selectedRaidGroup && (
        <RaidGroupForm
          onSave={handleCreateRaidGroup}
          onClose={onClose}
        />
      )}
    </Box>
  );
};

export default RaidGroups;
