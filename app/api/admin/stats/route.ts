import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import Order from '@/models/Order';
import Project from '@/models/Project';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

async function getAdminFromToken(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 1. Core Stats
    const [totalDonations, totalDonationAmount, activeProjects, totalShopOrders] = await Promise.all([
      Donation.countDocuments({ status: 'completed', paymentSource: { $ne: 'shop' } }),
      Donation.aggregate([
        { $match: { status: 'completed', paymentSource: { $ne: 'shop' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Project.countDocuments({ status: 'active' }),
      Order.countDocuments({ status: { $ne: 'cancelled' } })
    ]);

    // 2. Recent Activity
    const recentDonations = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentOrders = await Order.find({ status: { $ne: 'cancelled' } })
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [
      ...recentDonations.map(d => ({
        name: d.donorName,
        action: 'donated',
        amount: `₦${d.amount.toLocaleString()}`,
        time: d.createdAt,
        initial: d.donorName.substring(0, 2).toUpperCase(),
        type: 'donation'
      })),
      ...recentOrders.map(o => ({
        name: o.customerName,
        action: 'purchased',
        item: `Order #${o.paymentReference.substring(0, 5)}`,
        time: o.createdAt,
        initial: o.customerName.substring(0, 2).toUpperCase(),
        type: 'purchase'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

    // 3. Impact Progress
    const projects = await Project.find({ status: 'active' }).limit(4);
    const impactProgress = projects.map(p => ({
      title: p.title,
      progress: Math.min(100, Math.round((p.currentAmount / p.goalAmount) * 100)),
      color: p.currentAmount > p.goalAmount * 0.8 ? "bg-emerald-500" : p.currentAmount > p.goalAmount * 0.5 ? "bg-blue-500" : "bg-rose-500"
    }));

    return NextResponse.json({
      stats: {
        totalDonations,
        totalAmount: totalDonationAmount[0]?.total || 0,
        activeProjects,
        totalShopOrders,
      },
      activities,
      impactProgress
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
