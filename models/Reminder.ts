// constants for reminder model
import {Timestamp} from "@firebase/firestore";

export enum DAYS_OF_WEEK {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
}

export enum repeatMode {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
    CUSTOM = 'CUSTOM',
}

export enum reminderType {
    MEDICATION = 'MEDICATION',
    OBSERVATION = 'OBSERVATION',
}

export type Reminder = {
    userId: string,
    // Metadata
    type: reminderType,
    label: string,
    description?: string,

    // Periodicity
    time: Date, // Only the time part will be used
    startDate: Date, // Only the date part will be used
    endDate?: Date, // Only the date part will be used
    daysOfWeek: Array<DAYS_OF_WEEK>,
    specificDate?: Date,
    intervalDays?: number,
    intervalHours?: number,
    intervalMinutes?: number,
    repeatMode: repeatMode,

    isActive: boolean,
}

// When we get data from firestore, the dates are timestamp objects
export type ReminderFromFirestore = Omit<Reminder, 'time' | 'startDate' | 'endDate' | 'specificDate' | 'repeatUntil'> & {
    reminderId: string,
    time: Timestamp,
    startDate: Timestamp,
    endDate?: Timestamp,
    specificDate?: Timestamp,
    repeatUntil?: Timestamp,
}