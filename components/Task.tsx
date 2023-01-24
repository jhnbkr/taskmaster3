import { DocumentReference } from "firebase/firestore";
import { ChangeEvent } from "react";

import { removeTask, updateTask } from "api/task";
import CloseIcon from "components/svg/CloseIcon";
import { useNotification } from "context/NotificationContext";
import { default as TaskType } from "types/task";

type Props = {
    taskListRef: DocumentReference;
    task: TaskType;
};

export default function Task({ taskListRef, task }: Props) {
    const { error } = useNotification();

    async function handleRenameTask(event: ChangeEvent<HTMLInputElement>) {
        const success = await updateTask(taskListRef, task.id, {
            description: event.target.value,
        });
        if (!success) error("Something went wrong");
    }

    async function handleCompleteTask(event: ChangeEvent<HTMLInputElement>) {
        const success = await updateTask(taskListRef, task.id, {
            completed: event.target.checked,
        });
        if (!success) error("Something went wrong");
    }

    async function handleRemoveTask() {
        if (!confirm("Are you sure you want to delete this task?")) return;
        const success = await removeTask(taskListRef, task.id);
        if (!success) error("Something went wrong");
    }

    return (
        <fieldset name="task" className="flex items-center px-2 py-4 space-x-4">
            <input
                name="completed"
                type="checkbox"
                checked={task.completed}
                onChange={handleCompleteTask}
                className="peer/completed h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
            />
            <input
                name="description"
                type="text"
                placeholder="Describe task here"
                defaultValue={task.description}
                onChange={handleRenameTask}
                className="text-gray-700 text-base w-full p-0 bg-transparent border-0 focus:ring-0 peer-checked/completed:line-through"
            />

            <div
                onClick={handleRemoveTask}
                className="text-red-400 hover:cursor-pointer"
            >
                <CloseIcon className="w-6 h-6" />
            </div>
        </fieldset>
    );
}
