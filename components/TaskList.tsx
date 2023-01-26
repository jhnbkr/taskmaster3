import { onSnapshot } from "firebase/firestore";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import AddIcon from "components/svg/AddIcon";
import DeleteIcon from "components/svg/DeleteIcon";
import Task from "components/Task";
import { useNotification } from "context/NotificationContext";
import { createTask, queryTasks, updateTask } from "lib/task";
import {
    referenceTaskList,
    removeTaskList,
    updateTaskList,
} from "lib/tasklist";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { default as UserType } from "types/user";

type Props = {
    user: UserType;
    taskListId: string;
};

export default function TaskList({ user, taskListId }: Props) {
    const { error } = useNotification();

    const [name, setName] = useState<string>("");
    const [taskIds, setTaskIds] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            referenceTaskList(user, taskListId),
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setName(data.name);
                } else {
                    setName("");
                }
            }
        );

        return () => unsubscribe();
    }, [user, taskListId]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            queryTasks(user, taskListId),
            (snapshot) => {
                const taskIds: [number, string][] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    taskIds.push([data.index, doc.id]);
                });
                taskIds.sort((a, b) => {
                    return a[0] - b[0];
                });
                setTaskIds(
                    taskIds.map(([_, taskId]) => {
                        return taskId;
                    })
                );
            }
        );

        return () => unsubscribe();
    }, [user, taskListId]);

    async function handleRenameTaskList(event: ChangeEvent<HTMLInputElement>) {
        const success = await updateTaskList(user, taskListId, {
            name: event.target.value,
        });
        if (!success) error("Something went wrong");
    }

    async function handleRemoveTaskList() {
        if (
            (name || taskIds.length > 0) &&
            !confirm("Are you sure you want to delete this list?")
        )
            return;
        const success = await removeTaskList(user, taskListId);
        if (!success) error("Something went wrong");
    }

    async function handleCreateTask() {
        const success =
            user && (await createTask(user, taskListId, taskIds.length));
        if (!success) error("Something went wrong");
    }

    const moveTask = useCallback(
        (currentIndex: number, targetIndex: number) => {
            updateTask(user, taskListId, taskIds[currentIndex], {
                index: targetIndex,
            });
            updateTask(user, taskListId, taskIds[targetIndex], {
                index: currentIndex,
            });
        },
        [user, taskIds, taskListId]
    );

    return (
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <fieldset
                name="task list"
                className="bg-indigo-600 flex w-full items-center justify-between p-4 space-x-4"
            >
                <input
                    type="text"
                    placeholder="Name list here"
                    defaultValue={name}
                    onChange={handleRenameTaskList}
                    className="text-white placeholder:text-white text-base w-full p-0 bg-transparent border-0 focus:ring-0"
                    aria-label="task list name"
                />
                <div
                    onClick={handleRemoveTaskList}
                    className="text-white hover:cursor-pointer"
                >
                    <span className="sr-only">Remove task list</span>
                    <DeleteIcon className="w-6 h-6" aria-hidden="true" />
                </div>
            </fieldset>
            <div className="px-4 divide-y divide-gray-200">
                <DndProvider backend={HTML5Backend}>
                    {taskIds.map((taskId: string, index: number) => {
                        return (
                            <Task
                                key={taskId}
                                user={user}
                                taskListId={taskListId}
                                taskId={taskId}
                                index={index}
                                moveTask={moveTask}
                            />
                        );
                    })}
                </DndProvider>
                <div
                    onClick={handleCreateTask}
                    className="flex justify-center items-center px-2 py-4"
                >
                    <span className="sr-only">Create task</span>
                    <AddIcon
                        className="w-6 h-6 text-green-600 hover:cursor-pointer"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
}
