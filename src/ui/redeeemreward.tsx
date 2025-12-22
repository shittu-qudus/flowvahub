import { useState } from 'react';
import { Home, Compass, BookOpen, Layers, CreditCard, Gift, Settings, Menu, X } from 'lucide-react';
import FlowvaSidebar from '../sidebar';
import RewardsHubHeader from './header';

export default function RedeemReward() {
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

    const rewards = [
        {
            icon: '🏦',
            title: '$5 Bank Transfer',
            description: 'The $5 equivalent will be transferred to your bank account',
            points: 5000,
            category: 'unlocked'
        },
        {
            icon: '💳',
            title: '$5 PayPal International',
            description: 'Receive a $5 Paypal balance transfer directly to your PayPal account email',
            points: 6000,
            category: 'unlocked'
        },
        {
            icon: '💳',
            title: '$5 Virtual Visa Card',
            description: 'Use your $5 prepaid card to shop anywhere Visa is accepted online.',
            points: 6000,
            category: 'unlocked'
        },
        {
            icon: '🎁',
            title: '$5 Apple Gift Card',
            description: 'Redeem this $5 Apple Gift Card to apps, games, music, movies, and more on the App Store and iTunes.',
            points: 5000,
            category: 'locked'
        },
        {
            icon: '🎁',
            title: '$5 Google Play Card',
            description: 'Use the $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.',
            points: 5000,
            category: 'locked'
        },
        {
            icon: '🎁',
            title: '$5 Amazon Gift Card',
            description: 'Get a $5 digital gift card to spend on your favorite tech or platforms.',
            points: 5000,
            category: 'locked'
        },
        {
            icon: '🎁',
            title: '$10 Amazon Gift Card',
            description: 'Get a $10 digital gift card to spend on your favorite tech or platforms.',
            points: 10000,
            category: 'locked'
        },
        {
            icon: '📚',
            title: 'Free Udemy Course',
            description: 'Coming Soon',
            points: 0,
            category: 'coming'
        }
    ];

    const filteredRewards = rewards.filter(reward => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unlocked') return reward.category === 'unlocked';
        if (activeTab === 'locked') return reward.category === 'locked';
        if (activeTab === 'coming') return reward.category === 'coming';
        return true;
    });

    const getCount = (category: string) => {
        if (category === 'all') return rewards.length;
        return rewards.filter(r => r.category === category).length;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className=''>
                <FlowvaSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:mt-0 mt-16">
                <div className='sticky top-0 z-50'>
                    <RewardsHubHeader />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8 mb-8 border-b-2 border-gray-200">

                        <button
                            onClick={() => setActiveTab('earn')}
                            className={`pb-3 px-1 font-semibold text-lg transition-colors relative ${activeTab === 'earn'
                                ? 'text-purple-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <a href="/dashboard">Earn Points</a>
                            {activeTab === 'earn' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('redeem')}
                            className={`pb-3 px-1 font-semibold text-lg transition-colors relative ${activeTab === 'redeem'
                                ? 'text-purple-600'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <a href="">Redeem Rewards</a>
                            {activeTab === 'redeem' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                            )}
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'all'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            All Rewards
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'all' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {getCount('all')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('unlocked')}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'unlocked'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Unlocked
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'unlocked' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {getCount('unlocked')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('locked')}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'locked'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Locked
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'locked' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {getCount('locked')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('coming')}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'coming'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Coming Soon
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'coming' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {getCount('coming')}
                            </span>
                        </button>
                    </div>

                    {/* Rewards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRewards.map((reward, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                                    {reward.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 flex-1">{reward.description}</p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-purple-600 font-semibold text-sm">
                                        {reward.points > 0 ? `${reward.points} pts` : '0 pts'}
                                    </span>
                                </div>
                                <button
                                    disabled={reward.category === 'locked' || reward.category === 'coming'}
                                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${reward.category === 'unlocked'
                                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {reward.category === 'coming' ? 'Coming Soon' : 'Redeem'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}