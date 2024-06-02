import { CompletedStatus, RaidDifficulty, members } from "./ScheduleCreate";

export interface Schedules{
    id: number;
    scheduleName: string;
    createdBy: string;
    raidName: string;
    raidImage: string;
    raidDifficulty: RaidDifficulty;
    scheduleDateTime: string;
    completedStatus: CompletedStatus;
    characterName: string;
}

export interface ScheduleInfo {
    characterIds : members[];
    maxPlayers: number;
}

export interface AddUserToSchedule {
    scheduleId: number;
    character: members;
}