'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReportCategory, ReportSubmissionData } from '@/types';
import { MapPin, Camera, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportSubmissionFormProps {
  categories: ReportCategory[];
}

export default function ReportSubmissionForm({ categories }: ReportSubmissionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [publicId, setPublicId] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  const [formData, setFormData] = useState<Partial<ReportSubmissionData>>({
    title: '',
    description: '',
    category_id: '',
    location_address: '',
    reporter_name: '',
    reporter_email: '',
    reporter_phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setLocationError('Unable to get location: ' + error.message);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submissionData: ReportSubmissionData = {
        title: formData.title!,
        description: formData.description!,
        category_id: formData.category_id!,
        location_address: formData.location_address!,
        reporter_name: formData.reporter_name!,
        reporter_email: formData.reporter_email!,
        reporter_phone: formData.reporter_phone,
        gps_coordinates: location || undefined,
      };

      const response = await fetch('/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setPublicId(result.publicId);
        setFormData({
          title: '',
          description: '',
          category_id: '',
          location_address: '',
          reporter_name: '',
          reporter_email: '',
          reporter_phone: '',
        });
        setLocation(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted Successfully!</h2>
        <p className="text-gray-600 mb-4">
          Your report has been received and assigned tracking ID: <strong>{publicId}</strong>
        </p>
        <p className="text-gray-600 mb-6">
          You can use this ID to check the status of your report at any time.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push(`/track-report?id=${publicId}`)}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Track Your Report
          </button>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">There was an error submitting your report. Please try again.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Report Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Brief description of the issue"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
            Issue Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            value={formData.category_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.metadata?.icon} {category.metadata?.name || category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Please provide detailed information about the issue"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
            Location Address *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="location_address"
              name="location_address"
              required
              value={formData.location_address || ''}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Street address or landmark"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <MapPin className="h-4 w-4" />
            </button>
          </div>
          {location && (
            <p className="text-xs text-green-600 mt-1">
              GPS coordinates captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
          {locationError && (
            <p className="text-xs text-red-600 mt-1">{locationError}</p>
          )}
        </div>

        <div>
          <label htmlFor="reporter_name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="reporter_name"
            name="reporter_name"
            required
            value={formData.reporter_name || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Full name"
          />
        </div>

        <div>
          <label htmlFor="reporter_email" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email *
          </label>
          <input
            type="email"
            id="reporter_email"
            name="reporter_email"
            required
            value={formData.reporter_email || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="email@example.com"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="reporter_phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="reporter_phone"
            name="reporter_phone"
            value={formData.reporter_phone || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}