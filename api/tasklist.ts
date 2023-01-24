import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    DocumentReference,
    query,
    Query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { database, handleError } from "lib/firebase";
import TaskList from "types/tasklist";
import User from "types/user";

export function retrieveTaskLists(user: User): Query {
    return query(collection(database, "users/" + user.id, "lists"));
}

export async function createTaskList(user: User): Promise<boolean> {
    try {
        await setDoc(doc(database, "users", user.id, "lists", uuidv4()), {
            created_at: Date.now(),
        });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function updateTaskList(
    taskListRef: DocumentReference,
    data: Partial<TaskList>
): Promise<boolean> {
    try {
        await updateDoc(taskListRef, { ...data, updated_at: Date.now() });
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export async function removeTaskList(
    taskListRef: DocumentReference
): Promise<boolean> {
    try {
        await deleteDoc(taskListRef);
        return true;
    } catch (error) {
        handleError(error);
        return false;
    }
}

export function serializeTaskList(taskListDoc: DocumentData): TaskList {
    const data = taskListDoc.data();
    return {
        id: taskListDoc.id,
        name: data.name,
        tasks: data.tasks
            ? Object.keys(data.tasks)
                  .map((key: string) => {
                      return { id: key, ...data.tasks[key] };
                  })
                  .sort((a, b) => {
                      return a.created_at - b.created_at;
                  })
                  .reduce((tasks, task) => ({ ...tasks, [task.id]: task }), {})
            : {},
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
}
