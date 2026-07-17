"use client"
import Navbar from '@/components/Sidebar'
import Header from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import { useDealStore } from '@/store/useDealStore'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar 
} from 'lucide-react'

function ProfilePage() {
  const { deals, fetchDeals } = useDealStore();
  const [profile] = useState({
    name: "John Doe",
    role: "Senior Account Executive",
    email: "johndoe@gmail.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    joinedDate: "October 2024",
    avatar: "JD"
  });

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Aggregate user statistics
  const stats = React.useMemo(() => {
    const totalDeals = deals.length;
    const completedDeals = deals.filter(d => d.stage === 'Completed').length;
    const totalValueClosed = deals
      .filter(d => d.stage === 'Completed')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const winRate = totalDeals > 0 ? (completedDeals / totalDeals) * 100 : 0;

    return {
      totalDeals,
      completedDeals,
      totalValueClosed,
      winRate
    };
  }, [deals]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-row w-full">
      {/* Sidebar */}
      <Navbar />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-52">
        {/* Sticky Header */}
        <Header />
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-10 py-6 overflow-y-auto text-gray-900 dark:text-gray-100">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">User Profile</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account details and view your sales performance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex flex-col items-center text-center">
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-blue-500/20">
                  {profile.avatar}
                </div>
                <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-full font-semibold mt-1">
                  {profile.role}
                </span>
                {/* Contact list */}
                <div className="w-full mt-6 space-y-3.5 text-left border-t border-gray-100 dark:border-gray-700/50 pt-5 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>Joined {profile.joinedDate}</span>
                  </div>
                </div>
              </div>
              {/* Right Card: Performance Metrics & Targets */}
              <div className="md:col-span-2 space-y-6">
                {/* Quick stats grid */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Sales Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-lg border border-gray-100 dark:border-gray-750">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Total Revenue Closed</span>
                      <span className="text-xl font-bold block mt-1 text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(stats.totalValueClosed)}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-lg border border-gray-100 dark:border-gray-750">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Average Win Rate</span>
                      <span className="text-xl font-bold block mt-1 text-blue-600 dark:text-blue-450">
                        {stats.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-lg border border-gray-100 dark:border-gray-750">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Completed Deals</span>
                      <span className="text-xl font-bold block mt-1">
                        {stats.completedDeals}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-850 p-4 rounded-lg border border-gray-100 dark:border-gray-750">
                      <span className="text-xs text-gray-400 uppercase tracking-wider block font-semibold">Deals Managed</span>
                      <span className="text-xl font-bold block mt-1">
                        {stats.totalDeals}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Targets Progress */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Quarterly Target Progression
                  </h3>
                  <div className="space-y-4 pt-1">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Revenue Goal ($200,000)</span>
                        <span className="font-bold">
                          {((stats.totalValueClosed / 200000) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((stats.totalValueClosed / 200000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Deals Won Goal (20)</span>
                        <span className="font-bold">
                          {((stats.completedDeals / 20) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-50 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((stats.completedDeals / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Achievements */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Certifications & Badges
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 rounded-lg text-xs font-semibold">
                      🏆 Million Dollar Club Elite
                    </span>
                    <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 rounded-lg text-xs font-semibold">
                      🎓 Certified Sales Specialist
                    </span>
                    <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 rounded-lg text-xs font-semibold">
                      🎓 High Velocity Closer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage;