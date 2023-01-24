import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { default as NotificationType } from "types/notification";

const notificationTimeout = 2000;

type NotificationContext = {
    notifications: NotificationType[];
    notice(message: string): void;
    warning(message: string): void;
    error(message: string): void;
};

const notificationContextDefaultValues: NotificationContext = {
    notifications: [],
    notice: () => {},
    warning: () => {},
    error: () => {},
};

const NotificationContext = createContext<NotificationContext>(
    notificationContextDefaultValues
);

export function useNotification() {
    return useContext(NotificationContext);
}

type Props = {
    children: ReactNode;
};

export function NotificationProvider({ children }: Props) {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotifications(notifications.slice(1));
        }, notificationTimeout);
        return () => clearTimeout(timer);
    }, [notifications]);

    function appendMessage(
        message: string,
        type: "notice" | "warning" | "error"
    ) {
        const notification: NotificationType = {
            id: uuidv4(),
            message: message,
            type: type,
        };
        setNotifications([...notifications, notification]);
    }

    function appendNotice(message: string) {
        appendMessage(message, "notice");
    }

    function appendWarning(message: string) {
        appendMessage(message, "warning");
    }

    function appendError(message: string) {
        appendMessage(message, "error");
    }

    return (
        <>
            <NotificationContext.Provider
                value={{
                    notifications,
                    notice: appendNotice,
                    warning: appendWarning,
                    error: appendError,
                }}
            >
                {children}
            </NotificationContext.Provider>
        </>
    );
}
