import {Timestamp} from "@firebase/firestore";

export type Medication = {
    name: string,
    dosage: string,
    time: Timestamp,
    startDate: Timestamp,
    endDate: Timestamp,
    frequency: string,
    duration: string,
    notes: string,
    userId: string,
};