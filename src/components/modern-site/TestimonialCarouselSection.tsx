import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { spacing, typography, colors } from '../../theme/theme';

interface Testimonial {
  quote: string;
  speaker: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "My website went from \'meh\' to \'WOW!\' faster than I can make coffee. I almost tried to hire myself based on the design alone.",
    speaker: "- A very caffeinated client",
  },
  {
    quote: "They didn't just build a website, they crafted a digital rockstar. My cat, Bartholomew, who usually only approves of cardboard boxes, is genuinely impressed.",
    speaker: "- Purrfectly satisfied customer and cat owner",
  },
  {
    quote: "Warning: Working with flash forward may cause extreme levels of online awesomeness, spontaneous high-fives, and uncontrollable urges to show off your website.",
    speaker: "- Someone who got way more than they bargained for (in the best possible way)",
  },
  {
    quote: "Since flash forward revamped my online presence, my competitors are now asking for my autograph and tips. I feel like a digital celebrity.",
    speaker: "- Feeling like a digital celebrity (and slightly overwhelmed by fame)",
  },
  {
    quote: "I told them I wanted something truly unique. They delivered. Now my website spontaneously wears tiny hats on Tuesdays. It's the little things.",
    speaker: "- Pleasantly surprised client with a well-dressed website",
  },
  {
    quote: "Comunicación? Ex-cellent! They speak fluent internet, translating my jumbled thoughts into a stunning online reality. Highly recommend their linguistic and design skills.",
    speaker: "- Finally understood client (and possibly a secret agent)",
  },
  {
    quote: "My bounce rate is so low, I'm worried people are living on my site now. Send snacks!",
    speaker: "- Concerned but successful site owner",
  },
  {
    quote: "They added AI to my business, and now my coffee machine makes existential remarks. Worth it!",
    speaker: "- Questioning reality, but boostrapping",
  },
  {
    quote: "Before flash forward, my brand was confused. Was I a fierce tiger or a fluffy bunny? Now I'm a fluffy bunny with sharp, strategic fangs.",
    speaker: "- Embracing the hybrid brand identity",
  },
  {
    quote: "My online ads are so good, I accidentally clicked on them myself and bought my own product.",
    speaker: "- Self-customer (best kind)",
  },
  {
    quote: "I asked for 'more engagement' on social media. Now I get daily fan mail from squirrels. Progress!",
    speaker: "- Befriending local wildlife, digitally",
  },
  {
    quote: "My website's loading speed is so fast, it arrived yesterday.",
    speaker: "- Living in the future, online",
  },
];

interface TestimonialCarouselSectionProps {
  className?: string;
}

export const TestimonialCarouselSection: React.FC<TestimonialCarouselSectionProps> = ({ className = "" }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        // Calculate the total width of one set of testimonials
        const itemWidth = 400 + (16 * 2); // 400px width + mx-16 (32px total margin)
        const totalItemsWidth = testimonials.length * itemWidth;
        setContainerWidth(totalItemsWidth);
      }
    };

    handleResize(); // Calculate initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [testimonials.length]);

  return (
    <section className={`py-8 overflow-hidden ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <motion.div 
          ref={carouselRef}
          className="flex items-center"
          animate={{
            x: [0, -containerWidth],
          }}
          transition={{
            ease: 'linear',
            duration: 60, // Increased duration for slower movement
            repeat: Infinity,
          }}
          style={{ width: containerWidth > 0 ? containerWidth * 2 : 'auto' }}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div 
              key={index} 
              className="mx-16 inline-block text-center flex-shrink-0" 
              style={{ width: '350px' }} // Adjust width to encourage 2 lines for quote
            >
              <p className={`${typography.fontSize.lg} ${typography.fontFamily.light} ${colors.text.white} ${typography.tracking.tight} italic mb-2 leading-tight`}>
                "{testimonial.quote}"
              </p>
              <p className={`${typography.fontSize.sm} ${typography.fontFamily.light} ${colors.text.gray[400]} ${typography.tracking.tight}`}>
                {testimonial.speaker}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}; 