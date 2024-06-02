import axiosInstance from "utility/axiosInstance";
import { CharacterDTO } from "myinfo/entity/characterDto";


export const fetchAllCharacters = async () => {
    try {
        const response = await axiosInstance.get<CharacterDTO[]>("/api/character");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCharactersById = async (characterId: number) => {
  try {
      const response = await axiosInstance.post<CharacterDTO[]>(`/api/character/${characterId}`);
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const fetchCharactersBycharacterId = async (characterId: number) => {
  try {
      const response = await axiosInstance.post<CharacterDTO>(`/api/character/detail/${characterId}`);
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const fetchCharactersByName = async (playerName: string) => {
  try {
    const response = await axiosInstance.post("/api/character", { playerName });
    return response.data;
  } catch (error) {
    throw error;
  }
};