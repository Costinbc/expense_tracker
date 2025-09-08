import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import expenseService from '../services/expenseService';
import incomeService from '../services/incomeService';
import {
    BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Calendar, DollarSign, ArrowRight } from 'lucide-react';


const HomePage = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalExpenses: 0,
        totalIncome: 0,
        balance: 0,
        recentExpenses: [],
        recentIncomes: []
    });

    const unwrapPage = (resp) => resp?.data?.response?.data ?? resp?.response?.data ?? resp?.data ?? [];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [expensesResp, incomesResp] = await Promise.all([
                    expenseService.getPage(1, 5),
                    incomeService.getPage(1, 5)
                ]);

                const expenses = unwrapPage(expensesResp);
                const incomes = unwrapPage(incomesResp);

                const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
                const totalIncome = incomes.reduce((sum, i) => sum + (i.amount ?? 0), 0);

                setSummary({
                    totalExpenses,
                    totalIncome,
                    balance: totalIncome - totalExpenses,
                    recentExpenses: expenses,
                    recentIncomes: incomes
                });
            } catch (err) {
                console.error(err);
                addToast('Failed to load dashboard data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [addToast]);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const formatDate = (d) => new Date(d).toLocaleDateString();

    const pieData = [
        { name: 'Income', value: summary.totalIncome },
        { name: 'Expenses', value: summary.totalExpenses }
    ];

    const barData = [
        ...summary.recentExpenses.slice(0, 3).map(e => ({ name: e.description.slice(0, 10) + (e.description.length > 10 ? '…' : ''), amount: -e.amount, type: 'Expense' })),
        ...summary.recentIncomes.slice(0, 3).map(i => ({ name: i.description.slice(0, 10) + (i.description.length > 10 ? '…' : ''), amount: i.amount, type: 'Income' }))
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-100">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-primary-600 border-b-primary-300 border-l-primary-300 border-r-primary-300 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-neutral-600 font-medium">Loading your financial summary...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl mb-8 p-8 text-white shadow-lg transform transition-transform duration-300 hover:scale-[1.01]">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                    <p className="text-primary-100">Here's your financial overview</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center transition-colors duration-300 hover:bg-white/30">
                            <div className="bg-white/30 p-3 rounded-full mr-4">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-primary-100">Current Balance</p>
                                <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-success-300' : 'text-error-300'}`}>
                                    {formatCurrency(summary.balance)}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center transition-colors duration-300 hover:bg-white/30">
                            <div className="bg-white/30 p-3 rounded-full mr-4">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-primary-100">Total Income</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(summary.totalIncome)}</p>
                            </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center transition-colors duration-300 hover:bg-white/30">
                            <div className="bg-white/30 p-3 rounded-full mr-4">
                                <TrendingDown className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-primary-100">Total Expenses</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(summary.totalExpenses)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Recent Transactions</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(Math.abs(value))} />
                                <Bar dataKey="amount" name="Amount">
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#10B981' : '#EF4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Income vs. Expenses</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                        <h2 className="text-lg font-semibold text-neutral-800 flex items-center">
                            <TrendingDown className="h-5 w-5 text-error-500 mr-2" />
                            Recent Expenses
                        </h2>
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {summary.recentExpenses.length > 0 ? (
                            summary.recentExpenses.map(expense => (
                                <div key={expense.id} className="p-4 hover:bg-neutral-50 flex justify-between items-center transition-colors duration-200">
                                    <div className="flex items-center">
                                        <div className="bg-error-100 p-2 rounded-full mr-4">
                                            <DollarSign className="h-5 w-5 text-error-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-neutral-800">{expense.description}</h4>
                                            <div className="flex items-center text-sm text-neutral-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(expense.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-error-600 font-medium">
                                        -{formatCurrency(expense.amount)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-neutral-500">No recent expenses</div>
                        )}

                        {summary.recentExpenses.length > 0 && (
                            <div className="p-4 bg-neutral-50">
                                <a href="/expenses" className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-center">
                                    View all expenses <ArrowRight className="h-4 w-4 ml-1" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100">
                        <h2 className="text-lg font-semibold text-neutral-800 flex items-center">
                            <TrendingUp className="h-5 w-5 text-success-500 mr-2" />
                            Recent Income
                        </h2>
                    </div>
                    <div className="divide-y divide-neutral-100">
                        {summary.recentIncomes.length > 0 ? (
                            summary.recentIncomes.map(income => (
                                <div key={income.id} className="p-4 hover:bg-neutral-50 flex justify-between items-center transition-colors duration-200">
                                    <div className="flex items-center">
                                        <div className="bg-success-100 p-2 rounded-full mr-4">
                                            <DollarSign className="h-5 w-5 text-success-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-neutral-800">{income.description}</h4>
                                            <div className="flex items-center text-sm text-neutral-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(income.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-success-600 font-medium">
                                        +{formatCurrency(income.amount)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-neutral-500">No recent income</div>
                        )}

                        {summary.recentIncomes.length > 0 && (
                            <div className="p-4 bg-neutral-50">
                                <a href="/incomes" className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-center">
                                    View all income <ArrowRight className="h-4 w-4 ml-1" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;