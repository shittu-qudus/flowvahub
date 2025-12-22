
import { Bell, Menu, X } from 'lucide-react';
import FlowvaSidebar from '../sidebar';

interface RewardsHubHeaderProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export default function RewardsHubHeader({ isOpen, toggleSidebar }: RewardsHubHeaderProps) {
    const notificationCount = 3;

    return (
        <>
            {/* Mobile/Tablet Sidebar Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Mobile/Tablet Sidebar */}
            <div className={`lg:hidden fixed top-0 left-0 h-screen z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <FlowvaSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            </div>

            {/* Remove any max-width constraints and use w-full */}
            <div className="bg-gray-100 border-b border-gray-200 w-full py-4">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">

                        {/* Hamburger Menu Button - Mobile/Tablet only */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6 text-gray-800" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-800" />
                            )}
                        </button>

                        {/* Title - Center/Left */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                Rewards Hub
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 sm:block">
                                Earn points, unlock rewards, and celebrate your progress!
                            </p>
                        </div>

                        {/* Notification Bell */}
                        <div className="relative flex-shrink-0">
                            <button className="p-2.5 bg-white hover:bg-gray-50 rounded-full shadow-sm transition-colors">
                                <Bell className="w-5 h-5 text-gray-700" />
                            </button>
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}