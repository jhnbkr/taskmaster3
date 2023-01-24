import type { AppProps } from "next/app";
import Script from "next/script";

import Footer from "components/Footer";
import Header from "components/Header";
import NotificationCenter from "components/NotificationCenter";
import { AuthProvider } from "context/AuthContext";
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
                        <main className="container flex-grow w-full mx-auto p-6">
                            <Component {...pageProps} />
                        </main>
                        <Footer />
                    </div>
                </NotificationProvider>
            </AuthProvider>
            <Script
                id="mobile-vh-fix"
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");`,
                }}
            />
        </>
    );
}
