import { ReactNode } from "react";

import GitHubIcon from "components/svg/GitHubIcon";
import TwitterIcon from "components/svg/TwitterIcon";
import WebsiteIcon from "components/svg/WebsiteIcon";

type FooterLink = {
    name: string;
    href: string;
    icon: ReactNode;
};

const links: FooterLink[] = [
    {
        name: "Website",
        href: "https://johnbaker.ca",
        icon: <WebsiteIcon className="h-6 w-6" aria-hidden="true" />,
    },

    {
        name: "Twitter",
        href: "https://twitter.com/jhnbkr88",
        icon: <TwitterIcon className="h-6 w-6" aria-hidden="true" />,
    },
    {
        name: "GitHub",
        href: "https://github.com/jhnbkr",
        icon: <GitHubIcon className="h-6 w-6" aria-hidden="true" />,
    },
];

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="mx-auto container p-6 md:flex md:items-center md:justify-between">
                <div className="flex justify-center space-x-6 md:order-2">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500 transition-all"
                        >
                            <span className="sr-only">{link.name}</span>
                            {link.icon}
                        </a>
                    ))}
                </div>
                <div className="mt-6 md:order-1 md:mt-0">
                    <p
                        className="text-center text-xs leading-5 text-gray-500"
                        aria-label="copyright"
                    >
                        &copy; {new Date().getFullYear()} John Baker
                    </p>
                </div>
            </div>
        </footer>
    );
}
