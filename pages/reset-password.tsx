import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import { resetPassword } from "api/auth";
import { useAuth } from "context/AuthContext";
import { useNotification } from "context/NotificationContext";

export default function ResetPassword() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { notice, error } = useNotification();

    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        if (!loading && user) router.push("/");
    }, [user, loading, router]);

    async function handlePaswordReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const success = await resetPassword(email);
        success
            ? notice("Password reset email sent")
            : error("Something went wrong");
    }

    return (
        <>
            <Head>
                <title>Task Master 3 | Reset password</title>
            </Head>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Reset account password
                        </h2>
                        <form
                            className="space-y-6"
                            onSubmit={handlePaswordReset}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Reset Password
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm"></div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/login"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
