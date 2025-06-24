import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { PageView, ClickEvent, VisitDuration } from '../AdminPage';
import { Clock, MousePointer, Eye, Calendar, ArrowUpRight } from 'lucide-react';

interface AnalyticsDashboardProps {
  pageViews: PageView[];
  clickEvents: ClickEvent[];
  visitDurations: VisitDuration[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  pageViews, 
  clickEvents, 
  visitDurations 
}) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('week');
  
  // Process data for charts
  const processPageViewData = () => {
    // Group page views by page
    const pageViewsByPage = pageViews.reduce((acc, view) => {
      const page = view.page;
      if (!acc[page]) acc[page] = 0;
      acc[page]++;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array for chart
    return Object.entries(pageViewsByPage).map(([page, count]) => ({
      page: page.length > 20 ? page.substring(0, 20) + '...' : page,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 10);
  };
  
  const processClickData = () => {
    // Group clicks by element
    const clicksByElement = clickEvents.reduce((acc, click) => {
      const element = click.element_text || click.element || click.element_id || 'Unknown';
      if (!acc[element]) acc[element] = 0;
      acc[element]++;
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array for chart
    return Object.entries(clicksByElement).map(([element, count]) => ({
      element: element.length > 20 ? element.substring(0, 20) + '...' : element,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 10);
  };
  
  const processDurationData = () => {
    // Group durations by page
    const durationsByPage = visitDurations.reduce((acc, duration) => {
      const page = duration.page;
      if (!acc[page]) {
        acc[page] = { totalDuration: 0, count: 0 };
      }
      acc[page].totalDuration += duration.duration;
      acc[page].count++;
      return acc;
    }, {} as Record<string, { totalDuration: number, count: number }>);
    
    // Calculate average duration per page
    return Object.entries(durationsByPage).map(([page, data]) => ({
      page: page.length > 20 ? page.substring(0, 20) + '...' : page,
      avgDuration: Math.round(data.totalDuration / data.count)
    })).sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 10);
  };
  
  const processTimeSeriesData = () => {
    // Filter data based on selected time range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'day':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    // Group data by day
    const filteredPageViews = pageViews.filter(view => new Date(view.timestamp) >= startDate);
    const filteredClickEvents = clickEvents.filter(click => new Date(click.timestamp) >= startDate);
    
    const dataByDay: Record<string, { date: string, views: number, clicks: number }> = {};
    
    // Process page views
    filteredPageViews.forEach(view => {
      const date = new Date(view.timestamp).toISOString().split('T')[0];
      if (!dataByDay[date]) {
        dataByDay[date] = { date, views: 0, clicks: 0 };
      }
      dataByDay[date].views++;
    });
    
    // Process clicks
    filteredClickEvents.forEach(click => {
      const date = new Date(click.timestamp).toISOString().split('T')[0];
      if (!dataByDay[date]) {
        dataByDay[date] = { date, views: 0, clicks: 0 };
      }
      dataByDay[date].clicks++;
    });
    
    // Convert to array and sort by date
    return Object.values(dataByDay).sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const calculateBounceRate = () => {
    const bounces = visitDurations.filter(duration => duration.is_bounce).length;
    return bounces / visitDurations.length * 100 || 0;
  };
  
  const calculateAverageSessionDuration = () => {
    if (visitDurations.length === 0) return 0;
    const totalDuration = visitDurations.reduce((acc, duration) => acc + duration.duration, 0);
    return totalDuration / visitDurations.length;
  };
  
  const pageViewData = processPageViewData();
  const clickData = processClickData();
  const durationData = processDurationData();
  const timeSeriesData = processTimeSeriesData();
  const bounceRate = calculateBounceRate();
  const avgSessionDuration = calculateAverageSessionDuration();
  
  // Calculate unique visitors (approximation based on session_id)
  const uniqueVisitors = new Set(pageViews.map(view => view.session_id)).size;
  
  // Calculate most active pages
  const pageViewsByPage = pageViews.reduce((acc, view) => {
    const page = view.page;
    if (!acc[page]) acc[page] = 0;
    acc[page]++;
    return acc;
  }, {} as Record<string, number>);
  
  const mostActivePage = Object.entries(pageViewsByPage)
    .sort((a, b) => b[1] - a[1])
    .map(([page, count]) => ({ page, count }))[0];
  
  // Calculate most clicked elements
  const clicksByElement = clickEvents.reduce((acc, click) => {
    const element = click.element_text || click.element || click.element_id || 'Unknown';
    if (!acc[element]) acc[element] = 0;
    acc[element]++;
    return acc;
  }, {} as Record<string, number>);
  
  const mostClickedElement = Object.entries(clicksByElement)
    .sort((a, b) => b[1] - a[1])
    .map(([element, count]) => ({ element, count }))[0];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light tracking-tight">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'day' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'week' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'month' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            30d
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'all' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Eye className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Page Views</h3>
              <p className="text-3xl font-light text-white">{pageViews.length}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>{uniqueVisitors} unique visitors</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <MousePointer className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Interactions</h3>
              <p className="text-3xl font-light text-white">{clickEvents.length}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>
              {mostClickedElement ? `Most clicked: ${mostClickedElement.element.substring(0, 15)}...` : 'No clicks recorded'}
            </span>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <Clock className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Avg. Session</h3>
              <p className="text-3xl font-light text-white">{Math.round(avgSessionDuration)}s</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>{bounceRate.toFixed(1)}% bounce rate</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <Calendar className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Active Page</h3>
              <p className="text-3xl font-light text-white">
                {mostActivePage ? mostActivePage.page.substring(0, 10) + '...' : 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>{mostActivePage ? `${mostActivePage.count} views` : 'No data'}</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Traffic Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="views" stroke="#0CF2A0" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="clicks" stroke="#FF1493" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Page Views by Page */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Top Pages</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pageViewData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="page" type="category" width={150} stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0CF2A0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Clicks by Element */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Most Clicked Elements</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clickData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="element" type="category" width={150} stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#FF1493" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Average Duration by Page */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Time Spent by Page (seconds)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={durationData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="page" type="category" width={150} stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="avgDuration" fill="#FFCC00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-light mb-4 tracking-tight">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-normal text-gray-400">Type</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Page</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Details</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {/* Combine and sort recent activities */}
              {[
                ...pageViews.map(view => ({ 
                  type: 'view', 
                  page: view.page, 
                  details: view.referrer ? `Referrer: ${view.referrer}` : 'Direct visit',
                  timestamp: view.timestamp
                })),
                ...clickEvents.map(click => ({ 
                  type: 'click', 
                  page: click.page, 
                  details: click.element_text || click.element || click.element_id || 'Unknown element',
                  timestamp: click.timestamp
                }))
              ]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((activity, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        activity.type === 'view' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {activity.type === 'view' ? 'Page View' : 'Click'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{activity.page}</td>
                    <td className="py-3 px-4 text-gray-400">{activity.details}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;