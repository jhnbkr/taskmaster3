import type { AppProps } from "next/app";

import Footer from "components/Footer";
import Header from "components/Header";
import { AuthProvider } from "context/AuthContext";

import NotificationCenter from "components/NotificationCenter";
import { NotificationProvider } from "context/NotificationContext";
import "styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthProvider>
                <NotificationProvider>
                    <NotificationCenter />
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow container w-full mx-auto p-6">
                            <Component {...pageProps} />
                        </main>
                        <Footer />
                    </div>
                </NotificationProvider>
            </AuthProvider>
        </>
    );
}
