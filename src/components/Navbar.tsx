"use client"
import React, { useState, useEffect } from 'react'
import { Moon, Sun, AlignJustify, X } from 'lucide-react';
import Link from 'next/link';

function Navbar() {

    const [darkMode, setDarkMode] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const navItems = [
        { title: 'Deals', href: '/' },
        { title: 'Settings', href: '/settings' },
        { title: 'Profile', href: '/profile' }
    ];

    return (
        <>
        {scrolling && (
      <div className="h-[72px] md:h-[104px]"></div>
    )}
        <nav
            className={`${scrolling ? 'fixed shadow-md shadow-black/10 top-0' : 'relative'
                } w-full bg-gray-100 text-center transition-all duration-500 text-black dark:bg-gray-900 dark:text-white px-4 md:px-20 py-4 md:py-6 z-[999]`}
        >
            {/* desktop view */}
            <div className="max-w-[1200px] flex justify-between w-full items-center mx-auto">
                <h1 className="text-base sm:text-[20px] md:text-2xl font-bold"><Link href='/'>Deal Management</Link></h1>
                <ul className="hidden md:flex items-center justify-center gap-6">
                    {navItems.map((item, index) => (
                        <li key={index} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <Link href={item.href}>{item.title}</Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ?
                                <Sun className="w-5 h-5 text-yellow-500" /> :
                                <Moon className="w-5 h-5" />
                            }
                        </button>
                    </li>
                </ul>
                <div className="flex items-center justify-center md:hidden">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ?
                            <Sun className="w-5 h-5 text-yellow-500" /> :
                            <Moon className="w-5 h-5" />
                        }
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ?
                            <X className="w-6 h-6" /> :
                            <AlignJustify className="w-6 h-6" />
                        }
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
            >
                <ul className="pt-4 pb-2 space-y-4 text-center">
                    {navItems.map((item, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <a
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full"
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
        </>
    )
}

export default Navbar