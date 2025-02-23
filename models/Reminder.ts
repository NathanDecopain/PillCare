// constants for reminder model
export enum daysOfWeek {
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
    time: string,
    startDate: string,
    endDate?: string,
    daysOfWeek: Array<daysOfWeek>,
    specificDate?: string,
    intervalDays?: number,
    intervalHours?: number,
    intervalMinutes?: number,
    repeatMode: repeatMode,
    repeatCount?: number,
    repeatUntil?: string,

    isActive: boolean,
}

export type ReminderWithId = Reminder & {
    reminderId: string,
}

export type ReminderWithMedication = ReminderWithId & {
    type: reminderType.MEDICATION,
    medicationId: string,
}

export type ReminderForObservation = ReminderWithId & {
    type: reminderType.OBSERVATION
}