import { useState } from 'react';
import FlowvaSidebar from './sidebar';
import RewardsHub from './ui/dashmain';
import RewardsHubHeader from './ui/header';
export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen grid bg-gray-50 grid-cols-1 md:grid-cols-[260px_1fr]">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:block border-r">
                <FlowvaSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Sidebar */}

                    <div className="relative z-50 w-[260px] h-full bg-white shadow-lg">
                        <FlowvaSidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-2xl font-bold"
                        aria-label="Open sidebar"
                    >
                        ☰
                    </button>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-6">
                    <div className='sticky top-0 z-50 '>

                        <RewardsHubHeader isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    </div>
                    <div>
                        <RewardsHub />
                        {/* <EarnMorePointsSection /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
