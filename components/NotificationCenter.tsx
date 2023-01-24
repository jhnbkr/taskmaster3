import Notification from "components/Notification";
import { useNotification } from "context/NotificationContext";

export default function NotificationCenter() {
    const { notifications } = useNotification();

    return (
        <div className="pointer-events-none fixed inset-0 flex p-4">
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {notifications.map((notification) => {
                    return (
                        <Notification
                            key={notification.id}
                            notification={notification}
                        />
                    );
                })}
            </div>
        </div>
    );
}
