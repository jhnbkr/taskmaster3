import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <Head>
                <title>Task Master 3 | Page not found</title>
            </Head>{" "}
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Page not found
                        </h2>
                        <Link
                            href="/"
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Return
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
