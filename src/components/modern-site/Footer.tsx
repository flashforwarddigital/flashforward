import React from 'react';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-[#008CFF] font-light mb-4 tracking-tight">flash forward</h3>
            <p className="text-gray-400 font-light tracking-tight">
              creating digital experiences that capture attention and drive results.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-light mb-4 tracking-tight">services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">web development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">ui/ux design</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">digital marketing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">ai services</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-light mb-4 tracking-tight">company</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors tracking-tight">about</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-white transition-colors tracking-tight">team</a></li>
              <li><a href="#work" className="text-gray-400 hover:text-white transition-colors tracking-tight">our work</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors tracking-tight">contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-light mb-4 tracking-tight">connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">linkedin</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">github</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-gray-400 font-light tracking-tight mb-4 md:mb-0">
            © 2025 flash forward. all rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">privacy policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors tracking-tight">terms of service</a>
            <button 
              onClick={onAdminClick} 
              className="text-gray-600 hover:text-gray-400 transition-colors text-xs tracking-tight"
            >
              admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}; 