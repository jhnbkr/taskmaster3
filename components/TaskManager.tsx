import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import AddIcon from "components/svg/AddIcon";
import TaskList from "components/TaskList";
import { useAuth } from "context/AuthContext";
import { useNotification } from "context/NotificationContext";
import { createTaskList, queryTaskLists } from "lib/tasklist";

export default function TaskManager() {
    const { user } = useAuth();
    const { error } = useNotification();

    const [taskListIds, setTaskListIds] = useState<string[]>([]);

    useEffect(() => {
        if (!user) {
            setTaskListIds([]);
            return;
        }

        const unsubscribe = onSnapshot(queryTaskLists(user), (snapshot) => {
            const taskListIds: [number, string][] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                taskListIds.push([data.index, doc.id]);
            });
            taskListIds.sort((a, b) => {
                return a[0] - b[0];
            });
            setTaskListIds(
                taskListIds.map(([_, taskId]) => {
                    return taskId;
                })
            );
        });

        return () => unsubscribe();
    }, [user]);

    async function handleCreateTaskList() {
        const success =
            user && (await createTaskList(user, taskListIds.length));
        if (!success) error("Something went wrong");
    }

    if (!user) return <></>;

    return (
        <div className="container grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {taskListIds.map((taskListId) => {
                return (
                    <TaskList
                        key={taskListId}
                        user={user}
                        taskListId={taskListId}
                    />
                );
            })}
            <div className="flex justify-center items-center">
                <button
                    type="button"
                    onClick={handleCreateTaskList}
                    className="p-3 bg-indigo-600 hover:bg-indigo-800 text-white shadow rounded-full hover:cursor-pointer transition-all"
                >
                    <span className="sr-only">Create task list</span>
                    <AddIcon className="w-6 h-6" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
