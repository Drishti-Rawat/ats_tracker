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

  // Calculate max count for better Y-axis scaling
  const maxCount = roleData.length > 0 ? Math.max(...roleData.map(item => item.count)) : 1;
  const yAxisMax = Math.max(maxCount + 1, 3); // Ensure minimum range for better visualization

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

  return (
   
      <div className="max-w-7xl mx-auto space-y-8">
       

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Pipeline Status Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pipeline Status</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidates by Role Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Candidates by Role</h3>
            </div>
            
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={roleData} 
                margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                barCategoryGap="10%"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  fontSize={12}
                  stroke="#6B7280"
                  interval={0}
                />
                <YAxis 
                  stroke="#6B7280"
                  domain={[0, 'dataMax + 0.5']}
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  tickCount={4}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  className="hover:opacity-80 transition-opacity duration-200"
                  maxBarSize={60}
                  minPointSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

       
      </div>

  );
};