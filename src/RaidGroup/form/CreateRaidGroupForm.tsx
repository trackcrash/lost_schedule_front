import React, { useState } from 'react';
import { RaidGroup } from 'RaidGroup/entity/RaidGroup';
import { Button, FormControl, FormLabel, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box } from '@chakra-ui/react';

interface RaidGroupFormProps {
    onSave: (data: RaidGroup) => void;
    onClose: () => void;
}

const RaidGroupForm: React.FC<RaidGroupFormProps> = ({ onSave, onClose }) => {
    const [raidGroupName, setRaidGroupName] = useState('');
    const [raidGroupDescription, setRaidGroupDescription] = useState('');
    const [raidGroupImage, setRaidGroupImage] = useState('');
  
    const handleSubmit = () => {
      onSave({
        raidGroupName,
        raidGroupDescription,
        raidGroupImage
      });
      onClose();
    };
  
    return (
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>공대 생성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="raidGroupName" isRequired>
              <FormLabel>공대 이름</FormLabel>
              <Input
                placeholder="공대 이름 입력"
                value={raidGroupName}
                onChange={(e) => setRaidGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl id="raidGroupDescription" mt={4}>
              <FormLabel>공대 설명</FormLabel>
              <Input
                placeholder="공대 설명 입력"
                value={raidGroupDescription}
                onChange={(e) => setRaidGroupDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="raidGroupImage" mt={4}>
              <FormLabel>공대 이미지 URL</FormLabel>
              <Input
                placeholder="이미지 URL 입력"
                value={raidGroupImage}
                onChange={(e) => setRaidGroupImage(e.target.value)}
              />
            </FormControl>
            {raidGroupImage && (
              <Box mt={4} textAlign="center">
                <Image src={raidGroupImage} alt="Preview" maxH="200px" />
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              생성
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default RaidGroupForm;