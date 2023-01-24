import Task from "types/task";

type TaskList = {
    id: string;
    name: string;
    tasks: { [key: string]: Task };
    created_at: number;
    updated_at: number;
};

export default TaskList;
