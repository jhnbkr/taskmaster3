import { deleteField, DocumentReference, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { handleError } from "lib/firebase";
import Task from "types/task";

export async function createTask(
    taskListRef: DocumentReference
): Promise<boolean> {
    try {
        const task: Partial<Task> = {
            completed: false,
            created_at: Date.now(),
        };
        await setDoc(
            taskListRef,
            {
                tasks: { [uuidv4()]: task },
                updated_at: Date.now(),
            },
            { merge: true }
        );
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function updateTask(
    taskListRef: DocumentReference,
    id: string,
    task: Partial<Task>
): Promise<boolean> {
    try {
        task.updated_at = Date.now();
        await setDoc(
            taskListRef,
            {
                tasks: { [id]: task },
                updated_at: Date.now(),
            },
            { merge: true }
        );
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function removeTask(
    taskListRef: DocumentReference,
    key: string
): Promise<boolean> {
    try {
        await setDoc(
            taskListRef,
            {
                tasks: { [key]: deleteField() },
                updated_at: Date.now(),
            },
            { merge: true }
        );
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}
