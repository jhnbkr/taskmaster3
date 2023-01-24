import { ReactNode, useState } from "react";

import AlertIcon from "components/svg/AlertIcon";
import CheckIcon from "components/svg/CheckIcon";
import CloseIcon from "components/svg/CloseIcon";
import { default as NotificationType } from "types/notification";

type Props = {
    notification: NotificationType;
};

const icons: { notice: ReactNode; warning: ReactNode; error: ReactNode } = {
    notice: <CheckIcon className="w-6 h-6 text-green-400" />,
    warning: <AlertIcon className="w-6 h-6 text-yellow-400" />,
    error: <AlertIcon className="w-6 h-6 text-red-400" />,
};

export default function Notification({ notification }: Props) {
    const [dismissed, setDismissed] = useState(false);

    return (
        <div
            className="pointer-events-auto shrink-0 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            hidden={dismissed}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {icons[notification.type]}
                    </div>

                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setDismissed(true)}
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">
                                Dismiss Notification
                            </span>
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
