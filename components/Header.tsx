import { logout } from "lib/auth";
import LogoIcon from "components/svg/LogoIcon";
import LogoName from "components/svg/LogoName";
import { useAuth } from "context/AuthContext";
import { useNotification } from "context/NotificationContext";

export default function Header() {
    const { user } = useAuth();
    const { notice, error } = useNotification();

    async function handleLogout() {
        if (!confirm("Are you sure you want to logout?")) return;
        const success = await logout();
        success ? notice("Logged out") : error("Something went wrong");
    }

    return (
        <header className="bg-indigo-600">
            <div className="mx-auto container p-6">
                <div className="flex w-full items-center justify-between">
                    <div className="flex space-x-4 items-center">
                        <LogoIcon className="w-10 h-10 stroke-white" />
                        <LogoName className="h-5 fill-white" />
                    </div>

                    {user && (
                        <>
                            <div className="flex space-x-4 items-center">
                                <p className="hidden sm:block text-base font-medium text-white">
                                    {user.email}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-md border border-transparent bg-white py-1 px-4 text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
