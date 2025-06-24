import React from 'react';

const ServicesWindow: React.FC = () => {
  const services = [
    {
      title: 'Web Design & Development',
      icon: '/documents copy.png',
      description: 'Custom websites built with modern tech and optimized for performance.',
      price: 'Starting at $999'
    },
    {
      title: 'Branding & Identity',
      icon: '/BRANDING.png',
      description: 'Create a memorable brand that stands out in the digital landscape.',
      price: 'Starting at $799'
    },
    {
      title: 'Content Creation',
      icon: '/VIDEOS.png',
      description: 'Engaging content that tells your story and captures attention.',
      price: 'Starting at $499'
    },
    {
      title: 'AI Integration',
      icon: '/AI.png',
      description: 'Leverage AI to automate and enhance your business processes.',
      price: 'Starting at $299'
    },
    {
      title: 'Growth Strategy',
      icon: '/GROWTH.png',
      description: 'Data-driven strategies to scale your online presence.',
      price: 'Starting at $699'
    }
  ];

  return (
    <div className="win95-services">
      <div className="win95-services-header">
        <img src="/flashforward.png" alt="Flash Forward" className="win95-services-logo" />
        <h2 className="win95-services-title">Our Services</h2>
      </div>
      
      <div className="win95-services-list">
        {services.map((service, index) => (
          <div key={index} className="win95-services-item">
            <div className="win95-services-item-header">
              <img src={service.icon} alt={service.title} className="win95-services-item-icon" />
              <h3 className="win95-services-item-title">{service.title}</h3>
            </div>
            <div className="win95-services-item-content">
              <p className="win95-services-item-description">{service.description}</p>
              <div className="win95-services-item-price">{service.price}</div>
              <button className="win95-button">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesWindow;