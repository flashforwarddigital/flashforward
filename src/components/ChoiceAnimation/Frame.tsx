import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";

interface FrameProps {
  onYearSelect: (year: '1996' | '2025') => void;
}

export const Frame = ({ onYearSelect }: FrameProps): JSX.Element => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransitionEnd = () => {
    if (!isZoomed) {
      setIsTransitioning(false);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
        setShowButtons(true);
      }, 300); // Delay to ensure animation completes
    }
  };

  const handlePowerClick = () => {
    setIsZoomed(!isZoomed);
    setIsTransitioning(true);
    setShowButtons(false);
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center">
      <div
        className={`relative w-full h-full max-h-screen flex items-center justify-center transition-transform duration-1000 ease-in-out ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <Card className="relative w-full h-full border-0 flex items-center justify-center">
          <CardContent className="p-0 h-full w-full flex items-center justify-center">
            {/* TV Screen Background */}
            <div 
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${
                isZoomed && !isTransitioning ? 'bg-white' : 'bg-black'
              }`}
              style={{
                zIndex: isTransitioning ? 2 : 1,
                backgroundColor: isZoomed && !isTransitioning ? '#f0f0d0' : 'black',
                position: 'absolute',
                width: '80vw',
                height: '60vw',
                maxWidth: '640px',
                maxHeight: '480px',
                top: '50%',
                left: '50%',
              }}
            >
              {/* Vignette Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 0 0 100px 50px rgba(0, 0, 0, 0.8)',
                  zIndex: 2,
                }}
              />

              {/* Animation Layer */}
              {isTransitioning && (
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${isZoomed ? '/turn_on.gif' : '/turn_off.gif'})`,
                    mixBlendMode: 'screen',
                    zIndex: 2
                  }}
                />
              )}
            </div>

            {/* Buttons Container */}
            <div className={`absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[640px] h-[480px] flex items-center justify-center gap-12 transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: showButtons ? 5 : 1 }}>
              <div 
                className="cursor-pointer flex items-center justify-center"
                onClick={() => onYearSelect('1996')}
                style={{ width: 'auto', height: 'auto' }}
              >
                <img src="/1996.png" alt="1996" style={{ width: '150px', height: 'auto', maxWidth: '100%' }} />
              </div>
              <div 
                className="cursor-pointer flex items-center justify-center"
                onClick={() => onYearSelect('2025')}
                style={{ width: 'auto', height: 'auto' }}
              >
                <img src="/2025.png" alt="2025" style={{ width: '150px', height: 'auto', maxWidth: '100%' }} />
              </div>
            </div>

            {/* Background Image Layer - Responsive for mobile */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: "url(/bg.png)",
                zIndex: 3
              }}
            />

            {/* Power Button Container - Properly centered */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center mb-[10%] z-[4]">
              {!isZoomed && (
                <div 
                  className="cursor-pointer flex justify-center items-center"
                  onClick={handlePowerClick}
                >
                  <img 
                    src="/power.png"
                    alt="Power On Button"
                    className="pulsating-power-button"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxHeight: '80px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}
            </div>

            <style>{`
              @keyframes pulsate {
                0% { transform: scale(1); }
                50% { transform: scale(1.10); } /* Scale up by 10 percent */
                100% { transform: scale(1); }
              }

              .pulsating-power-button {
                animation: pulsate 1.5s ease-in-out infinite;
              }

              button, [role="button"] {
                cursor: pointer;
              }
              
              @media (orientation: portrait) {
                .pulsating-power-button {
                  height: 60px !important;
                }
              }
            `}</style>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};