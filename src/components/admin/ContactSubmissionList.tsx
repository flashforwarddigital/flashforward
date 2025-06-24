import React from 'react';
import { ContactSubmission } from '../AdminPage'; // Assuming ContactSubmission interface is exported or moved later

interface ContactSubmissionListProps {
  contactSubmissions: ContactSubmission[];
}

const ContactSubmissionList: React.FC<ContactSubmissionListProps> = ({ contactSubmissions }) => {
  return (
    <div className="space-y-4">
      {contactSubmissions.map((submission) => (
        <div key={submission.id} className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-light tracking-tight">{submission.name}</h3>
              <p className="text-gray-400">{submission.email}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 block">
                {new Date(submission.timestamp).toLocaleString()}
              </span>
              {submission.status && (
                <span className={`text-sm px-2 py-1 rounded ${
                  submission.status === 'responded' ? 'bg-green-500/20 text-green-400' :
                  submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {submission.status}
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-300 mb-4">{submission.message}</p>
          {submission.responded_at && (
            <div className="text-sm text-gray-500 border-t border-gray-800 pt-4 mt-4">
              Responded on {new Date(submission.responded_at).toLocaleString()}
              {submission.response_by && ` by ${submission.response_by}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactSubmissionList; 