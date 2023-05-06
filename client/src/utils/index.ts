import { FieldError } from '../api/types';
import confetti from 'canvas-confetti';

export const mapToErrors = (errors: FieldError[]) => {
    const errorMap: Record<string, string> = {};

    for (const error of errors) {
        errorMap[error.field] =
            error.message.charAt(0).toUpperCase() + error.message.slice(1);
    }

    return errorMap;
};

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
});

export const showFireworks = () => {
    let duration = 15 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    let interval: NodeJS.Timer = setInterval(() => {
        let timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        let particleCount = 50 * (timeLeft / duration);
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        );
    }, 250);
};
