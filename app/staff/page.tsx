import { getStaffMembers, getDepartments } from '@/lib/cosmic';
import StaffTable from '@/components/StaffTable';
import { Users } from 'lucide-react';

export default async function StaffPage() {
  const [staff, departments] = await Promise.all([
    getStaffMembers(),
    getDepartments(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Members</h1>
        <p className="text-gray-600 mt-2">Manage municipal staff and assignments</p>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No staff members found</p>
        </div>
      ) : (
        <StaffTable staff={staff} departments={departments} />
      )}
    </div>
  );
}