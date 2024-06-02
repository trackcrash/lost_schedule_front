import React, { useEffect, useState } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CharacterDTO } from 'myinfo/entity/characterDto';

interface CharacterBatchProps {
  maxPlayers: number;
  characters: CharacterDTO[];
  saveAssignment: (parties: (CharacterDTO | null)[][]) => void;
}

const CharacterBatch: React.FC<CharacterBatchProps> = ({ maxPlayers, characters, saveAssignment }) => {
  const [parties, setParties] = useState<(CharacterDTO | null)[][]>([]);
  const emptySlotColor = useColorModeValue("gray.200", "gray.600");
  const partyBackgroundColor = useColorModeValue("gray.50", "gray.700");
  const hoverBgColor = useColorModeValue("blue.100", "gray.700");

  useEffect(() => {
    const numParties = Math.ceil(maxPlayers / 4);
    const initialParties: (CharacterDTO | null)[][] = Array.from({ length: numParties }, () => Array(4).fill(null));

    characters.forEach(character => {
        const foundParty = initialParties.find(party => party.includes(null));
        if (foundParty) {
            const index = foundParty.indexOf(null);
            if (index !== -1) foundParty[index] = character;
        }
    });

    setParties(initialParties);
    saveAssignment(initialParties);
}, [characters, maxPlayers, saveAssignment]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourcePartyIndex = parseInt(source.droppableId);
    const destinationPartyIndex = parseInt(destination.droppableId);
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const newParties = parties.map(party => [...party]);
    const character = newParties[sourcePartyIndex][sourceIndex];
    newParties[sourcePartyIndex][sourceIndex] = null;
    newParties[destinationPartyIndex][destinationIndex] = character;

    setParties(newParties);
    saveAssignment(newParties);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {parties.map((party, partyIndex) => (
        <Droppable key={partyIndex} droppableId={String(partyIndex)}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              bg={snapshot.isDraggingOver ? hoverBgColor : partyBackgroundColor}
              p={4}
              mt={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.500"
              boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
            >
              <Text fontSize="lg" fontWeight="bold">{partyIndex + 1} 파티</Text>
              {party.map((char, index) => (
                <Draggable key={index} draggableId={`item-${partyIndex}-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      p={2}
                      m={1}
                      bg={char ? "gray.700" : emptySlotColor}
                      borderWidth="2px"
                      borderColor={snapshot.isDragging ? "blue.500" : "gray.400"} 
                      boxShadow={snapshot.isDragging ? "0 2px 10px rgba(0, 0, 0, 0.2)" : "none"}
                    >
                      {char ? char.characterName : "빈 슬롯"}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default CharacterBatch;