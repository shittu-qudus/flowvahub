import React, { useState } from 'react';
import { Trophy, Calendar, Zap, UserPlus, Gift } from 'lucide-react';
import EarnMorePointsSection from './dashmaintwo';
import RewardsHubHeader from './header';
export default function RewardsHub() {
    const [activeTab, setActiveTab] = useState('earn');
    const [currentDay, setCurrentDay] = useState('S');
    const pointsBalance = 0;
    const pointsTarget = 5000;

    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

            <div className="max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b-2 border-gray-200">

                    <button
                        onClick={() => setActiveTab('earn')}
                        className={`pb-3 px-1 font-semibold text-lg transition-colors relative ${activeTab === 'earn'
                            ? 'text-purple-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Earn Points
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
                        <a href="redeem">Redeem Rewards</a>
                        {activeTab === 'redeem' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                        )}
                    </button>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Your Rewards Journey
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Points Balance Card */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="w-6 h-6 text-purple-600" />
                            <h2 className="text-lg font-semibold text-gray-800">Points Balance</h2>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <span className="text-5xl font-bold text-purple-600">{pointsBalance}</span>
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Progress to $5 Gift Card</span>
                                <span className="font-semibold">{pointsBalance}/{pointsTarget}</span>
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
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="w-6 h-6 text-blue-500" />
                            <h2 className="text-lg font-semibold text-gray-800">Daily Streak</h2>
                        </div>

                        <div className="mb-6">
                            <span className="text-5xl font-bold text-purple-600">0</span>
                            <span className="text-2xl font-semibold text-gray-600 ml-2">day</span>
                        </div>

                        {/* Days of Week */}
                        <div className="flex justify-between mb-6">
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${day === currentDay
                                        ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-gray-600 text-center mb-4">
                            Check in daily to to earn +5 points
                        </p>

                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" />
                            Claim Today's Points
                        </button>
                    </div>

                    {/* Featured Tool Spotlight Card */}
                    <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-400 rounded-2xl shadow-md p-6 text-white">
                        <div className="inline-block bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                            Featured
                        </div>

                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Top Tool Spotlight</h2>
                                <h3 className="text-xl font-semibold mb-4">Reclaim</h3>
                            </div>
                            <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white text-gray-900 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold mb-1">Automate and Optimize Your Schedule</h4>
                                    <p className="text-sm text-gray-600">
                                        Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks, meetings, and breaks to boost productivity. Free to try — earn Flowva Points when you sign up!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-white hover:bg-gray-100 text-purple-600 font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Sign up
                            </button>
                            <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
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