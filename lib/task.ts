import {
    collection,
    deleteDoc,
    doc,
    DocumentReference,
    orderBy,
    query,
    Query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { database, handleError } from "lib/firebase";
import { default as TaskType } from "types/task";
import { default as UserType } from "types/user";

export function queryTasks(user: UserType, taskListId: string): Query {
    return query(
        collection(database, "users/" + user.id, "lists", taskListId, "tasks"),
        orderBy("index")
    );
}

export function referenceTask(
    user: UserType,
    taskListId: string,
    taskId: string
): DocumentReference {
    return doc(
        database,
        "users",
        user.id,
        "lists",
        taskListId,
        "tasks",
        taskId
    );
}

export async function createTask(
    user: UserType,
    taskListId: string,
    index: number
): Promise<boolean> {
    try {
        await setDoc(referenceTask(user, taskListId, uuidv4()), {
            index: index,
            completed: false,
            createdAt: Date.now(),
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function updateTask(
    user: UserType,
    taskListId: string,
    taskId: string,
    data: Partial<TaskType>
): Promise<boolean> {
    try {
        await updateDoc(referenceTask(user, taskListId, taskId), {
            ...data,
            updatedAt: Date.now(),
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

// TODO(john) correct task indecies after removal
export async function removeTask(
    user: UserType,
    taskListId: string,
    taskId: string
): Promise<boolean> {
    try {
        await deleteDoc(referenceTask(user, taskListId, taskId));
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}
