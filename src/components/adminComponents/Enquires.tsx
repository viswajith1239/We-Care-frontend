import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  Search,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Toaster, toast } from 'react-hot-toast';
import { deleteSubmissionByUser, getContact } from '../../service/adminService';


interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}


interface RawContact {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
  status?: 'pending' | 'in-progress' | 'resolved';
}



const ContactSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getContact()
        console.log("API Response:", response);

        let contacts = response?.data?.response || response?.data || [];
        let transformedContacts: ContactSubmission[] = [];

        if (Array.isArray(contacts)) {
          transformedContacts = contacts.map((contact: RawContact, index: number) => ({
            id: contact._id || contact.id || index.toString(),
            name: contact.name || contact.fullName || 'Unknown',
            email: contact.email || 'No email provided',
            phone: contact.phone || contact.phoneNumber || 'No phone provided',
            subject: contact.subject || 'General Inquiry',
            message: contact.message || 'No message provided',
            timestamp: contact.createdAt || contact.timestamp || new Date().toISOString(),
            status: contact.status || 'pending',
            createdAt: contact.createdAt || contact.timestamp || new Date().toISOString()
          }));
        }

        setSubmissions(transformedContacts);
        setFilteredSubmissions(transformedContacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        setError('Failed to fetch submissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter((submission: ContactSubmission) =>
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  const formatDate = (dateString: string | number | Date): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteSubmission = async (submissionId: string): Promise<void> => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });


      if (result.isConfirmed) {

        await deleteSubmissionByUser(submissionId)


        setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
        setFilteredSubmissions(prev => prev.filter(sub => sub.id !== submissionId));

        toast.success("Deleted successfully!");



      }


    } catch (error) {
      console.error('Error deleting submission:', error);


      toast.error('Failed to delete the submission. Please try again.');


    }
  };

  const exportData = (): void => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'],
      ...filteredSubmissions.map(sub => [
        sub.name,
        sub.email,
        sub.phone,
        sub.subject,
        sub.message.replace(/,/g, ';'),
        sub.status,
        formatDate(sub.timestamp)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact-submissions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div >
            <div >
              <h1 className="text-2xl font-bold text-gray-900 ">Contact Submissions</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and review contact form submissions</p>
            </div>
            <div className='flex justify-end'>
              <button
                onClick={exportData}
                className="flex items-center  px-4 py-2 bg-[#00897B] text-white rounded-lg bg-[#00897B]transition-colors -mt-10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredSubmissions.length} of {submissions.length} submissions
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No submissions found</p>
            </div>
          ) : (
            filteredSubmissions.map((submission: ContactSubmission) => (
              <div key={submission.id} className="hover:bg-gray-50 transition-colors p-6">
                <div className="flex flex-col md:flex-row">

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{submission.name}</span>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{submission.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{submission.phone}</span>
                      </div>
                    </div>

                    <div className='flex justify-between'>
                      <h3 className="font-medium text-gray-900">{submission.subject}</h3>

                    </div>
                    <div className='flex justify-start'>
                      <p className="text-gray-600 text-sm line-clamp-2">{submission.message}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Submitted on {formatDate(submission.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Full Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>


              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="flex items-center gap-2 justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900 ">{selectedSubmission.name}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{selectedSubmission.email}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{selectedSubmission.phone}</p>
                  </div>
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-gray-900 font-medium">{selectedSubmission.subject}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-white border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>


              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date & Time</label>
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-900">{formatDate(selectedSubmission.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submission ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedSubmission.id}</p>
                  </div>
                </div>
              </div>


              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Statistics</h3>
                <div className="flex flex-col sm:flex-row gap-4 text-center">
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-blue-600">{selectedSubmission.message.length}</p>
                    <p className="text-sm text-gray-600">Characters</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-blue-600">{selectedSubmission.message.split(' ').length}</p>
                    <p className="text-sm text-gray-600">Words</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-blue-600">{selectedSubmission.message.split('\n').length}</p>
                    <p className="text-sm text-gray-600">Lines</p>
                  </div>
                </div>
              </div>


              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const singleSubmissionCsv = [
                      ['Field', 'Value'],
                      ['Name', selectedSubmission.name],
                      ['Email', selectedSubmission.email],
                      ['Phone', selectedSubmission.phone],
                      ['Subject', selectedSubmission.subject],
                      ['Message', selectedSubmission.message.replace(/,/g, ';')],
                      ['Status', selectedSubmission.status],
                      ['Submitted At', formatDate(selectedSubmission.timestamp)]
                    ]
                      .map(row => row.join(','))
                      .join('\n');

                    const blob = new Blob([singleSubmissionCsv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `submission-${selectedSubmission.id}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-[#00897B] text-white rounded-lg transition-colors"
                >
                  Export This Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;