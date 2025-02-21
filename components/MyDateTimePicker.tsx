import {Text, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function MyDateTimePicker(props: {dateTime: Date, setDateTime: (dateTime: Date) => void}) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        props.setDateTime(selectedDate);
        setShowDatePicker(false);
    }

    const handleTimeChange = (event, selectedTime) => {
        props.setDateTime(selectedTime);
        setShowTimePicker(false);
    }

    const formatDate = (dateTime: Date) => {
        const today = new Date(); // Get today's date
        const inputDate = dateTime; // Convert input to a Date object

        // Check if the date is today
        if (
            inputDate.getDate() === today.getDate() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getFullYear() === today.getFullYear()
        ) {
            return "Today";
        }

        // Check if the year is the current year
        const isCurrentYear = inputDate.getFullYear() === today.getFullYear();

        // Format the date as "Monday Feb. 3"
        const options = {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: isCurrentYear ? undefined : 'numeric'
        };
        return inputDate.toLocaleDateString('en-US', options);
    }

    function formatTime(dateTime: Date) {
        const inputTime = dateTime; // Convert input to a Date object

        const options = {
            hour: 'numeric', // Use numeric hour (e.g., 8, 12)
            minute: '2-digit', // Use two-digit minutes (e.g., 00, 30)
            hour12: true // Use 12-hour clock (AM/PM)
        };
        return inputTime.toLocaleTimeString('en-US', options);
    }

    return (<>
        <View style={styles.dateTimePickerWrapper}>
            {/* Show date picker when date is pressed */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text>{formatDate(props.dateTime)}</Text>
            </TouchableOpacity>
            {/* Show time picker when time is pressed */}
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text>{formatTime(props.dateTime)}</Text>
            </TouchableOpacity>
        </View>

        {/*Date picker modal*/}
        {showDatePicker && (
            <DateTimePicker
                value={props.dateTime}
                mode={"date"}
                is24Hour={true}
                onChange={handleDateChange}
            />
        )}

        {/*Time picker modal*/}
        {showTimePicker && (
            <DateTimePicker
                value={props.dateTime}
                mode={"time"}
                is24Hour={true}
                onChange={handleTimeChange}
            />
        )}
    </>)
}

const styles = {
    dateTimePickerWrapper: {
        backgroundColor: "#F5F5FF",
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
}