'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { IssueReport } from '@/types';
import { formatDate, getStatusBadgeColor, getPriorityBadgeColor } from '@/lib/utils';
import { Search, MapPin, Calendar, User, Building2, AlertCircle } from 'lucide-react';

export default function ReportTracker() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams?.get('id') || '');
  const [email, setEmail] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'email'>('id');
  const [report, setReport] = useState<IssueReport | null>(null);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (trackingId && searchType === 'id') {
      handleSearch();
    }
  }, [trackingId]);

  const handleSearch = async () => {
    if (!trackingId.trim() && !email.trim()) {
      setError('Please enter a tracking ID or email address');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);
    setReports([]);

    try {
      const endpoint = searchType === 'id' 
        ? `/api/track-report?id=${encodeURIComponent(trackingId)}`
        : `/api/track-report?email=${encodeURIComponent(email)}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok) {
        if (searchType === 'id') {
          if (data.report) {
            setReport(data.report);
          } else {
            setError('No report found with this tracking ID');
          }
        } else {
          setReports(data.reports || []);
          if (data.reports.length === 0) {
            setError('No reports found for this email address');
          }
        }
      } else {
        setError(data.error || 'Failed to fetch report');
      }
    } catch (error) {
      console.error('Error tracking report:', error);
      setError('Failed to fetch report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderReportDetails = (reportData: IssueReport) => (
    <div key={reportData.id} className="bg-gray-50 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{reportData.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Tracking ID: <span className="font-mono">{reportData.metadata?.public_id}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadgeColor(reportData.metadata?.status?.value)}`}>
            {reportData.metadata?.status?.value || 'Unknown'}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityBadgeColor(reportData.metadata?.priority?.value)}`}>
            {reportData.metadata?.priority?.value || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{reportData.metadata?.location_address || 'No location provided'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">Reported: {formatDate(reportData.metadata?.reported_date)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">Category: {reportData.metadata?.category?.metadata?.name || 'Uncategorized'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Building2 className="h-4 w-4 mr-2" />
          <span className="text-sm">
            Department: {reportData.metadata?.assigned_department?.metadata?.name || 'Not assigned'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 text-sm">{reportData.metadata?.description}</p>
      </div>

      {reportData.metadata?.resolution_notes && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="font-medium text-green-900 mb-2">Resolution Notes</h4>
          <p className="text-green-800 text-sm">{reportData.metadata.resolution_notes}</p>
          {reportData.metadata?.resolution_date && (
            <p className="text-green-600 text-xs mt-2">
              Resolved: {formatDate(reportData.metadata.resolution_date)}
            </p>
          )}
        </div>
      )}

      {reportData.metadata?.photo_evidence && reportData.metadata.photo_evidence.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Photo Evidence</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {reportData.metadata.photo_evidence.map((photo, index) => (
              <img
                key={index}
                src={`${photo.imgix_url}?w=300&h=200&fit=crop&auto=format,compress`}
                alt={`Evidence photo ${index + 1}`}
                className="rounded-md object-cover w-full h-32"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="id"
              checked={searchType === 'id'}
              onChange={(e) => setSearchType(e.target.value as 'id' | 'email')}
              className="mr-2"
            />
            Search by Tracking ID
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="email"
              checked={searchType === 'email'}
              onChange={(e) => setSearchType(e.target.value as 'id' | 'email')}
              className="mr-2"
            />
            Search by Email
          </label>
        </div>

        <div className="flex space-x-2">
          {searchType === 'id' ? (
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., CR12345)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          ) : (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          )}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-2">Searching...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {report && renderReportDetails(report)}

      {reports.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Reports ({reports.length})
          </h3>
          {reports.map(renderReportDetails)}
        </div>
      )}
    </div>
  );
}