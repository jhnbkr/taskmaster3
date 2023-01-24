import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
    createTaskList,
    retrieveTaskLists,
    serializeTaskList,
} from "api/tasklist";
import AddIcon from "components/svg/AddIcon";
import TaskList from "components/TaskList";
import { useAuth } from "context/AuthContext";
import { useNotification } from "context/NotificationContext";
import { default as TaskListType } from "types/tasklist";

export default function TaskManager() {
    const { user } = useAuth();
    const { error } = useNotification();

    const [taskLists, setTaskLists] = useState<TaskListType[]>([]);

    useEffect(() => {
        if (!user) {
            setTaskLists([]);
            return;
        }

        const unsubscribe = onSnapshot(retrieveTaskLists(user), (snapshot) => {
            const taskLists: TaskListType[] = [];
            snapshot.forEach((doc) => {
                taskLists.push(serializeTaskList(doc));
            });
            taskLists.sort((a, b) => {
                return a.created_at - b.created_at;
            });
            setTaskLists(taskLists);
        });

        return () => unsubscribe();
    }, [user]);

    async function handleCreateTaskList() {
        const success = user && (await createTaskList(user));
        if (!success) error("Something went wrong");
    }

    if (!user) return <></>;

    return (
        <div className="container grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {taskLists.map((taskList) => {
                return (
                    <TaskList
                        key={taskList.id}
                        user={user}
                        taskList={taskList}
                    />
                );
            })}
            <div className="flex justify-center items-center">
                <button
                    type="button"
                    onClick={handleCreateTaskList}
                    className="p-3 bg-indigo-600 hover:bg-indigo-800 text-white shadow rounded-full hover:cursor-pointer transition-all"
                >
                    <AddIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
