
import React, { useState } from 'react';
import { Operation } from '../types';

interface OperationControlsProps {
  onApply: (operation: Operation, value: number) => void;
  disabled: boolean;
}

const OperationButton: React.FC<{
    operation: Operation;
    selectedOp: Operation | null;
    onClick: (op: Operation) => void;
    children: React.ReactNode;
}> = ({ operation, selectedOp, onClick, children }) => {
    const isSelected = selectedOp === operation;
    return (
        <button
            onClick={() => onClick(operation)}
            className={`w-16 h-16 text-3xl font-bold rounded-full shadow-md transition-transform transform hover:scale-110 ${isSelected ? 'bg-green-500 text-white ring-4 ring-green-300' : 'bg-white text-gray-700'}`}
        >
            {children}
        </button>
    );
};

const OperationControls: React.FC<OperationControlsProps> = ({ onApply, disabled }) => {
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [value, setValue] = useState<string>('1');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseInt(value, 10);
    if (selectedOp && !isNaN(numValue)) {
      onApply(selectedOp, numValue);
    }
  };

  return (
    <form onSubmit={handleApply} className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border">
      <div className="flex gap-3">
        <OperationButton operation={Operation.ADD} selectedOp={selectedOp} onClick={setSelectedOp}>+</OperationButton>
        <OperationButton operation={Operation.SUBTRACT} selectedOp={selectedOp} onClick={setSelectedOp}>-</OperationButton>
        <OperationButton operation={Operation.MULTIPLY} selectedOp={selectedOp} onClick={setSelectedOp}>×</OperationButton>
        <OperationButton operation={Operation.DIVIDE} selectedOp={selectedOp} onClick={setSelectedOp}>÷</OperationButton>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-24 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={!selectedOp || disabled}
        step="1"
      />
      <button
        type="submit"
        disabled={!selectedOp || disabled}
        className="w-full sm:w-auto h-16 px-8 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
      >
        Aplicar
      </button>
    </form>
  );
};

export default OperationControls;
