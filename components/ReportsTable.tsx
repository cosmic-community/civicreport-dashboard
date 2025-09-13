'use client';

import { useState } from 'react';
import type { IssueReport, Department, ReportCategory } from '@/types';
import { formatDate, getStatusBadgeColor, getPriorityBadgeColor, truncateText } from '@/lib/utils';
import { MapPin, Calendar, User, Building2, Eye } from 'lucide-react';

interface ReportsTableProps {
  reports: IssueReport[];
  departments: Department[];
  categories: ReportCategory[];
}

export default function ReportsTable({ reports, departments, categories }: ReportsTableProps) {
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(null);

  if (reports.length === 0) {
    return (
      <div className="dashboard-card text-center py-12">
        <p className="text-gray-500">No reports found</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {truncateText(report.metadata?.description, 60)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {report.metadata?.category?.metadata?.icon || '📍'}
                    </span>
                    <span className="text-sm text-gray-900">
                      {report.metadata?.category?.metadata?.name || 'Uncategorized'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-[150px]">
                      {report.metadata?.location_address || 'No location'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(report.metadata?.status?.value)}`}>
                    {report.metadata?.status?.value || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeColor(report.metadata?.priority?.value)}`}>
                    {report.metadata?.priority?.value || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>
                      {report.metadata?.assigned_department?.metadata?.name || 'Unassigned'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(report.metadata?.reported_date)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}