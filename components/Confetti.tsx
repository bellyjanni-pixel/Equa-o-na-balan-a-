
import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
    const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, angle: number, speed: number, rotation: number, color: string}>>([]);

    useEffect(() => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const newParticles = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: -20 - Math.random() * 50, // start off-screen
            angle: Math.random() * 360,
            speed: 2 + Math.random() * 5,
            rotation: Math.random() * 1080,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute w-3 h-3"
                    style={{
                        backgroundColor: p.color,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        transform: `translateY(50vh) rotate(${p.rotation}deg)`,
                        transition: `transform 5s ease-out, opacity 5s ease-out`,
                        opacity: 0,
                    }}
                    // A trick to trigger the animation after the element is mounted
                    ref={el => {
                        if (el) {
                            setTimeout(() => {
                                el.style.transform = `translateY(120vh) rotate(${p.rotation * 2}deg)`;
                                el.style.opacity = '1';
                                setTimeout(() => {
                                    el.style.opacity = '0';
                                }, 4000)
                            }, 50)
                        }
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
