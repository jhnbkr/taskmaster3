import { default as TaskType } from "types/task";

type TaskList = {
    id: string;
    index: number;
    name: string;
    tasks: TaskType[];
    createdAt: number;
    updatedAt: number;
};

export default TaskList;
