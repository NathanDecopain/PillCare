type HistoryEntryTypes = "medication" | "observation";

export type HistoryEntry = {
    userId: string,
    type: HistoryEntryTypes,
    medicationId?: string,
    createdAt: Date,
    dateTime: Date,
    dosage?: string,
    observation?: string,
    reminderId?: string,
};