import {Timestamp} from "@firebase/firestore";

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

export type HistoryEntryFromFirestore = Omit<HistoryEntry, "dateTime"> & {
    id: string,
    dateTime: Timestamp,
};

export type HistoryEntryWithMedication = HistoryEntry & {
    medicationName: string,
};