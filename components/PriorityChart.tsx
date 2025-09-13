import type { IssueReport } from '@/types';
import { getPriorityColor } from '@/lib/utils';

interface PriorityChartProps {
  reports: IssueReport[];
}

export default function PriorityChart({ reports }: PriorityChartProps) {
  const priorityCounts = {
    'Urgent': 0,
    'High': 0,
    'Medium': 0,
    'Low': 0,
  };

  reports.forEach(report => {
    const priority = report.metadata?.priority?.value;
    if (priority && priority in priorityCounts) {
      priorityCounts[priority as keyof typeof priorityCounts]++;
    }
  });

  const total = Object.values(priorityCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h2>
      
      {total === 0 ? (
        <p className="text-gray-500 text-center py-4">No reports to display</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(priorityCounts).map(([priority, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            return (
              <div key={priority}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{priority}</span>
                  <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPriorityColor(priority as any)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}