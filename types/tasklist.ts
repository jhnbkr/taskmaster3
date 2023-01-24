import { default as TaskType } from "types/task";

type TaskList = {
    id: string;
    name: string;
    tasks: TaskType[];
    createdAt: number;
    updatedAt: number;
};

export default TaskList;
