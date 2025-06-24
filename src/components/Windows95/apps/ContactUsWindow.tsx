import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { posthog } from '../../../lib/posthog';

const ContactUsWindow: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Track form submission with PostHog
      posthog.capture('win95_contact_form_submitted', {
        name_provided: !!formData.name.trim(),
        email_provided: !!formData.email.trim(),
        message_length: formData.message.length
      });

      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Track successful submission
      posthog.capture('win95_contact_form_success');
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
      
      // Track error
      posthog.capture('win95_contact_form_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="win95-contact">
      <div className="win95-contact-header">
        <img src="/phone.png" alt="Contact" className="win95-contact-logo" />
        <h2 className="win95-contact-title">Contact Us</h2>
      </div>

      {status === 'success' ? (
        <div className="win95-contact-success">
          <p>Thank you for your message! We'll get back to you soon.</p>
          <button 
            className="win95-button"
            onClick={() => setStatus('idle')}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="win95-contact-form">
          <div className="win95-contact-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="win95-contact-input"
            />
          </div>

          <div className="win95-contact-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="win95-contact-input"
            />
          </div>

          <div className="win95-contact-field">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="win95-contact-textarea"
              rows={6}
            />
          </div>

          {status === 'error' && (
            <div className="win95-contact-error">
              {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="win95-button"
            disabled={status === 'submitting'}
            onClick={() => posthog.capture('win95_contact_form_submit_clicked')}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactUsWindow;