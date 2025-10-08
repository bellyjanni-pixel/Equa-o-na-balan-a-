import React from 'react';

interface StepLogProps {
  steps: string[];
}

const StepLog: React.FC<StepLogProps> = ({ steps }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md border">
      <h3 className="text-lg font-bold text-gray-700 mb-2 text-center">Passos Realizados</h3>
      {steps.length === 0 ? (
         <p className="text-center text-gray-500 italic">Nenhum passo ainda. Comece a equilibrar a balança da fazenda!</p>
      ) : (
        <ul className="list-decimal list-inside text-gray-600 space-y-1 h-32 overflow-y-auto">
            {steps.map((step, index) => (
            <li key={index}>{step}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default StepLog;