import React from 'react';
import { Home, Compass, BookOpen, Layers, CreditCard, Gift, Settings, Menu, X } from 'lucide-react';

interface FlowvaSidebarProps {
    isOpen?: boolean;
    toggleSidebar?: () => void;
}

export default function FlowvaSidebar({ isOpen = false, toggleSidebar }: FlowvaSidebarProps) {
    const navigationItems = [
        { icon: Home, label: 'Home' },
        { icon: Compass, label: 'Discover' },
        { icon: BookOpen, label: 'Library' },
        { icon: Layers, label: 'Tech Stack' },
        { icon: CreditCard, label: 'Subscriptions' },
        { icon: Gift, label: 'Rewards Hub', active: true },
        { icon: Settings, label: 'Settings' },
    ];

    const handleNavClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (toggleSidebar) {
            toggleSidebar();
        }
    };

    return (
        <>
            {/* Sidebar Content */}
            <div className="min-h-screen bg-white">
                <div className="w-full max-w-sm bg-white shadow-lg p-6 flex flex-col h-screen">
                    {/* Header with Close Button */}
                    <div className="mb-8 flex items-center justify-between gap-3">
                        <img
                            src="/flowvalogo.jpg"
                            alt="Flowva Logo"
                            height={120}
                            width={120}
                        />
                        {/* Close button - only visible on mobile */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navigationItems.map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                className={`
                                    flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                                    ${item.active
                                        ? 'bg-purple-200 text-purple-700 rounded-xl'
                                        : 'text-gray-800 hover:bg-gray-100'
                                    }
                                `}
                                onClick={handleNavClick}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className={`text-lg ${item.active ? 'font-semibold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </a>
                        ))}
                    </nav>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center">
                            <span className="text-purple-700 text-xl font-semibold">U</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-semibold text-base">Unknown</p>
                            <p className="text-gray-500 text-sm truncate">mojev86560@nctime.c...</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}