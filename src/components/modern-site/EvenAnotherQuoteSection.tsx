import React from 'react';
import { typography, spacing, colors } from '../../theme/theme';

interface EvenAnotherQuoteSectionProps {
  className?: string;
}

export const EvenAnotherQuoteSection: React.FC<EvenAnotherQuoteSectionProps> = ({ className = "" }) => {
  return (
    <div className={`py-12 ${className}`}> {/* Added vertical padding to match others */}
      <div className={`container mx-auto ${spacing.container.padding} text-center`}>
        <blockquote className={`${typography.fontSize['3xl']} italic ${typography.fontFamily.light} ${colors.text.white} ${typography.tracking.tight} max-w-3xl mx-auto`}>
          "Flash Forward's websites are so responsive, they started answering my questions before I even thought of them."
        </blockquote>
      </div>
    </div>
  );
}; 