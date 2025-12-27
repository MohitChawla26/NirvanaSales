import { ArrowLeft, DollarSign, TrendingUp, Clock, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTotalRevenue, getTopSeller, getRecentTransactions, SaleWithProduct } from '../services/api';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topSeller, setTopSeller] = useState<{ item_name: string; total_sales: number } | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<SaleWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      alert('Incorrect password');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [revenue, seller, transactions] = await Promise.all([
        getTotalRevenue(),
        getTopSeller(),
        getRecentTransactions(),
      ]);
      setTotalRevenue(Number(revenue) || 0); // Safety conversion
      setTopSeller(seller);
      setRecentTransactions(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4B2C5E] to-[#6B4C7E] p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <button
            onClick={onBack}
            className="bg-[#FFFDF5] p-3 rounded-xl hover:bg-[#FFD700] transition-colors shadow-lg mb-6"
          >
            <ArrowLeft className="w-6 h-6 text-[#4B2C5E]" />
          </button>

          <div className="bg-[#FFFDF5] rounded-2xl p-8 shadow-xl">
            <div className="flex justify-center mb-6">
              <Lock className="w-16 h-16 text-[#4B2C5E]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4B2C5E] text-center mb-6">
              Admin Access
            </h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-4 rounded-xl border-2 border-[#4B2C5E] text-[#4B2C5E] text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#FFD700] mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#4B2C5E] to-[#6B4C7E] text-[#FFFDF5] py-4 rounded-xl font-bold text-lg hover:from-[#6B4C7E] hover:to-[#4B2C5E] transition-all shadow-lg active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B2C5E] to-[#6B4C7E] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-[#FFFDF5] p-3 rounded-xl hover:bg-[#FFD700] transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-[#4B2C5E]" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#FFFDF5]">Admin Dashboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#FFFDF5] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  
                  <h3 className="text-white text-lg font-medium">Total Revenue</h3>
                </div>
                <p className="text-white text-4xl font-bold">₹{Number(totalRevenue).toFixed(2)}</p>
              </div>

              <div className="bg-gradient-to-br from-[#FFD700] to-orange-400 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-white" />
                  <h3 className="text-white text-lg font-medium">Top Seller</h3>
                </div>
                <p className="text-white text-2xl font-bold">
                  {topSeller ? topSeller.item_name : 'No sales yet'}
                </p>
                {topSeller && (
                  <p className="text-white text-lg mt-1">
                    {topSeller.total_sales} sales
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#FFFDF5] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#4B2C5E]" />
                <h2 className="text-2xl font-bold text-[#4B2C5E]">Recent Transactions</h2>
              </div>

              {recentTransactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.sale_id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-[#4B2C5E] text-lg">
                          {transaction.item_name || 'Unknown Item'}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {transaction.category} • Qty: {transaction.quantity}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(transaction.sale_time)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#FFD700]">
                          ₹{Number(transaction.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}