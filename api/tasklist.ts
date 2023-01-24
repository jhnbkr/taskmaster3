import {
    collection,
    deleteDoc,
    doc,
    DocumentReference,
    Query,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { database, handleError } from "lib/firebase";
import { default as TaskListType } from "types/tasklist";
import { default as UserType } from "types/user";

export function queryTaskLists(user: UserType): Query {
    return query(collection(database, "users/" + user.id, "lists"));
}

export function referenceTaskList(
    user: UserType,
    taskListId: string
): DocumentReference {
    return doc(database, "users", user.id, "lists", taskListId);
}

export async function createTaskList(user: UserType): Promise<boolean> {
    try {
        await setDoc(referenceTaskList(user, uuidv4()), {
            createdAt: Date.now(),
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function updateTaskList(
    user: UserType,
    taskListId: string,
    data: Partial<TaskListType>
): Promise<boolean> {
    try {
        await updateDoc(referenceTaskList(user, taskListId), {
            ...data,
            updatedAt: Date.now(),
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function removeTaskList(
    user: UserType,
    taskListId: string
): Promise<boolean> {
    try {
        await deleteDoc(referenceTaskList(user, taskListId));
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}
