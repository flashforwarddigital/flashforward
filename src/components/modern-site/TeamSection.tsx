import React from 'react';
import { motion } from 'framer-motion';
import { colors, typography, spacing, transitions, effects } from '../../theme/theme';

interface TeamSectionProps {
  className?: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Nick Mitreski",
    role: "Founder & Supreme Overlord",
    image: "/1 Nick.png",
    color: colors.primary.blue
  },
  {
    name: "George Gendy",
    role: "Professional Coffee Consumer",
    image: "/2 George.png",
    color: colors.primary.yellow
  },
  {
    name: "Alex Chen",
    role: "Chief of \"Let AI Handle It\"",
    image: "/3 Alex.png",
    color: colors.primary.pink
  },
  {
    name: "Sarah Michaels",
    role: "Head of Lights, Camera, Panic",
    image: "/4 Sarah.png",
    color: colors.primary.green
  },
  {
    name: "David Tucker",
    role: "Brand Stylist & Creative Therapist",
    image: "/5 David.png",
    color: colors.primary.purple
  },
  {
    name: "Cooper",
    role: "Emotional Support",
    image: "/6 Cooper.png",
    color: colors.primary.orange
  }
];

export const TeamSection: React.FC<TeamSectionProps> = ({ className = "" }) => {
  return (
    <section id="team" className={`${spacing.section.padding} ${typography.tracking.tight} bg-black/50 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <h2 className={`${typography.fontSize['3xl']} sm:text-4xl lg:text-[64px] ${colors.text.white} text-center mb-8 md:mb-12 ${typography.tracking.tighter} font-bold`}>
          our team
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index % 3 + 1) }} // Stagger by row for mobile
            >
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 md:mb-4 object-cover"
              />
              <h3 className={`${typography.fontSize.base} md:${typography.fontSize.lg} ${typography.fontFamily.light} ${colors.text.white} ${typography.tracking.tighter}`}>
                {member.name}
              </h3>
              <p className={`${typography.fontFamily.light} ${typography.tracking.tight} text-xs md:text-sm`} style={{ color: member.color }}>
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};