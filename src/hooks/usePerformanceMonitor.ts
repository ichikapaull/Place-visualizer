import { useEffect, useState, useRef } from 'react';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  isSmooth: boolean;
}

export const usePerformanceMonitor = () => {
  const [stats, setStats] = useState<PerformanceStats>({ 
    fps: 0, 
    frameTime: 0, 
    isSmooth: true 
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);
  
  useEffect(() => {
    let animationId: number;
    
    const measurePerformance = (currentTime: number) => {
      frameCountRef.current++;
      
      const deltaTime = currentTime - lastTimeRef.current;
      frameTimesRef.current.push(deltaTime);
      
      // Keep only last 60 frames for rolling average
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current = frameTimesRef.current.slice(-60);
      }
      
      // Update stats every 60 frames
      if (frameCountRef.current % 60 === 0) {
        const averageFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const fps = 1000 / averageFrameTime;
        const isSmooth = fps >= 58; // Allow small margin below 60 FPS
        
        setStats({
          fps: Math.round(fps),
          frameTime: Math.round(averageFrameTime * 100) / 100,
          isSmooth
        });
      }
      
      lastTimeRef.current = currentTime;
      animationId = requestAnimationFrame(measurePerformance);
    };
    
    animationId = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return stats;
};
