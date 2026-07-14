"use client"
import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, Settings, Menu, Briefcase, ChevronDown } from "lucide-react";
import { useDealStore } from "@/store/useDealStore";
import Link from "next/link";

function Navbar() {
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useDealStore();
    const [darkMode, setDarkMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load theme from localStorage on mount
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

    // Toggle theme
    const toggleDarkMode = () => {
        const nextMode = !darkMode;
        setDarkMode(nextMode);
        if (nextMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors py-3 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
                        aria-label="Toggle navigation drawer"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="md:hidden flex items-center gap-2">
                        <div className="bg-blue-600 text-white p-1 rounded-md">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                            VOBB Atlas
                        </span>
                    </Link>
                    <div className="hidden md:block">
                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Workspace</span>
                        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                            Welcome back, <span className="text-blue-600 dark:text-blue-400">John Doe</span>!
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-3.5">     
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors outline-none"
                        aria-label="Toggle theme color"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-yellow-500 animate-spin-slow" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                    {/* Profile Dropdown Container */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 focus:outline-none p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
                            aria-label="User profile options"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                                JD
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                        </button>
                        {/* Dropdown Menu Panel */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-3 duration-155">
                                <div className="p-4 bg-gray-50/50 dark:bg-gray-850/50 border-b border-gray-100 dark:border-gray-800">
                                    <span className="font-bold text-gray-900 dark:text-white block capitalize">John Doe</span>
                                    <span className="text-xs text-gray-400 dark:text-white block truncate mt-0.5">johndoe@gmail.com</span>
                                </div>
                                <div className="p-1.5 space-y-0.5">
                                    <Link 
                                        href="/profile" 
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors text-left"
                                    >
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>View Profile</span>
                                    </Link>
                                    <Link 
                                        href="/settings" 
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors text-left"
                                    >
                                        <Settings className="w-4 h-4 text-gray-400" />
                                        <span>Settings</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;