import { ScheduleCreateDTO, raids } from "RaidManagement/entity/ScheduleCreate";
import { AddUserToSchedule, ScheduleInfo, Schedules } from "RaidManagement/entity/Schedules";
import axiosInstance from "utility/axiosInstance";


export const fetchAllRaids = async () => {
    try {
        const response = await axiosInstance.get<raids[]>("/api/raids");
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const createSchedules = async (ScheduleCreateDTO: ScheduleCreateDTO) => {
  try {
    const response = await axiosInstance.post("/api/schedules", ScheduleCreateDTO);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSchedules = async () => {
  try {
    const response = await axiosInstance.get<Schedules[]>("/api/schedules");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchSchedulesGroupId = async (groupId:number) => {
  try {
    const response = await axiosInstance.get<Schedules[]>(`/api/schedules/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteSchdeduleByCharacterName = async (characterName:string) => {
  try {
    const response = await axiosInstance.delete(`/api/schedules/deleteUser/${characterName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchSchedulesInfo = async (scheduleId:number) => {
  try {
    const response = await axiosInstance.get<ScheduleInfo>(`/api/schedules/info/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const userAddToSchedule = async (AddUserToSchedule: AddUserToSchedule) => {
  try {
    const response = await axiosInstance.post(`/api/schedules/addUser`,AddUserToSchedule);
    return response.data;
  } catch (error) {
    throw error;
  }
}