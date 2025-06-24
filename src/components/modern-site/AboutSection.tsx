import React from 'react';
import { typography, spacing, colors } from '../../theme/theme';

interface AboutSectionProps {
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ className = "" }) => {
  return (
    <section id="about" className={`py-16 ${typography.tracking.tight} bg-black/50 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <div className={`${spacing.container.maxWidth.md} mx-auto space-y-12`}>
          <p className={`${typography.fontSize['2xl']} leading-relaxed ${colors.text.white} ${typography.tracking.tight} text-center`}>
            let's be real — attention spans are at an all-time low, and making an impact online has never been harder. you don't just need a website. you don't just need content. you need something <span style={{ color: colors.primary.pink }}>impossible to ignore</span>.
          </p>

          <p className={`${typography.fontSize['2xl']} leading-relaxed ${colors.text.white} ${typography.tracking.tight} text-center`}>
            that's where <span style={{ color: colors.primary.blue }}>flash forward</span> comes in.
          </p>

          <p className={`${typography.fontSize['2xl']} leading-relaxed ${colors.text.white} ${typography.tracking.tight} text-center`}>
            we specialise in creating custom-tailored digital experiences that don't just grab attention — they <span style={{ color: colors.primary.yellow }}>hold it hostage</span>. whether it's web design & development, branding, ai automation, or content creation, we make sure you <span style={{ color: colors.primary.pink }}>stand out</span> in a sea of sameness.
          </p>

          <p className={`${typography.fontSize['2xl']} leading-relaxed ${colors.text.white} ${typography.tracking.tight} text-center`}>
            ready to stand out, capture attention and convert them into customers? then get in touch with us and let the <span style={{ color: colors.primary.green }}>magic begin</span>.
          </p>
        </div>
      </div>
    </section>
  );
}; 