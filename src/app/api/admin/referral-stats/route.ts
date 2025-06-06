import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

interface Transaction {
  referral_code: string | null;
  amount: number;
  currency: string;
}

interface ReferralStat {
  referral_code: string;
  total_transactions: number;
  total_revenue: number;
  currency: string;
}

export async function GET(request: Request) {
  try {
    // Fetch all transactions with referral codes
    const { data: transactions, error } = await supabaseAdmin
      .from('subscription_transactions')
      .select('referral_code, amount, currency');
      
    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json(
        { error: "Failed to fetch referral statistics" },
        { status: 500 }
      );
    }
    
    // Process the data manually
    const referralMap = new Map<string, ReferralStat>();
    
    transactions.forEach((transaction: Transaction) => {
      const key = transaction.referral_code || 'direct';
      
      if (!referralMap.has(key)) {
        referralMap.set(key, { 
          referral_code: key,
          total_transactions: 0,
          total_revenue: 0,
          currency: transaction.currency || 'USD'
        });
      }
      
      const stats = referralMap.get(key)!;
      stats.total_transactions += 1;
      stats.total_revenue += Number(transaction.amount) || 0;
    });
    
    // Convert map to array and sort by revenue
    const stats = Array.from(referralMap.values())
      .sort((a, b) => b.total_revenue - a.total_revenue);
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error in referral stats endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 