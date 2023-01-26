import type { Identifier, XYCoord } from "dnd-core";
import { onSnapshot } from "firebase/firestore";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import CloseIcon from "components/svg/CloseIcon";
import { useNotification } from "context/NotificationContext";
import { referenceTask, removeTask, updateTask } from "lib/task";
import { default as UserType } from "types/user";
import Bars2Icon from "./svg/Bars2Icon";

type Props = {
    user: UserType;
    taskListId: string;
    taskId: string;
    index: number;
    moveTask: (currentIndex: number, targetIndex: number) => void;
};

interface DragItem {
    index: number;
    id: string;
    type: string;
}

export default function Task({
    user,
    taskListId,
    taskId,
    index,
    moveTask,
}: Props) {
    const { error } = useNotification();

    const ref = useRef<HTMLFieldSetElement>(null);
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

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: "task",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },

        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const currentIndex = item.index;
            const targetIndex = index;

            if (currentIndex === targetIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (
                (currentIndex < targetIndex && hoverClientY < hoverMiddleY) ||
                (currentIndex > targetIndex && hoverClientY > hoverMiddleY)
            )
                return;

            moveTask(currentIndex, targetIndex);
            item.index = targetIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "task",
        item: () => {
            return { taskId, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <fieldset
            name="task"
            className="flex items-center px-2 py-4 space-x-4"
            ref={ref}
            style={{ opacity: isDragging ? 0 : 1 }}
            data-handler-id={handlerId}
        >
            <div className="text-slate-400 hover:cursor-pointer">
                <span className="sr-only">Move task</span>
                <Bars2Icon className="w-6 h-6" aria-hidden="true" />
            </div>
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
