import React from "react";
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const moveToLoginPage = () => {
    navigate("/signin");
    onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Flex flexDir={"column"}>
          <ModalHeader>로그인이 필요한 서비스 입니다.</ModalHeader>
          <ModalBody>로그인 하시겠습니까?</ModalBody>
        </Flex>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose} colorScheme={"red"}>
              취소
            </Button>
            <Button onClick={moveToLoginPage} colorScheme={"green"}>
              로그인
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;