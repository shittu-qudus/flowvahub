import { Bell } from 'lucide-react';

export default function RewardsHubHeader() {
    const notificationCount = 3;

    return (
        <div className="bg-gray-100 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        Rewards Hub
                    </h1>
                    <p className="text-sm text-gray-600">
                        Earn points, unlock rewards, and celebrate your progress!
                    </p>
                </div>

                {/* Notification Bell */}
                <div className="relative">
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
    );
}