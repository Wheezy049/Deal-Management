"use client"
import React from "react";
import { Briefcase, X, LayoutGrid, BarChart2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDealStore } from "@/store/useDealStore";

function Sidebar() {
    const pathname = usePathname();
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useDealStore();

    const navItems = [
        { title: "Deals", href: "/", icon: LayoutGrid },
        { title: "Analytics", href: "/analytics", icon: BarChart2 },
    ];

    return (
        <>
            {/* Sidebar for desktop */}
            <aside className="hidden md:flex fixed top-0 left-0 h-screen w-52 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-800 flex-col z-50 transition-colors">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 w-full pt-8 pb-5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/10">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-base tracking-wide bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                            VOBB Atlas
                        </span>
                    </Link>
                </div>
                {/* Navigation Items */}
                <ul className="flex-1 mt-6 space-y-1.5 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link 
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-semibold border-l-4 ${
                                        isActive 
                                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed top-0 left-0 h-screen w-52 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-800 shadow-xl transform ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 pt-6 pb-4">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                            VOBB Atlas
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-lg text-gray-500 dark:text-gray-400"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <ul className="mt-6 space-y-1.5 px-3 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link 
                                    href={item.href} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-semibold border-l-4 ${
                                        isActive 
                                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default Sidebar;