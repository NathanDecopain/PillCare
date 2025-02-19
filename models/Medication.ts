import {Timestamp} from "@firebase/firestore";

export type MedicationTypes =
    "prescription"
    | "supplement"
    | "over-the-counter"
    | "other";

export type Medication = {
    name: string,
    dosage: string,
    type: MedicationTypes,
    notes?: string,
    userId: string,
    isInactive: boolean,
};

export type MedicationWithId = Medication & { medicationId: string };