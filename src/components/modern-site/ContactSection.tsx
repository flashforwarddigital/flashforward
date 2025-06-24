import React, { useState } from 'react';
import { colors, typography, spacing, transitions, effects } from '../../theme/theme';
import { supabase } from '../../lib/supabase';
import { posthog } from '../../lib/posthog';

interface ContactSectionProps {
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ className = "" }) => {
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
      posthog.capture('contact_form_submitted', {
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
      posthog.capture('contact_form_success');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (err) {
      setStatus('error');
      setErrorMessage('Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
      
      // Track error
      posthog.capture('contact_form_error', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className={`${spacing.section.padding} ${typography.tracking.tight} bg-black/30 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <h2 className={`${typography.fontSize['4xl']} sm:text-5xl lg:text-[64px] ${colors.text.white} text-center mb-12 ${typography.tracking.tighter} font-bold`}>
          contact us
        </h2>
        <div className={`${spacing.container.maxWidth.sm} mx-auto`}>
          {status === 'success' ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-lg text-center">
              <h3 className="text-xl font-light mb-2">Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded">
                  {errorMessage}
                </div>
              )}
              
              <div>
                <label className={`block ${colors.text.white} mb-2 ${typography.fontFamily.light} ${typography.tracking.tight}`}>
                  name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 ${colors.background.card} border ${colors.border.dark} rounded ${colors.text.white} ${effects.focus.outline} focus:border-primary-blue ${transitions.colors} ${typography.tracking.tight}`}
                />
              </div>
              <div>
                <label className={`block ${colors.text.white} mb-2 ${typography.fontFamily.light} ${typography.tracking.tight}`}>
                  email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 ${colors.background.card} border ${colors.border.dark} rounded ${colors.text.white} ${effects.focus.outline} focus:border-primary-blue ${transitions.colors} ${typography.tracking.tight}`}
                />
              </div>
              <div>
                <label className={`block ${colors.text.white} mb-2 ${typography.fontFamily.light} ${typography.tracking.tight}`}>
                  message
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 ${colors.background.card} border ${colors.border.dark} rounded ${colors.text.white} ${effects.focus.outline} focus:border-primary-blue ${transitions.colors} h-32 ${typography.tracking.tight}`}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full bg-primary-blue text-black py-3 rounded ${typography.fontFamily.light} ${effects.hover.opacity} ${transitions.colors} ${typography.tracking.tight} disabled:opacity-50`}
                onClick={() => posthog.capture('contact_form_submit_clicked')}
              >
                {status === 'submitting' ? 'sending...' : 'send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};