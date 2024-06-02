export enum CompletedStatus {
    COMPLETED = "COMPLETED",
    NOT_COMPLETED = "NOT_COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface members{
    characterId: number;
    characterIndex: number;
}

export interface ScheduleCreateDTO {
    id: number;
    scheduleName: string;
    createdBy: string;
    raidId: number;
    raidGroupId: number;
    completedStatus: CompletedStatus;
    scheduleDateTime: string;
    characterIds: members[];
}

export enum RaidDifficulty {
    NORMAL = "NORMAL",
    HARD = "HARD",
    HELL = "HELL"
}

export interface raids {
    id: number;
    raidName: string;
    raidImage: string;
    RequiredItemLevel: string;
    raidDifficulty: RaidDifficulty;
    maxPlayers: string;
}