import { ReactNode, useState, useEffect } from "react";

import AlertIcon from "components/svg/AlertIcon";
import CheckIcon from "components/svg/CheckIcon";
import CloseIcon from "components/svg/CloseIcon";
import { default as NotificationType } from "types/notification";

type NotificationColor = {
    text: string;
    bg: string;
};

const colors: {
    notice: NotificationColor;
    warning: NotificationColor;
    error: NotificationColor;
} = {
    notice: { text: "text-green-400", bg: "bg-green-400" },
    warning: { text: "text-yellow-400", bg: "bg-yellow-400" },
    error: { text: "text-red-400", bg: "bg-red-400" },
};

const icons: { notice: ReactNode; warning: ReactNode; error: ReactNode } = {
    notice: (
        <CheckIcon
            className={`w-6 h-6 ${colors.notice.text}`}
            aria-hidden="true"
        />
    ),
    warning: (
        <AlertIcon
            className={`w-6 h-6 ${colors.warning.text}`}
            aria-hidden="true"
        />
    ),
    error: (
        <AlertIcon
            className={`w-6 h-6 ${colors.error.text}`}
            aria-hidden="true"
        />
    ),
};

const updateInterval: number = 10;

export default function Notification({
    message,
    type,
    createdAt,
    expiresAt,
}: NotificationType) {
    const [remaining, setRemaining] = useState<number>(1);
    const [dismissed, setDismissed] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration: number = expiresAt - createdAt;
            const remaining: number =
                Math.max(expiresAt - Date.now(), 0) / duration;
            setRemaining(remaining);
        }, updateInterval);

        return () => clearTimeout(timer);
    }, [createdAt, expiresAt, remaining]);

    return (
        <div
            className="pointer-events-auto shrink-0 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            hidden={dismissed}
            tabIndex={dismissed ? -1 : 0}
        >
            <div className="p-6">
                <div className="flex items-start">
                    {icons[type]}

                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p
                            className="text-sm font-medium text-gray-900"
                            aria-label="notification message"
                        >
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">
                                Dismiss notification
                            </span>
                            <CloseIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
            <div
                className={`h-2 ${colors[type].bg}`}
                style={{ width: remaining * 100 + "%" }}
            ></div>
        </div>
    );
}
