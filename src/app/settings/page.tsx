"use client"
import Navbar from '@/components/Sidebar'
import Header from '@/components/Navbar'
import React, { useState } from 'react'
import { 
  Settings, 
  Layers, 
  DollarSign, 
  Eye, 
  Bell, 
  Shield, 
  Save,
  Check
} from 'lucide-react'

function SettingsPage() {
  const [currency, setCurrency] = useState("USD");
  const [defaultView, setDefaultView] = useState("table");
  const [stages, setStages] = useState([
    { name: "Lead Generated", active: true },
    { name: "Contacted", active: true },
    { name: "Application Submitted", active: true },
    { name: "Application Under Review", active: true },
    { name: "Deal Finalized", active: true },
    { name: "Payment Confirmed", active: true },
    { name: "Completed", active: true },
    { name: "Lost", active: true }
  ]);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const toggleStage = (index: number) => {
    // Keep at least 2 stages active
    const activeCount = stages.filter(s => s.active).length;
    if (stages[index].active && activeCount <= 2) {
      alert("At least 2 stages must remain active in the pipeline.");
      return;
    }
    const updated = [...stages];
    updated[index].active = !updated[index].active;
    setStages(updated);
  };

  const handleSave = () => {
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-row w-full">
      {/* Sidebar */}
      <Navbar />
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-52">
        <Header />
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-10 py-6 overflow-y-auto text-gray-900 dark:text-gray-100">
          <div className="max-w-4xl mx-auto space-y-8 relative">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">System Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your workspace pipeline preferences and general CRM properties.</p>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all text-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
            {/* Floating Save Success Toast */}
            {showSavedToast && (
              <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce">
                <Check className="w-4 h-4" />
                <span className="text-sm font-semibold">Settings saved successfully!</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Nav (mock list) */}
              <div className="md:col-span-1 space-y-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                  <nav className="flex flex-col">
                    <button className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/30 text-blue-600 dark:text-blue-400 font-bold border-l-4 border-blue-600 text-left text-sm">
                      <Settings className="w-4 h-4" />
                      General Configuration
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-left text-sm border-l-4 border-transparent transition-colors">
                      <Eye className="w-4 h-4" />
                      Layout & Preferences
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-left text-sm border-l-4 border-transparent transition-colors">
                      <Bell className="w-4 h-4" />
                      Notification Alerts
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/20 text-left text-sm border-l-4 border-transparent transition-colors">
                      <Shield className="w-4 h-4" />
                      Security & API Keys
                    </button>
                  </nav>
                </div>
              </div>
              {/* Right Side Settings Panels */}
              <div className="md:col-span-2 space-y-6">
                {/* Card 1: Pipeline Configuration */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-500" />
                    Sales Pipeline Stages
                  </h3>
                  <p className="text-xs text-gray-400">Enable or disable pipeline columns displayed inside the Kanban board view. Active stages are indicated in green.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {stages.map((stage, index) => (
                      <button
                        key={stage.name}
                        onClick={() => toggleStage(index)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all text-left font-medium ${
                          stage.active 
                            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200' 
                            : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-400'
                        }`}
                      >
                        <span>{stage.name}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${stage.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                {/* Card 2: Currency & UI Preferences */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Workspace Currency & Defaults
                  </h3>
                  <div className="space-y-4 pt-1">
                    {/* Currency settings */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-sm font-semibold block">Default Currency</span>
                        <span className="text-xs text-gray-400 block mt-0.5">Select the currency symbol used across dashboard metrics and pipeline cards.</span>
                      </div>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-sm font-medium outline-none"
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                      </select>
                    </div>
                    {/* Views settings */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                      <div>
                        <span className="text-sm font-semibold block">Default View Layout</span>
                        <span className="text-xs text-gray-400 block mt-0.5">Select the view presented automatically on startup.</span>
                      </div>
                      <div className="flex gap-2 text-sm font-medium">
                        <button
                          onClick={() => setDefaultView("table")}
                          className={`px-3 py-1.5 rounded-lg border transition-all ${
                            defaultView === "table" 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          Table Layout
                        </button>
                        <button
                          onClick={() => setDefaultView("kanban")}
                          className={`px-3 py-1.5 rounded-lg border transition-all ${
                            defaultView === "kanban" 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          Kanban Board
                        </button>
                      </div>
                    </div>
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

export default SettingsPage;