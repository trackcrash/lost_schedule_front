import React,{ useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text, Image, Box, VStack, HStack
} from '@chakra-ui/react';
import { RaidGroup } from './entity/RaidGroup';
import { RaidGroupMember, RaidGroupMembers } from './entity/RaidMember';
import { acceptRaidMember, fetchRaidGroupMemberStatus, getRaidMemberRequests } from './api/RaidGroupApi';

interface RaidGroupDetailsModalProps {
  raidGroup: RaidGroup;
  isOpen: boolean;
  onClose: () => void;
  onApply: (raidGroupMember:RaidGroupMember) => void;
}

const RaidGroupDetailsModal: React.FC<RaidGroupDetailsModalProps> = ({ raidGroup, isOpen, onClose, onApply }) => {
  const [isMember, setIsMember] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [requests, setRequests] = useState<RaidGroupMembers[]>([]);

  useEffect(() => {
    const checkMembership = async () => {
      const membersRaidGroups = await fetchRaidGroupMemberStatus();
      const isMember = membersRaidGroups.some((group : RaidGroup) => group.id === raidGroup.id);
      const isMaster = membersRaidGroups.some((group : RaidGroup) => group.id === raidGroup.id && group.master);
      setIsMember(isMember);
      setIsMaster(isMaster);
  
      if (isMaster) {
        const requestsData = await getRaidMemberRequests(raidGroup.id!);
        setRequests(requestsData);
      }
    };
  
    checkMembership();
  }, [raidGroup]);

  const handleApplyClick = () => {
    console.log(raidGroup.id);
    const raidGroupMember: RaidGroupMember = {
      raidGroupId: raidGroup.id ?? 0,
    };
    onApply(raidGroupMember);
  };

  const handleAccept = async (userId: number) => {
    try {
      const acceptanceData = {
        raidGroupId: raidGroup.id ?? 0,
        userId: userId
      };
      console.log(acceptanceData);
      const result = await acceptRaidMember(acceptanceData);
      if (result.success) {
        alert('가입 승인 완료');
      } else {
        alert('승인 실패');
      }
    } catch (error) {
      alert('승인 과정 중 오류가 발생했습니다.');
      console.error('Error accepting raid member:', error);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{raidGroup.raidGroupName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Image src={raidGroup.raidGroupImage} alt={raidGroup.raidGroupName} maxH="200px" w="full" objectFit="cover" />
            <Text mt={4}>{raidGroup.raidGroupDescription}</Text>
            {isMaster && (
              <VStack spacing={4}>
                {requests.map(request => (
                  <HStack key={request.id} justify="space-between">
                    <Text>{request.username}</Text>
                    <Button colorScheme="green" onClick={() => handleAccept(request.id)}>가입 승인</Button>
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          {!isMember && <Button colorScheme="blue" onClick={handleApplyClick}>가입 신청</Button>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RaidGroupDetailsModal;