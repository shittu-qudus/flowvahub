import { useState } from 'react';
import { Trophy, Calendar, Zap, UserPlus, Gift } from 'lucide-react';
import EarnMorePointsSection from './dashmaintwo';
import { useNavigate } from 'react-router-dom';
export default function RewardsHub() {
    const navigate = useNavigate();
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
                        className={`pb-4 px-1 font-semibold text-base transition-colors relative ${activeTab === 'earn'
                            ? 'text-purple-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Earn Points
                        {activeTab === 'earn' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('redeem')}
                        className={`pb-4 px-1 font-semibold text-base transition-colors relative ${activeTab === 'redeem'
                            ? 'text-purple-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <a href="redeem" onClick={() => navigate('/redeem')}>Redeem Rewards</a>
                        {activeTab === 'redeem' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t"></div>
                        )}
                    </button>
                </div>

                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-7 bg-purple-600 rounded-full"></div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Your Rewards Journey
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Points Balance Card */}
                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <Trophy className="w-5 h-5 text-purple-600" />
                            <h2 className="text-base font-semibold text-gray-900">Points Balance</h2>
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <span className="text-6xl font-bold text-purple-600">{pointsBalance}</span>
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                                <Trophy className="w-8 h-8 text-white" />
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
                                <img src="/spotlight.png" alt="Reclaim Logo" height={50} width={50} />
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
            </div>
            <EarnMorePointsSection />
        </div>
    );
}