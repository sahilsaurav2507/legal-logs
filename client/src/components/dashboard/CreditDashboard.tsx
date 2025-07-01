import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Heart,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  History,
  BarChart3,
  RefreshCw,
  IndianRupee,
} from 'lucide-react';
import { creditApi, CreditStatistics, CreditTransactionHistory } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

interface CreditDashboardProps {
  className?: string;
}

const CreditDashboard: React.FC<CreditDashboardProps> = ({ className }) => {
  const [creditStats, setCreditStats] = useState<CreditStatistics | null>(null);
  const [transactions, setTransactions] = useState<CreditTransactionHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchCreditData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [statsResponse, transactionsResponse] = await Promise.all([
        creditApi.getStatistics(),
        creditApi.getTransactions({ limit: 20, offset: 0 })
      ]);

      setCreditStats(statsResponse);
      setTransactions(transactionsResponse);
    } catch (error) {
      console.error('Error fetching credit data:', error);
      toast({
        title: "Error",
        description: "Failed to load credit information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'LIKE_RECEIVED':
        return <Heart className="h-4 w-4 text-green-600" />;
      case 'LIKE_REMOVED':
        return <Heart className="h-4 w-4 text-red-600" />;
      case 'AD_REVENUE':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'ENGAGEMENT_BONUS':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default:
        return <Coins className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) {
      return 'text-green-600';
    } else {
      return 'text-red-600';
    }
  };

  // Prepare chart data from transactions
  const getChartData = () => {
    if (!transactions?.transactions) return [];

    const dailyData: { [key: string]: { date: string; earned: number; spent: number; balance: number } } = {};
    let runningBalance = creditStats?.statistics.current_balance || 0;

    // Process transactions in reverse order to calculate running balance
    const sortedTransactions = [...transactions.transactions].reverse();
    
    sortedTransactions.forEach((transaction) => {
      const date = format(new Date(transaction.Created_At), 'MMM dd');
      
      if (!dailyData[date]) {
        dailyData[date] = { date, earned: 0, spent: 0, balance: runningBalance };
      }

      if (transaction.Amount > 0) {
        dailyData[date].earned += transaction.Amount;
      } else {
        dailyData[date].spent += Math.abs(transaction.Amount);
      }

      runningBalance -= transaction.Amount;
      dailyData[date].balance = runningBalance;
    });

    return Object.values(dailyData).reverse().slice(-7); // Last 7 days
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!creditStats) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load credit information</p>
        <Button onClick={() => fetchCreditData()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-lawvriksh-navy legal-heading">Credit Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your earnings from content engagement</p>
        </div>
        <Button
          onClick={() => fetchCreditData(true)}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="border-lawvriksh-navy/20 hover:border-lawvriksh-navy/40"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Credit Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance */}
        <Card className="border border-lawvriksh-navy/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-green-100 border border-green-200">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 border border-green-200">
                Current
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Current Balance</p>
              <p className="text-3xl font-bold text-green-800">
                {formatCurrency(creditStats.statistics.current_balance)}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Available for withdrawal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="border border-lawvriksh-navy/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-100 border border-blue-200">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Earned
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Earned</p>
              <p className="text-3xl font-bold text-blue-800">
                {formatCurrency(creditStats.statistics.total_earned)}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                From {creditStats.statistics.likes_received} likes received
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Stats */}
        <Card className="border border-lawvriksh-navy/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50 hover:border-purple-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-purple-100 border border-purple-200">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
                Engagement
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Total Likes</p>
              <p className="text-3xl font-bold text-purple-800">
                {creditStats.statistics.likes_received}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                {creditStats.statistics.total_transactions} total transactions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed view */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Earnings Chart */}
          {chartData.length > 0 && (
            <Card className="border border-lawvriksh-navy/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lawvriksh-navy legal-heading">Earnings Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '8px' 
                      }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earned" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                      name="Earned"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="spent" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.3}
                      name="Deducted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border border-lawvriksh-navy/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lawvriksh-navy legal-heading">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions?.transactions && transactions.transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.Transaction_ID}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-lawvriksh-navy/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                          {getTransactionIcon(transaction.Transaction_Type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.Transaction_Type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-md">
                            {transaction.Description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(transaction.Created_At), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(transaction.Transaction_Type, transaction.Amount)}`}>
                          {transaction.Amount > 0 ? '+' : ''}{formatCurrency(transaction.Amount)}
                        </p>
                        {transaction.content_title && (
                          <p className="text-xs text-gray-500 truncate max-w-32">
                            {transaction.content_title}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {transactions.total_count > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        Showing 10 of {transactions.total_count} transactions
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start creating content to earn credits from likes!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earning Rate */}
            <Card className="border border-lawvriksh-navy/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lawvriksh-navy legal-heading">Earning Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per Like</span>
                    <span className="font-bold text-lawvriksh-navy">₹10.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average per Day</span>
                    <span className="font-bold text-lawvriksh-navy">
                      {creditStats.statistics.total_transactions > 0
                        ? formatCurrency(creditStats.statistics.total_earned / Math.max(creditStats.statistics.total_transactions / 7, 1))
                        : '₹0.00'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-bold text-lawvriksh-navy">
                      {creditStats.statistics.likes_received > 0
                        ? `${((creditStats.statistics.total_earned / creditStats.statistics.likes_received) * 10).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border border-lawvriksh-navy/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lawvriksh-navy legal-heading">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Likes Received</span>
                    <span className="font-bold text-green-600">
                      +{creditStats.statistics.likes_received}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Likes Removed</span>
                    <span className="font-bold text-red-600">
                      -{creditStats.statistics.likes_removed}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Engagement</span>
                    <span className="font-bold text-lawvriksh-navy">
                      {creditStats.statistics.likes_received - creditStats.statistics.likes_removed}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Breakdown */}
          <Card className="border border-lawvriksh-navy/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lawvriksh-navy legal-heading">Credit Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <IndianRupee className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-800">
                    {formatCurrency(creditStats.statistics.total_earned)}
                  </p>
                  <p className="text-sm text-green-600">Total Earned</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-800">
                    {formatCurrency(creditStats.statistics.total_spent)}
                  </p>
                  <p className="text-sm text-red-600">Total Deducted</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Wallet className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(creditStats.statistics.current_balance)}
                  </p>
                  <p className="text-sm text-blue-600">Net Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreditDashboard;
