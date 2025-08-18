'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

export const Analytics = ({ applications = [] }) => {
  const statusData = [
    { name: 'Applied', value: applications.filter(app => app.status === 'applied').length, color: '#6366F1' },
    { name: 'Interview', value: applications.filter(app => app.status === 'interview').length, color: '#F59E0B' },
    { name: 'Offer', value: applications.filter(app => app.status === 'offer').length, color: '#10B981' },
    { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length, color: '#EF4444' }
  ];

  const roleData = applications.reduce((acc, app) => {
    const existing = acc.find(item => item.name === app.role);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: app.role, count: 1 });
    }
    return acc;
  }, []);

  const avgExperience = applications.length > 0 
    ? (applications.reduce((sum, app) => sum + app.experience_years, 0) / applications.length).toFixed(1)
    : '0';

  const conversionRate = applications.length > 0 
    ? ((applications.filter(app => app.status === 'offer').length / applications.length) * 100).toFixed(1)
    : '0';

  // Better Y-axis scaling - ensures minimum height and better visual distribution
  const maxCount = roleData.length > 0 ? Math.max(...roleData.map(item => item.count)) : 1;
  const yAxisMax = Math.max(maxCount + 2, 5); // Increased minimum to 5 for better visual spacing

  const stats = [
    {
      title: 'Total Candidates',
      value: applications.length,
      icon: Users,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-600'
    },
    {
      title: 'Avg Experience',
      value: `${avgExperience}y`,
      icon: Clock,
      gradient: 'from-emerald-500 to-green-600',
      bg: 'from-emerald-50 to-green-50',
      iconBg: 'bg-gradient-to-r from-emerald-500 to-green-600'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-600',
      bg: 'from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-r from-amber-500 to-orange-600'
    },
    {
      title: 'Offers Made',
      value: applications.filter(app => app.status === 'offer').length,
      icon: Award,
      gradient: 'from-purple-500 to-violet-600',
      bg: 'from-purple-50 to-violet-50',
      iconBg: 'bg-gradient-to-r from-purple-500 to-violet-600'
    }
  ];

  // Custom label function for pie chart - responsive
  const renderCustomLabel = ({ name, value, percent }) => {
    // Don't show labels on very small screens or when value is 0
    if (typeof window !== 'undefined' && window.innerWidth < 480) return '';
    if (value === 0) return '';
    
    // Show shorter labels on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return value > 0 ? `${value}` : '';
    }
    
    return value > 0 ? `${name}: ${value}` : '';
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-blue-600 font-medium">
            Candidates: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p style={{ color: data.payload.color }} className="font-medium">
            Count: {data.value}
          </p>
          <p className="text-gray-600 text-sm">
            {((data.value / applications.length) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 ">
      {/* Enhanced Stats Cards - Fully responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
              <div className="flex items-center justify-between">
                <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <IconComponent className="text-white" size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Charts Section - Improved responsive grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Pipeline Status Chart - Enhanced mobile experience */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <TrendingUp className="text-white" size={18} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Pipeline Status</h3>
          </div>
          
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  innerRadius="40%"
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                  className="text-xs sm:text-sm font-medium"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced Legend - Better mobile layout */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 min-w-0">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate block">
                    {entry.name}
                  </span>
                  <span className="text-xs text-gray-500 block sm:hidden">
                    {entry.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Candidates by Role Chart - SIGNIFICANTLY ENHANCED */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <Users className="text-white" size={18} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Candidates by Role</h3>
          </div>
          
          {/* INCREASED HEIGHT SIGNIFICANTLY */}
          <div className="w-full overflow-hidden" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={roleData} 
                margin={{ 
                  top: 30, 
                  right: 20, 
                  left: 10, 
                  bottom: typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 90
                }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  strokeOpacity={0.6}
                />
                <XAxis 
                  dataKey="name" 
                  angle={typeof window !== 'undefined' && window.innerWidth < 640 ? -45 : -30} 
                  textAnchor="end" 
                  height={typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 110}
                  fontSize={typeof window !== 'undefined' && window.innerWidth < 640 ? 11 : 13}
                  stroke="#4B5563"
                  interval={0}
                  tick={{ 
                    fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 11 : 13,
                    fontWeight: 500
                  }}
                  axisLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                  tickLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                />
                <YAxis 
                  stroke="#4B5563"
                  domain={[0, yAxisMax]} // Use the calculated yAxisMax instead of dataMax
                  allowDecimals={false}
                  tick={{ 
                    fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 11 : 13,
                    fontWeight: 500
                  }}
                  tickCount={Math.min(yAxisMax + 1, 6)} // Better tick distribution
                  width={40}
                  axisLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                  tickLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]} // Slightly more rounded corners
                  className="hover:opacity-90 transition-all duration-200"
                  maxBarSize={typeof window !== 'undefined' && window.innerWidth < 640 ? 60 : 90} // Slightly wider bars
                  stroke="#fff"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};