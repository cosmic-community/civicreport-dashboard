import type { IssueReport } from '@/types';
import { formatDate, getStatusBadgeColor, getPriorityBadgeColor, truncateText } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

interface RecentReportsProps {
  reports: IssueReport[];
}

export default function RecentReports({ reports }: RecentReportsProps) {
  // Sort by created_at and take the 5 most recent
  const recentReports = reports
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (recentReports.length === 0) {
    return (
      <div className="dashboard-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
        <p className="text-gray-500 text-center py-8">No reports found</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        <Link href="/reports" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentReports.map(report => (
          <div key={report.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {truncateText(report.metadata?.description, 100)}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {report.metadata?.location_address || 'No location'}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(report.metadata?.reported_date)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2 ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(report.metadata?.status?.value)}`}>
                  {report.metadata?.status?.value || 'Unknown'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeColor(report.metadata?.priority?.value)}`}>
                  {report.metadata?.priority?.value || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}