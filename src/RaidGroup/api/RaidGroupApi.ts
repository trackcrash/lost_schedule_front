import axiosInstance from "utility/axiosInstance";
import { RaidGroup } from 'RaidGroup/entity/RaidGroup';
import { RaidGroupMembers,RaidGroupMember, RaidMemberDTO } from "RaidGroup/entity/RaidMember";
export const createRaidGroup = async (raidGroup: RaidGroup) => {
  try {
    const response = await axiosInstance.post("/api/raidgroup", raidGroup);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchRaidGroups = async () => {
    try {
        const response = await axiosInstance.get<RaidGroup[]>("/api/raidgroup");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchRaidGroupMemberStatus = async () => {
  try {
    const response = await axiosInstance.get<RaidGroup[]>("/api/raidgroup/ismember");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getRaidMemberRequests = async (raidGroupId: number) => {
  try {
    const response = await axiosInstance.get<RaidGroupMembers[]>(`/api/raidmember/request/${raidGroupId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const acceptRaidMember = async (RaidGroupMember : RaidMemberDTO) => {
  try {
    const response = await axiosInstance.post(`/api/raidmember/accept`, RaidGroupMember);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const addRequestRaidGroup = async (raidGroupId : number) => {
    try {
        const response = await axiosInstance.post(`/api/raidmember/request/${raidGroupId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addRaidMember = async (raidGroupMember : RaidGroupMember) => {
  try {
      const response = await axiosInstance.post<RaidGroupMember>(`/api/raidmember`, raidGroupMember);
      return response.data;
  } catch (error) {
      throw error;
  }
}

export const fetchRaidGroupMembers = async (raidGroupId : number) => {
  try {
      const response = await axiosInstance.post<RaidGroupMembers[]>(`/api/raidgroup/${raidGroupId}`);
      return response.data;
  } catch (error) {
      throw error;
  }
}