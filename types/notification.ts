type Notification = {
    id: string;
    message: string;
    type: "notice" | "warning" | "error";
};

export default Notification;
