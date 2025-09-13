import { NextRequest, NextResponse } from 'next/server';
import { getReportByPublicId, getCitizenReports } from '@/lib/cosmic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    const email = searchParams.get('email');

    if (!trackingId && !email) {
      return NextResponse.json(
        { error: 'Either tracking ID or email must be provided' },
        { status: 400 }
      );
    }

    if (trackingId) {
      // Search by tracking ID
      const report = await getReportByPublicId(trackingId);
      return NextResponse.json({
        success: true,
        report
      });
    } else if (email) {
      // Search by email
      const reports = await getCitizenReports(email);
      return NextResponse.json({
        success: true,
        reports
      });
    }

    return NextResponse.json(
      { error: 'Invalid search parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in track-report API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}