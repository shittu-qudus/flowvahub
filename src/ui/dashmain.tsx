import { useState } from 'react';
import { Star, Calendar, Zap, UserPlus, Gift } from 'lucide-react';
import MorePointsSection from './dashmaintwo'
// Placeholder component - replace with your actual EarnMorePointsSection
function EarnMorePointsSection() {
    const rewards = [
        {
            icon: '💸',
            title: '$5 Bank Transfer',
            description: 'The $5 equivalent will be transferred to your bank account',
            points: 5000,
            category: 'unlocked'
        },
        {
            icon: '💸',
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

    const [filterTab, setFilterTab] = useState('all');

    const filteredRewards = rewards.filter(reward => {
        if (filterTab === 'all') return true;
        if (filterTab === 'unlocked') return reward.category === 'unlocked';
        if (filterTab === 'locked') return reward.category === 'locked';
        if (filterTab === 'coming') return reward.category === 'coming';
        return true;
    });

    const getCount = (category: string) => {
        if (category === 'all') return rewards.length;
        return rewards.filter(r => r.category === category).length;
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setFilterTab('all')}
                    className={`px-4 py-2 font-medium transition-colors relative ${filterTab === 'all'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    All Rewards
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterTab === 'all' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {getCount('all')}
                    </span>
                </button>
                <button
                    onClick={() => setFilterTab('unlocked')}
                    className={`px-4 py-2 font-medium transition-colors relative ${filterTab === 'unlocked'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Unlocked
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterTab === 'unlocked' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {getCount('unlocked')}
                    </span>
                </button>
                <button
                    onClick={() => setFilterTab('locked')}
                    className={`px-4 py-2 font-medium transition-colors relative ${filterTab === 'locked'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Locked
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterTab === 'locked' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {getCount('locked')}
                    </span>
                </button>
                <button
                    onClick={() => setFilterTab('coming')}
                    className={`px-4 py-2 font-medium transition-colors relative ${filterTab === 'coming'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Coming Soon
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filterTab === 'coming' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {getCount('coming')}
                    </span>
                </button>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                            {reward.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 flex-1">{reward.description}</p>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-purple-600 font-semibold text-sm">
                                {reward.points > 0 ? ` ⭐️${reward.points} pts` : '0 pts'}
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
    );
}

export default function RewardsHub() {
    const [activeTab, setActiveTab] = useState('earn');
    const [currentDay] = useState('M');
    const pointsBalance = 0;
    const pointsTarget = 5000;

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('earn')}
                        className={`pb-4 px-4 font-semibold text-base transition-colors ${activeTab === 'earn'
                            ? 'text-purple-600 underline decoration-2 underline-offset-8 bg-purple-50'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Earn Points
                    </button>
                    <button
                        onClick={() => setActiveTab('redeem')}
                        className={`pb-4 px-4 font-semibold text-base transition-colors ${activeTab === 'redeem'
                            ? 'text-purple-600 underline decoration-2 underline-offset-8 bg-purple-50'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Redeem Rewards
                    </button>
                </div>

                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-7 bg-purple-600 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Your Rewards Journey
                    </h1>
                </div>

                {/* Conditional Content Based on Active Tab */}
                {activeTab === 'earn' ? (
                    <>
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Points Balance Card */}
                            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <Star className="w-5 h-5 text-purple-600" />
                                    <h2 className="text-base font-semibold text-gray-900">Points Balance</h2>
                                </div>

                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-6xl font-bold text-purple-600">{pointsBalance}</span>
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                                        <Star className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                                        <span>Progress to $5 Gift Card</span>
                                        <span className="font-medium">{pointsBalance}/{pointsTarget}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                            style={{ width: `${(pointsBalance / pointsTarget) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-4">
                                    🚀 Just getting started — keep earning points!
                                </p>
                            </div>

                            {/* Daily Streak Card */}
                            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <h2 className="text-base font-semibold text-gray-900">Daily Streak</h2>
                                </div>

                                <div className="mb-6">
                                    <span className="text-6xl font-bold text-purple-600">0</span>
                                    <span className="text-2xl font-medium text-gray-900 ml-2">day</span>
                                </div>

                                {/* Days of Week */}
                                <div className="flex justify-between mb-5">
                                    {daysOfWeek.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${day === currentDay && index === 0
                                                ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-600 text-center mb-5">
                                    Check in daily to to earn +5 points
                                </p>

                                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <Zap className="w-5 h-5" />
                                    Claim Today's Points
                                </button>
                            </div>

                            {/* Featured Tool Spotlight Card */}
                            <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-400 rounded-3xl shadow-sm p-6 text-white">
                                <div className="inline-block bg-white bg-opacity-25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                                    Featured
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold mb-1">Top Tool Spotlight</h2>
                                        <h3 className="text-2xl font-bold mb-3">Reclaim</h3>
                                    </div>
                                    <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                </div>

                                <div className="bg-white text-gray-900 rounded-2xl p-4 mb-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1.5">Automate and Optimize Your Schedule</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks, meetings, and breaks to boost productivity. Free to try — earn Flowva Points when you sign up!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-white hover:bg-gray-50 text-purple-600 font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        <UserPlus className="w-4 h-4" />
                                        Sign up
                                    </button>
                                    <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm">
                                        <Gift className="w-4 h-4" />
                                        Claim 50 pts
                                    </button>
                                </div>
                            </div>

                        </div>
                        <MorePointsSection />
                    </>
                ) : (
                    <EarnMorePointsSection />
                )}
            </div>
        </div>
    );
}