import type { IssueReport, Department, StaffMember, ReportCategory } from '@/types';
import { FileText, AlertCircle, CheckCircle, Users } from 'lucide-react';

interface DashboardStatsProps {
  reports: IssueReport[];
  departments: Department[];
  staff: StaffMember[];
  categories: ReportCategory[];
}

export default function DashboardStats({ reports, departments, staff, categories }: DashboardStatsProps) {
  const newReports = reports.filter(r => r.metadata?.status?.value === 'New').length;
  const inProgressReports = reports.filter(r => r.metadata?.status?.value === 'In Progress').length;
  const resolvedReports = reports.filter(r => r.metadata?.status?.value === 'Resolved').length;
  const activeStaff = staff.filter(s => s.metadata?.active).length;

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'New Reports',
      value: newReports,
      icon: AlertCircle,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      label: 'In Progress',
      value: inProgressReports,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Resolved',
      value: resolvedReports,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      label: 'Active Staff',
      value: activeStaff,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}