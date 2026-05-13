import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import Order from '@/models/Order';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();

    // 1. Get Completed Donations
    const donations = await Donation.find({ status: 'completed' });
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

    // 2. Get Completed Shop Sales (Orders)
    // Assuming status delivered/processing/shipped counts as valid revenue for transparency
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalShopRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 3. Get Project Count
    const projectCount = await Project.countDocuments();

    // 4. Monthly Trend (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Donation.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 5. Recent Transactions
    const recentTransactions = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('donorName amount createdAt donationType isAnonymous');

    // Allocation Mock (In a real app, this would be from a database of expenses)
    const allocations = [
      { category: 'Healthcare', percentage: 60, icon: 'Activity', color: '#016AF9' },
      { category: 'Clean Water', percentage: 25, icon: 'Droplets', color: '#00D1FF' },
      { category: 'Education', percentage: 15, icon: 'BookOpen', color: '#8B5CF6' }
    ];

    return NextResponse.json({
      summary: {
        totalRevenue: totalDonations + totalShopRevenue,
        totalDonations,
        totalShopRevenue,
        projectCount,
        livesImpacted: Math.floor((totalDonations + totalShopRevenue) / 2500) // Rough estimation: 1 impact per 2500 NGN
      },
      monthlyStats,
      recentTransactions,
      allocations
    });
  } catch (error) {
    console.error('Finances API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 });
  }
}
