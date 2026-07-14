"use client"
import React, { useEffect, useMemo } from 'react'
import Navbar from '@/components/Sidebar'
import Header from '@/components/Navbar'
import { useDealStore } from '@/store/useDealStore'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Percent, 
  Award,
  Layers
} from 'lucide-react'

// color palette for Pie Chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

function AnalyticsDashboard() {
  const { deals, fetchDeals, loading, error } = useDealStore();

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // 1. KPI Aggregations
  const stats = useMemo(() => {
    const totalPipeline = deals
      .filter(d => d.stage !== 'Lost' && d.stage !== 'Completed')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const totalDealsValue = deals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const avgDealSize = deals.length > 0 ? totalDealsValue / deals.length : 0;

    const openDealsCount = deals.filter(d => d.stage !== 'Lost' && d.stage !== 'Completed').length;

    const closedDeals = deals.filter(d => d.stage === 'Completed' || d.stage === 'Lost');
    const wonDeals = closedDeals.filter(d => d.stage === 'Completed').length;
    const winRate = closedDeals.length > 0 ? (wonDeals / closedDeals.length) * 100 : 0;

    return {
      totalPipeline,
      avgDealSize,
      openDealsCount,
      winRate
    };
  }, [deals]);

  // 2. Chart Data: Deals count & value by stage
  const stageChartData = useMemo(() => {
    const stagesList = [
      "Lead Generated",
      "Contacted",
      "Application Submitted",
      "Application Under Review",
      "Deal Finalized",
      "Payment Confirmed",
      "Completed",
      "Lost"
    ];
    return stagesList.map(stage => {
      const count = deals.filter(d => d.stage === stage).length;
      const value = deals.filter(d => d.stage === stage).reduce((sum, d) => sum + (d.amount || 0), 0);
      return {
        name: stage,
        Count: count,
        Value: value
      };
    });
  }, [deals]);

  // 3. Chart Data: Revenue by Product
  const productChartData = useMemo(() => {
    const productMap: { [key: string]: number } = {};
    deals.forEach(d => {
      const name = d.productName || 'Unassigned';
      productMap[name] = (productMap[name] || 0) + (d.amount || 0);
    });
    return Object.keys(productMap).map(name => ({
      name,
      value: productMap[name]
    })).sort((a, b) => b.value - a.value);
  }, [deals]);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-row w-full">
        <Navbar />
        <div className="flex-1 flex flex-col min-w-0 md:pl-52">
          <Header />
          <main className="flex-1 px-4 md:px-10 py-6 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400 animate-pulse text-lg font-medium">Loading sales analytics...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-row w-full">
        <Navbar />
        <div className="flex-1 flex flex-col min-w-0 md:pl-52">
          <Header />
          <main className="flex-1 px-4 md:px-10 py-6 flex items-center justify-center">
            <p className="text-red-500 text-lg font-medium">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-row w-full">
      <Navbar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-52">
        <Header />
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-10 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Sales Pipeline Analytics
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Real-time dashboard tracking deal progression, values, and sales performance.
                </p>
              </div>
            </div>
            {/* KPI Widget Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* KPI 1 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block font-bold">Active Pipeline</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white block mt-0.5">
                    {formatCurrency(stats.totalPipeline)}
                  </span>
                </div>
              </div>
              {/* KPI 2 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block font-bold">Avg Deal Size</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white block mt-0.5">
                    {formatCurrency(stats.avgDealSize)}
                  </span>
                </div>
              </div>
              {/* KPI 3 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block font-bold">Active Deals</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white block mt-0.5">
                    {stats.openDealsCount}
                  </span>
                </div>
              </div>
              {/* KPI 4 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block font-bold">Win Rate</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white block mt-0.5">
                    {stats.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Pipeline Funnel Value & Volume */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pipeline Value by Stage ($)</h2>
                </div>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stageChartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis 
                        tick={{ fill: '#9ca3af', fontSize: 10 }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(tick) => `$${tick / 1000}k`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [formatCurrency(Number(value)), 'Total Pipeline']}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Bar dataKey="Value" radius={[4, 4, 0, 0]}>
                        {stageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Chart 2: Product Share Distribution */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Distribution by Product</h2>
                </div>
                {productChartData.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No products data available
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="w-full sm:w-1/2 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {productChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend list */}
                    <div className="w-full sm:w-1/2 flex flex-col gap-2.5">
                      {productChartData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3.5 h-3.5 rounded"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">{item.name}</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AnalyticsDashboard;