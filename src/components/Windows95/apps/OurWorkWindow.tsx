import React, { useState } from 'react';

interface WorkItem {
  title: string;
  category: string;
  image: string;
  description: string;
  technologies?: string[];
}

const OurWorkWindow: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'websites', name: 'Websites' },
    { id: 'branding', name: 'Branding' },
    { id: 'ai', name: 'AI Solutions' },
    { id: 'content', name: 'Content' }
  ];

  const workItems: WorkItem[] = [
    {
      title: 'TechCorp Website Redesign',
      category: 'websites',
      image: '/WEBSITES.png',
      description: 'Complete website overhaul with modern design and improved UX',
      technologies: ['React', 'TypeScript', 'Tailwind CSS']
    },
    {
      title: 'FreshBrand Identity',
      category: 'branding',
      image: '/BRANDING.png',
      description: 'Full brand identity design including logo, colors, and guidelines',
      technologies: ['Adobe Creative Suite', 'Brand Strategy']
    },
    {
      title: 'AI Customer Service Bot',
      category: 'ai',
      image: '/AI.png',
      description: 'Intelligent chatbot handling customer inquiries 24/7',
      technologies: ['OpenAI', 'Natural Language Processing']
    },
    {
      title: 'Video Marketing Campaign',
      category: 'content',
      image: '/VIDEOS.png',
      description: 'Series of engaging promotional videos for social media',
      technologies: ['Video Production', 'Social Media Strategy']
    },
    {
      title: 'Growth Analytics Dashboard',
      category: 'websites',
      image: '/GROWTH.png',
      description: 'Real-time business metrics visualization platform',
      technologies: ['Data Analytics', 'Dashboard Design']
    }
  ];

  const filteredWork = selectedCategory === 'all' 
    ? workItems 
    : workItems.filter(item => item.category === selectedCategory);

  return (
    <div className="win95-work">
      <div className="win95-work-header">
        <img src="/Our_Work.png" alt="Our Work" className="win95-work-logo" />
        <h2 className="win95-work-title">Our Work</h2>
      </div>

      <div className="win95-work-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`win95-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="win95-work-grid">
        {filteredWork.map((item, index) => (
          <div key={index} className="win95-work-item">
            <div className="win95-work-item-header">
              <img src={item.image} alt={item.title} className="win95-work-item-icon" />
              <h3 className="win95-work-item-title">{item.title}</h3>
            </div>
            <div className="win95-work-item-content">
              <p className="win95-work-item-description">{item.description}</p>
              {item.technologies && (
                <div className="win95-work-item-tech">
                  <div className="win95-work-item-tech-label">Technologies:</div>
                  <div className="win95-work-item-tech-list">
                    {item.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="win95-work-item-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button className="win95-button">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurWorkWindow;