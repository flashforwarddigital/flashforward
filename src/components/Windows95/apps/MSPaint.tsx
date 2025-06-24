import React, { useState, useRef, useEffect } from 'react';

const MSPaint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(2);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsDrawing(true);
      setLastPosition({ x, y });
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        setLastPosition({ x, y });
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const colors = ['#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

  return (
    <div style={{ padding: '5px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', marginBottom: '5px', gap: '5px' }}>
        <button className="win95-button" onClick={clearCanvas}>Clear</button>
        
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
          <span style={{ marginRight: '5px' }}>Size:</span>
          <select 
            className="win95-button" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))}
            style={{ padding: '1px 5px' }}
          >
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="4">4px</option>
            <option value="6">6px</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: 'flex', marginBottom: '5px', gap: '2px' }}>
        {colors.map((c) => (
          <div 
            key={c}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: c,
              border: c === color ? '2px solid #000' : '1px solid #000',
              cursor: 'pointer'
            }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      
      <div 
        style={{ 
          flex: 1,
          backgroundColor: 'white',
          border: '1px solid var(--win95-border-inner-dark)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          width={570}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </div>
  );
};

export default MSPaint;