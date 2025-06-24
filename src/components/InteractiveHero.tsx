import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverBorderGradient } from './ui/hover-border-gradient';

const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(' ');

interface RotatingTextProps {
  texts: string[];
  mainClassName?: string;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  initial?: any;
  animate?: any;
  exit?: any;
  staggerDuration?: number;
  transition?: any;
  rotationInterval?: number;
  splitBy?: "characters" | "words" | "lines" | string;
  auto?: boolean;
  loop?: boolean;
}

const RotatingText = React.forwardRef<any, RotatingTextProps>((props, ref) => {
  const {
    texts,
    mainClassName,
    staggerFrom = "last",
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-100%", opacity: 0 },
    staggerDuration = 0.03,
    transition = { type: "spring", damping: 20, stiffness: 300 },
    rotationInterval = 3500,
    splitBy = "characters",
    auto = true,
    loop = true
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (!auto || texts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(timer);
  }, [auto, texts.length, rotationInterval]);

  const currentText = texts[currentIndex];
  const words = currentText.split(' ');
  const colors = ['#008CFF', '#FFCC00', '#FF1493', '#00CC66'];
  const colorIndex = currentIndex % colors.length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        className={cn("flex gap-[0.2em] overflow-hidden", mainClassName)}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {words.map((word, wordIndex) => (
          <motion.div key={`${word}-${wordIndex}`} className="flex">
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={`${char}-${charIndex}`}
                style={{ color: colors[colorIndex] }}
                className="inline-block font-light tracking-tighter"
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: staggerDuration * (charIndex + wordIndex * word.length)
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

RotatingText.displayName = 'RotatingText';

const InteractiveHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<any[]>([]);
  const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePositionRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const rotatingTexts = [
    'epic websites',
    'slapping brands',
    'kick ass content',
    'that ai stuff'
  ];

  return (
    <div className="pt-16 md:pt-[100px] relative bg-black text-gray-300 min-h-screen flex flex-col overflow-x-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-8 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[64px] text-white leading-tight max-w-4xl mb-6 md:mb-8 flex flex-col items-center tracking-tighter"
        >
          <span className="block mb-2 font-bold">flash forward with</span>
          <div className="h-[1.2em] overflow-hidden">
            <RotatingText
              texts={rotatingTexts}
              mainClassName="mx-1"
              staggerFrom="last"
              rotationInterval={3500}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div onClick={() => setShowVideo(true)} className="cursor-pointer">
            <HoverBorderGradient
              className="text-lg md:text-xl font-light tracking-tight"
              containerClassName="scale-100 md:scale-110"
              duration={1.5}
            >
              watch video
            </HoverBorderGradient>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-white text-2xl z-10 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => setShowVideo(false)}
              >
                &times;
              </button>
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                <video
                  src="https://file.garden/Zxsc5-9aojhlnJO6/flashforowarddraft.mp4"
                  controls
                  autoPlay
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveHero;