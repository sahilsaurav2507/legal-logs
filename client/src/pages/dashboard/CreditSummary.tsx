import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Coins,
  TrendingUp,
  Heart,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  IndianRupee,
  Eye,
} from 'lucide-react';
import { creditApi, CreditStatistics } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface CreditSummaryProps {
  className?: string;
  showFullDashboardLink?: boolean;
}

const CreditSummary: React.FC<CreditSummaryProps> = ({ 
  className, 
  showFullDashboardLink = true 
}) => {
  const [creditStats, setCreditStats] = useState<CreditStatistics | null>(null);
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

      const statsResponse = await creditApi.getStatistics();
      setCreditStats(statsResponse);
    } catch (error) {
      console.error('Error fetching credit data:', error);
      toast({
        title: "Error",
        description: "Failed to load credit information.",
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

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!creditStats) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <Coins className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Unable to load credit information</p>
        <Button onClick={() => fetchCreditData()} size="sm" className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lawvriksh-navy/10 border border-lawvriksh-navy/20">
            <Wallet className="h-5 w-5 text-lawvriksh-navy" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-lawvriksh-navy legal-heading">
              Credit Earnings
            </h3>
            <p className="text-sm text-gray-600">₹10 per like received</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchCreditData(true)}
            disabled={isRefreshing}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          {showFullDashboardLink && (
            <Button asChild variant="outline" size="sm" className="border-lawvriksh-navy/30 hover:border-lawvriksh-navy/50">
              <Link to="/dashboard/credits">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Credit Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Balance */}
        <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                <IndianRupee className="h-4 w-4 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs">
                Balance
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-green-700 mb-1">Current Balance</p>
              <p className="text-xl font-bold text-green-800">
                {formatCurrency(creditStats.statistics.current_balance)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Earned
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-700 mb-1">Total Earned</p>
              <p className="text-xl font-bold text-blue-800">
                {formatCurrency(creditStats.statistics.total_earned)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Likes Received */}
        <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-100 border border-purple-200">
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs">
                Engagement
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-purple-700 mb-1">Likes Received</p>
              <p className="text-xl font-bold text-purple-800">
                {creditStats.statistics.likes_received}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="border border-lawvriksh-navy/20 bg-gradient-to-r from-lawvriksh-navy/5 to-lawvriksh-gold/5">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Net Engagement</p>
              <p className="text-lg font-bold text-lawvriksh-navy">
                {creditStats.statistics.likes_received - creditStats.statistics.likes_removed}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Transactions</p>
              <p className="text-lg font-bold text-lawvriksh-navy">
                {creditStats.statistics.total_transactions}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Avg per Like</p>
              <p className="text-lg font-bold text-lawvriksh-navy">₹10.00</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Success Rate</p>
              <p className="text-lg font-bold text-lawvriksh-navy">
                {creditStats.statistics.likes_received > 0 
                  ? `${(((creditStats.statistics.likes_received - creditStats.statistics.likes_removed) / creditStats.statistics.likes_received) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earning Tip */}
      <div className="bg-gradient-to-r from-lawvriksh-gold/10 to-lawvriksh-navy/10 border border-lawvriksh-gold/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-lawvriksh-gold/20 border border-lawvriksh-gold/40">
            <Coins className="h-4 w-4 text-lawvriksh-navy" />
          </div>
          <div>
            <h4 className="font-semibold text-lawvriksh-navy text-sm mb-1">
              💡 Earning Tip
            </h4>
            <p className="text-xs text-gray-700">
              Create engaging content to earn more likes! Each like on your posts earns you ₹10. 
              Focus on quality legal insights and helpful information to maximize your earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSummary;
