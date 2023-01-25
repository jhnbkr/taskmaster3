type Notification = {
    id: string;
    message: string;
    type: "notice" | "warning" | "error";
    createdAt: number;
    expiresAt: number;
};

export default Notification;
