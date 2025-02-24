import {useState, useEffect, useRef} from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import {Platform} from "react-native";
import {router} from "expo-router";

export interface PushNotificationState {
    notification: Notifications.Notification;
    expoPushToken: Notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {

    // How notifications are displayed
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: false,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();

    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                console.log("Failed to get push token for push notification!");
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            }));

            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }

            return token;
        } else {
            console.log("Must use physical device for Push Notifications");
        }
    }


    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification
        // (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            router.push({pathname: "/addToHistory", params: {medicationId: response.notification.request.content.data.medicationId}});
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current!);
            Notifications.removeNotificationSubscription(responseListener.current!);
        };
    }, []);

    return {expoPushToken, notification};
};