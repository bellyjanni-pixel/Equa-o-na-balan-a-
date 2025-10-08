import React, { useState, useEffect, useCallback } from 'react';
import BalanceScale from './components/BalanceScale';
import OperationControls from './components/OperationControls';
import StepLog from './components/StepLog';
import Confetti from './components/Confetti';
import { Term, Operation } from './types';

type Difficulty = 'easy' | 'medium' | 'hard';

const DifficultyButton: React.FC<{
    level: Difficulty;
    current: Difficulty;
    onClick: (level: Difficulty) => void;
    children: React.ReactNode;
}> = ({ level, current, onClick, children }) => {
    const isActive = level === current;
    return (
        <button
            onClick={() => onClick(level)}
            className={`px-4 py-2 text-lg font-bold rounded-lg shadow-md transition-all transform hover:scale-105 ${
                isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
            {children}
        </button>
    );
};


const App: React.FC = () => {
    const [leftSide, setLeftSide] = useState<Term>({ x: 0, constant: 0 });
    const [rightSide, setRightSide] = useState<Term>({ x: 0, constant: 0 });
    const [solution, setSolution] = useState<number>(0);
    const [steps, setSteps] = useState<string[]>([]);
    const [isSolved, setIsSolved] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');

    const generateEquation = useCallback((level: Difficulty) => {
        setIsSolved(false);
        setSteps([]);
        setFeedback(null);

        let sol = 0;
        let left: Term = { x: 0, constant: 0 };
        let right: Term = { x: 0, constant: 0 };

        const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomIntNonZero = (min: number, max: number) => {
            let val = 0;
            while(val === 0) val = randomInt(min, max);
            return val;
        };

        switch (level) {
            case 'easy':
                sol = randomInt(1, 10);
                const a_easy = randomInt(1, 5);
                const b_easy = randomInt(0, 20);
                const c_easy = a_easy * sol + b_easy;
                left = { x: a_easy, constant: b_easy };
                right = { x: 0, constant: c_easy };
                break;

            case 'medium':
                sol = randomInt(-5, 10);
                const a_med = randomInt(2, 10);
                const b_med = randomInt(-10, 10);
                const c_med = randomInt(1, a_med - 1);
                const d_med = (a_med - c_med) * sol + b_med;
                left = { x: a_med, constant: b_med };
                right = { x: c_med, constant: d_med };
                break;

            case 'hard':
                sol = randomInt(-10, 10);
                let a_hard = randomIntNonZero(-5, 10);
                let c_hard = randomIntNonZero(-5, 10);
                while (a_hard === c_hard) {
                    c_hard = randomIntNonZero(-5, 10);
                }
                const b_hard = randomInt(-20, 20);
                const d_hard = (a_hard - c_hard) * sol + b_hard;
                left = { x: a_hard, constant: b_hard };
                right = { x: c_hard, constant: d_hard };
                break;
        }

        // Randomly swap sides for more variety
        if (Math.random() > 0.5) {
            [left, right] = [right, left];
        }

        setSolution(sol);
        setLeftSide(left);
        setRightSide(right);
    }, []);

    useEffect(() => {
        generateEquation('easy');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

     const handleChangeDifficulty = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        generateEquation(newDifficulty);
    };

    useEffect(() => {
        const checkSolution = () => {
            //Handles cases where solution is negative
            if (isSolved) return;

            const leftSolved = leftSide.x === 1 && leftSide.constant === 0 && rightSide.x === 0 && rightSide.constant === solution;
            const rightSolved = rightSide.x === 1 && rightSide.constant === 0 && leftSide.x === 0 && leftSide.constant === solution;

            if (leftSolved || rightSolved) {
                setIsSolved(true);
                setFeedback({ message: `Boa colheita, João! Você descobriu que x vale ${solution}!`, type: 'success' });
            }
        };
        checkSolution();
    }, [leftSide, rightSide, solution, isSolved]);

    const formatTerm = (term: Term): string => {
        const xPart = term.x !== 0 ? `${term.x}x` : '';
        const constPart = term.constant !== 0 ? `${term.constant > 0 ? ' + ' : ' - '}${Math.abs(term.constant)}` : '';
        let result = `${xPart}${constPart}`;
        if (result.startsWith(' + ')) result = result.substring(3);
        if (result.startsWith(' - ')) result = '-' + result.substring(3);
        if (result === '') return '0';
        return result.replace(/^1x/, 'x').replace(/^-1x/, '-x');
    };

    const applyOperation = (operation: Operation, value: number) => {
        if(value === 0 && (operation === Operation.MULTIPLY || operation === Operation.DIVIDE)) {
            setFeedback({ message: 'Não se pode multiplicar ou dividir por zero!', type: 'error' });
            return;
        }

        setFeedback(null);
        let opSymbol = '';
        const newLeftSide: Term = { ...leftSide };
        const newRightSide: Term = { ...rightSide };

        switch (operation) {
            case Operation.ADD:
                opSymbol = '+';
                newLeftSide.constant += value;
                newRightSide.constant += value;
                break;
            case Operation.SUBTRACT:
                opSymbol = '-';
                newLeftSide.constant -= value;
                newRightSide.constant -= value;
                break;
            case Operation.MULTIPLY:
                opSymbol = '×';
                newLeftSide.x *= value;
                newLeftSide.constant *= value;
                newRightSide.x *= value;
                newRightSide.constant *= value;
                break;
            case Operation.DIVIDE:
                 if (leftSide.x % value !== 0 || leftSide.constant % value !== 0 || rightSide.x % value !== 0 || rightSide.constant % value !== 0) {
                    setFeedback({ message: 'Tente uma divisão que resulte em números inteiros!', type: 'error' });
                    return;
                }
                opSymbol = '÷';
                newLeftSide.x /= value;
                newLeftSide.constant /= value;
                newRightSide.x /= value;
                newRightSide.constant /= value;
                break;
        }

        setLeftSide(newLeftSide);
        setRightSide(newRightSide);
        setSteps(prev => [...prev, `Aplicou (${opSymbol} ${value}) em ambos os lados.`]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-300 to-green-300 font-sans p-4 flex flex-col items-center">
            {isSolved && <Confetti />}
            <header className="text-center my-4">
                <h1 className="text-4xl md:text-5xl font-bold text-yellow-900 drop-shadow-lg">Equação na Balança da Fazenda</h1>
                <p className="text-lg text-green-800 mt-2">Olá, João! Vamos usar a balança da fazenda para encontrar o valor de 'x'.</p>
            </header>

            <div className="flex justify-center items-center gap-4 my-6 bg-white/50 p-3 rounded-xl shadow">
                <DifficultyButton level="easy" current={difficulty} onClick={handleChangeDifficulty}>Fácil</DifficultyButton>
                <DifficultyButton level="medium" current={difficulty} onClick={handleChangeDifficulty}>Médio</DifficultyButton>
                <DifficultyButton level="hard" current={difficulty} onClick={handleChangeDifficulty}>Difícil</DifficultyButton>
            </div>

            <div className="w-full text-center my-4">
                <p className="text-2xl md:text-3xl font-mono bg-white/70 p-4 rounded-lg shadow-md inline-block">
                    <span className="text-amber-700">{formatTerm(leftSide)}</span>
                    <span className="text-gray-700 mx-2">=</span>
                    <span className="text-red-700">{formatTerm(rightSide)}</span>
                </p>
            </div>
            
            <BalanceScale leftTerm={leftSide} rightTerm={rightSide} />
            
            {feedback && (
                <div className={`p-4 rounded-lg my-4 text-center font-bold text-white shadow-xl
                    ${feedback.type === 'success' ? 'bg-green-500' : ''}
                    ${feedback.type === 'error' ? 'bg-red-500' : ''}
                    ${feedback.type === 'info' ? 'bg-blue-500' : ''}
                `}>
                    {feedback.message}
                </div>
            )}
            
            <main className="w-full max-w-4xl mt-4 flex flex-col items-center gap-6">
                 {isSolved ? (
                    <button 
                        onClick={() => generateEquation(difficulty)}
                        className="px-8 py-4 bg-green-500 text-white font-bold text-2xl rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                    >
                        Jogar Novamente!
                    </button>
                 ) : (
                    <OperationControls onApply={applyOperation} disabled={isSolved} />
                 )}
                <StepLog steps={steps} />
            </main>
             <footer className="text-center text-gray-700 mt-auto pt-8">
                <p>Criado com 💙 para ajudar nos estudos da escola do campo.</p>
            </footer>
        </div>
    );
};

export default App;