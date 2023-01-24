import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import TaskManager from "components/TaskManager";
import { useAuth } from "context/AuthContext";

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    if (loading) {
        return <></>;
    }

    return (
        <>
            <Head>
                <title>Task Master 3</title>
            </Head>
            <TaskManager />
        </>
    );
}
