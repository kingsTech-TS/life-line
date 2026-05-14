import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import Order from '@/models/Order';
import Project from '@/models/Project';
import FinancialSetting from '@/models/FinancialSetting';

export async function GET() {
  try {
    await dbConnect();

    // 1. Get Completed Donations
    const donations = await Donation.find({ status: 'completed' });
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

    // 2. Get Completed Shop Sales (Orders)
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalShopRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 3. Get Project Count
    const projectCount = await Project.countDocuments();

    // 4. Fetch Financial Settings (Allocations & Ethics)
    let allocationsSetting = await FinancialSetting.findOne({ key: 'fund_allocations' });
    let ethicsSetting = await FinancialSetting.findOne({ key: 'financial_ethics' });

    // Seed defaults if not found
    if (!allocationsSetting) {
      allocationsSetting = await FinancialSetting.create({
        key: 'fund_allocations',
        value: [
          { category: 'Healthcare', percentage: 60, icon: 'Activity', color: '#016AF9' },
          { category: 'Clean Water', percentage: 25, icon: 'Droplets', color: '#00D1FF' },
          { category: 'Education', percentage: 15, icon: 'BookOpen', color: '#8B5CF6' }
        ]
      });
    }

    if (!ethicsSetting) {
      ethicsSetting = await FinancialSetting.create({
        key: 'financial_ethics',
        value: [
          { title: "Audited Reports", description: "We undergo annual external audits to ensure our reporting is accurate and compliant with global standards.", icon: "ShieldCheck" },
          { title: "Zero Commissions", description: "Platform staff do not take commissions on donations. 100% of your gift is allocated to the mission.", icon: "Heart" },
          { title: "Direct Impact", description: "We work directly with community leaders to eliminate middlemen and ensure funds reach those in need.", icon: "Target" }
        ]
      });
    }

    // 5. Recent Transactions
    const recentTransactions = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('donorName amount createdAt donationType isAnonymous');

    return NextResponse.json({
      summary: {
        totalRevenue: totalDonations + totalShopRevenue,
        totalDonations,
        totalShopRevenue,
        projectCount,
        livesImpacted: Math.floor((totalDonations + totalShopRevenue) / 2500)
      },
      recentTransactions,
      allocations: allocationsSetting.value,
      ethics: ethicsSetting.value
    });
  } catch (error) {
    console.error('Finances API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 });
  }
}
