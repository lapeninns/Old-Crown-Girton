import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const alert = await request.json();
    
    // Log the alert for now - in production you might send to Slack, PagerDuty, etc.
    console.log('Alert received:', {
      timestamp: new Date().toISOString(),
      alert
    });
    
    // In production, you could integrate with alerting services here:
    // - Send to Slack webhook
    // - Send to PagerDuty
    // - Send email notifications
    // - Store in database for alert history
    
    return NextResponse.json({ 
      success: true, 
      message: 'Alert processed successfully' 
    });
  } catch (error) {
    console.error('Error processing alert:', error);
    return NextResponse.json(
      { error: 'Failed to process alert' },
      { status: 500 }
    );
  }
}