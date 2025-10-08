import React from 'react';
import EquationTermView from './EquationTermView';
import { Term } from '../types';

interface BalanceScaleProps {
  leftTerm: Term;
  rightTerm: Term;
}

const BalanceScale: React.FC<BalanceScaleProps> = ({ leftTerm, rightTerm }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4">
      <div className="flex justify-around items-end">
        {/* Left Pan */}
        <div className="w-2/5 h-auto min-h-[150px] bg-amber-200 border-4 border-amber-700 rounded-xl shadow-lg flex flex-col justify-center items-center p-2">
            <EquationTermView term={leftTerm} />
        </div>
        {/* Right Pan */}
        <div className="w-2/5 h-auto min-h-[150px] bg-amber-200 border-4 border-amber-700 rounded-xl shadow-lg flex flex-col justify-center items-center p-2">
            <EquationTermView term={rightTerm} />
        </div>
      </div>
      {/* Scale Base */}
      <div className="relative mt-[-10px]">
        <div className="h-4 bg-amber-800 w-full rounded-b-lg"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0">
            <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[60px] border-b-amber-900"></div>
            <div className="w-24 h-4 bg-amber-900 -mt-1 transform -translate-x-2 rounded-b"></div>
        </div>
      </div>
    </div>
  );
};

export default BalanceScale;