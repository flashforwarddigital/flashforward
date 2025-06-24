import React from 'react';
import { typography, spacing, colors } from '../../theme/theme';

interface QuoteSectionProps {
  className?: string;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ className = "" }) => {
  return (
    <div className={`py-12 ${className}`}> {/* Added vertical padding */}
      <div className={`container mx-auto ${spacing.container.padding} text-center`}>
        <blockquote className={`${typography.fontSize['3xl']} italic ${typography.fontFamily.light} ${colors.text.white} ${typography.tracking.tight} max-w-3xl mx-auto`}>
          "We don't just build websites; we craft digital playgrounds for ideas to go wild. Caution: may cause excessive awesomeness."
        </blockquote>
      </div>
    </div>
  );
}; 