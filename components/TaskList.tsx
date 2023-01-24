import { doc, DocumentReference } from "firebase/firestore";
import { ChangeEvent } from "react";

import { removeTaskList, updateTaskList } from "api/tasklist";
import { createTask } from "api/task";
import AddIcon from "components/svg/AddIcon";
import DeleteIcon from "components/svg/DeleteIcon";
import Task from "components/Task";
import { useNotification } from "context/NotificationContext";
import { database } from "lib/firebase";
import { default as TaskType } from "types/task";
import { default as TaskListType } from "types/tasklist";
import User from "types/user";

type Props = {
    user: User;
    taskList: TaskListType;
};

export default function TaskList({ user, taskList }: Props) {
    const { error } = useNotification();
    const taskListRef: DocumentReference = doc(
        database,
        "users",
        user.id,
        "lists",
        taskList.id
    );

    async function handleRenameTaskList(event: ChangeEvent<HTMLInputElement>) {
        const success = await updateTaskList(taskListRef, {
            name: event.target.value,
        });
        if (!success) error("Something went wrong");
    }

    async function handleRemoveTaskList() {
        if (!confirm("Are you sure you want to delete this list?")) return;
        const success = await removeTaskList(taskListRef);
        if (!success) error("Something went wrong");
    }

    async function handleCreateTask() {
        const success = user && (await createTask(taskListRef));
        if (!success) error("Something went wrong");
    }

    return (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="bg-indigo-600 flex w-full items-center justify-between p-4 space-x-4">
                <input
                    type="text"
                    placeholder="Name list here"
                    defaultValue={taskList.name}
                    onChange={handleRenameTaskList}
                    className="text-white placeholder:text-white text-base w-full p-0 bg-transparent border-0 focus:ring-0"
                />
                <div
                    onClick={handleRemoveTaskList}
                    className="text-white hover:cursor-pointer"
                >
                    <DeleteIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="px-4 divide-y divide-gray-200">
                {Object.keys(taskList.tasks).map((key: string) => {
                    const task: TaskType = taskList.tasks[key];
                    return (
                        <Task
                            key={task.id}
                            taskListRef={taskListRef}
                            task={task}
                        />
                    );
                })}
                <div
                    onClick={handleCreateTask}
                    className="flex justify-center items-center px-2 py-4"
                >
                    <AddIcon className="w-6 h-6 text-green-600 hover:cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
