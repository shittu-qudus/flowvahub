import { useState } from 'react';
import FlowvaSidebar from './sidebar';
import RewardsHub from './ui/dashmain';
import RewardsHubHeader from './ui/header';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-0">
            <div className="h-full grid grid-cols-1 md:grid-cols-[260px_1fr]">
                {/* Sidebar (Desktop) */}
                <div className='hidden lg:block h-full'>
                    <FlowvaSidebar />
                </div>

                {/* Main Content */}
                <div className="overflow-y-auto">
                    {/* Page Content */}
                    <div className="p-0">
                        <div className='sticky top-0 z-50'>
                            <RewardsHubHeader
                                isOpen={sidebarOpen}
                                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                            />
                        </div>
                        <div>
                            <RewardsHub />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}