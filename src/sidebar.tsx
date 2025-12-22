import { useState } from 'react';
import { Home, Compass, BookOpen, Layers, CreditCard, Gift, Settings, Menu, X } from 'lucide-react';

export default function FlowvaSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navigationItems = [
        { icon: Home, label: 'Home' },
        { icon: Compass, label: 'Discover' },
        { icon: BookOpen, label: 'Library' },
        { icon: Layers, label: 'Tech Stack' },
        { icon: CreditCard, label: 'Subscriptions' },
        { icon: Gift, label: 'Rewards Hub', active: true },
        { icon: Settings, label: 'Settings' },
    ];


    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-gray-800" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-800" />
                        )}
                    </button>
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                lg:static fixed top-0 left-0 z-40
                h-full transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="min-h-screen bg-white">
                    <div className="w-full max-w-sm bg-white shadow-lg p-6 flex flex-col h-screen">
                        <div className="mb-8 hidden lg:flex items-center gap-3">
                            <img
                                src="/flowvalogo.jpg"
                                alt="Flowva Logo"
                                height={120}
                                width={120}
                            />
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (window.innerWidth < 1024) {
                                            setIsOpen(false);
                                        }
                                    }}
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
            </div>


        </div>
    );
}