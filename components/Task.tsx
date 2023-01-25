import { onSnapshot } from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";

import CloseIcon from "components/svg/CloseIcon";
import { useNotification } from "context/NotificationContext";
import { referenceTask, removeTask, updateTask } from "lib/task";
import { default as UserType } from "types/user";

type Props = {
    user: UserType;
    taskListId: string;
    taskId: string;
};

export default function Task({ user, taskListId, taskId }: Props) {
    const { error } = useNotification();

    const [description, setDescription] = useState<string>("");
    const [completed, setCompleted] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            referenceTask(user, taskListId, taskId),
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setDescription(data.description);
                    setCompleted(data.completed);
                } else {
                    setDescription("");
                    setCompleted(false);
                }
            }
        );

        return () => unsubscribe();
    }, [user, taskListId, taskId]);

    async function handleRenameTask(event: ChangeEvent<HTMLInputElement>) {
        const success = await updateTask(user, taskListId, taskId, {
            description: event.target.value,
        });
        if (!success) error("Something went wrong");
    }

    async function handleCompleteTask(event: ChangeEvent<HTMLInputElement>) {
        const success = await updateTask(user, taskListId, taskId, {
            completed: event.target.checked,
        });
        if (!success) error("Something went wrong");
    }

    async function handleRemoveTask() {
        if (
            description &&
            !confirm("Are you sure you want to delete this task?")
        )
            return;
        const success = await removeTask(user, taskListId, taskId);
        if (!success) error("Something went wrong");
    }

    return (
        <fieldset name="task" className="flex items-center px-2 py-4 space-x-4">
            <input
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={handleCompleteTask}
                className="peer/completed h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
            />
            <input
                name="description"
                type="text"
                placeholder="Describe task here"
                defaultValue={description}
                onChange={handleRenameTask}
                className="text-gray-700 text-base w-full p-0 bg-transparent border-0 focus:ring-0 peer-checked/completed:line-through"
            />

            <div
                onClick={handleRemoveTask}
                className="text-red-400 hover:cursor-pointer"
            >
                <span className="sr-only">Remove task</span>
                <CloseIcon className="w-6 h-6" aria-hidden="true" />
            </div>
        </fieldset>
    );
}
