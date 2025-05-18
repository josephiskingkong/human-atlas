import React from "react";
import "../../styles/components/measure-line.scss";

const MeasureLine = ({ p1, p2, distance }) => {
  // Вычисляем разницу координат в относительных единицах
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Вычисляем реальную длину линии
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Расчет угла линии в градусах
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Преобразуем микрометры в миллиметры для лучшей читаемости
  const displayDistance = distance * 1000;
  
  // Viewport-скейл для OpenSeadragon
  const vpScale = 100;
  
  return (
    <div
      className="measure-line-container"
      style={{
        position: 'absolute',
        left: `${p1.x * vpScale}%`,
        top: `${p1.y * vpScale}%`,
        width: '0',
        height: '0',
        zIndex: 1001,
        pointerEvents: 'none'
      }}
    >
      <div 
        className="measure-line"
        style={{
          position: 'absolute',
          width: `${length * vpScale}%`,
          height: '3px',
          backgroundColor: 'red',
          transformOrigin: '0 50%',
          transform: `rotate(${angle}deg)`,
          zIndex: 1001
        }}
      />
      
      <div 
        className="measure-point p1"
        style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'red',
          border: '2px solid white',
          transform: 'translate(-50%, -50%)',
          zIndex: 1002
        }}
      />
      
      <div 
        className="measure-point p2"
        style={{
          position: 'absolute',
          left: `${dx * vpScale}%`,
          top: `${dy * vpScale}%`,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'red',
          border: '2px solid white',
          transform: 'translate(-50%, -50%)',
          zIndex: 1002
        }}
      />
      
      <div 
        className="measure-label"
        style={{
          position: 'absolute',
          left: `${dx * vpScale/2}%`,
          top: `${dy * vpScale/2}%`,
          transform: 'translate(-50%, -150%)',
          background: '#ffffffee',
          padding: '3px 8px',
          borderRadius: '4px',
          fontWeight: 'bold',
          color: 'black',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          zIndex: 1003
        }}
      >
        {displayDistance.toFixed(3)} мкм
      </div>
    </div>
  );
};

export default MeasureLine;