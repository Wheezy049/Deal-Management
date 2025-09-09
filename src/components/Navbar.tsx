"use client"
import React, { useState, useEffect } from "react";
import { Moon, Sun, AlignJustify, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function Sidebar() {
    const [darkMode, setDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const navItems = [
        { title: "Deals", href: "/" },
        { title: "Settings", href: "/settings" },
        { title: "Profile", href: "/profile" },
    ];

    return (
        <>
            {/* Sidebar for desktop */}
            <aside className="hidden md:flex fixed top-0 left-0 h-screen w-52 bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow-lg flex-col z-50">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span>
                        {
                            darkMode ? (
                                <Image src='/vobb-light.png' alt="logo" width={150} height={150} />
                            ) : (
                                <Image src='/vobb-dark.png' alt="logo" width={150} height={150} />
                            )
                        }

                    </span>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <ul className="flex-1 mt-6 space-y-4 px-4">
                    {navItems.map((item, index) => (
                        <li
                            key={index}
                            className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                        >
                            <Link href={item.href}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Mobile Top Bar */}
            <div className="flex md:hidden fixed top-0 left-0 w-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-4 shadow-md justify-between items-center z-50">
                <span>
                    {
                        darkMode ? (
                            <Image src='/vobb-light.png' alt="logo" width={150} height={150} />
                        ) : (
                            <Image src='/vobb-dark.png' alt="logo" width={150} height={150} />
                        )
                    }

                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <AlignJustify className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-52 bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow-lg transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out z-40 md:hidden`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span>
                        {
                            darkMode ? (
                                <Image src='/vobb-light.png' alt="logo" width={150} height={150} />
                            ) : (
                                <Image src='/vobb-dark.png' alt="logo" width={150} height={150} />
                            )
                        }

                    </span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <ul className="mt-6 space-y-4 px-4">
                    {navItems.map((item, index) => (
                        <li
                            key={index}
                            className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                        >
                            <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Sidebar;
