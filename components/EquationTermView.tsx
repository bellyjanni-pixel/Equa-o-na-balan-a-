import React from 'react';
import { Term } from '../types';

interface EquationTermViewProps {
  term: Term;
}

const TermBlock: React.FC<{ text: string; color: string; count: number }> = ({ text, color, count }) => (
  <div className="flex items-center justify-center m-1 p-2 h-12 w-12 rounded-lg shadow-md font-bold text-white text-lg" style={{ backgroundColor: color }}>
    {text}
    {count > 1 && <span className="absolute -top-2 -right-2 bg-white text-gray-800 rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border-2" style={{ borderColor: color }}>{count}</span>}
  </div>
);

const EquationTermView: React.FC<EquationTermViewProps> = ({ term }) => {
  const renderBlocks = (count: number, text: string, color: string, negativeText: string, negativeColor: string) => {
    const absCount = Math.abs(count);
    const isNegative = count < 0;
    const blocks = [];
    
    // Group blocks to avoid rendering thousands of individual elements
    if (absCount > 0) {
        blocks.push(
            <div key={`${isNegative ? negativeText : text}-group`} className="relative">
                <TermBlock 
                    text={isNegative ? negativeText : text} 
                    color={isNegative ? negativeColor : color}
                    count={absCount}
                />
            </div>
        );
    }

    return blocks;
  };

  return (
    <div className="flex flex-wrap justify-center items-center p-4 min-h-[100px]">
      {/* 'x' como um saco de grãos */}
      {renderBlocks(term.x, 'x', '#a16207', '-x', '#b91c1c')}
      {/* Constantes como maçãs */}
      {renderBlocks(term.constant, '+1', '#dc2626', '-1', '#7f1d1d')}
    </div>
  );
};

export default EquationTermView;