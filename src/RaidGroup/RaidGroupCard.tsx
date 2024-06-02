import React from 'react';
import { Box, Text, Image, useColorModeValue } from '@chakra-ui/react';
import { RaidGroup } from './entity/RaidGroup';

interface RaidGroupCardProps {
  raidGroup: RaidGroup;
  onOpenModal: (raidGroup: RaidGroup) => void;
}

const RaidGroupCard: React.FC<RaidGroupCardProps> = ({ raidGroup, onOpenModal }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      as="button"
      onClick={() => onOpenModal(raidGroup)}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg={bg}
      shadow="md"
      _hover={{ bg: hoverBg, transform: 'scale(1.02)', transition: 'transform .2s' }}
      w="full"
      maxW="sm"
      m="auto"
      display="block"
    >
      <Text fontSize="xl" fontWeight="bold" isTruncated>
        {raidGroup.raidGroupName}
      </Text>
      <Image src={raidGroup.raidGroupImage} alt={raidGroup.raidGroupName} mt={2} maxH="200px" w="full" objectFit="cover" />
      <Text mt={2} noOfLines={2}>
        {raidGroup.raidGroupDescription}
      </Text>
    </Box>
  );
};

export default RaidGroupCard;
