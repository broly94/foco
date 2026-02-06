'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const phrases = [
    'visualizar tu negocio.',
    'encontrar proveedores para tu negocio.',
    'encontrar negocios de cercanía.',
];

export default function TypewriterEffect() {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[index];

            if (isDeleting) {
                setDisplayText(currentPhrase.substring(0, displayText.length - 1));
                setTypingSpeed(40); // Increased deletion speed
            } else {
                setDisplayText(currentPhrase.substring(0, displayText.length + 1));
                setTypingSpeed(100);
            }

            if (!isDeleting && displayText === currentPhrase) {
                setTimeout(() => setIsDeleting(true), 1500); // Reduced pause before deleting
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setIndex((prev) => (prev + 1) % phrases.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, index, typingSpeed]);

    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight'>
                Con foco podes
            </h1>
            <div className='h-20 md:h-24'>
                <span className='text-emerald-600 dark:text-emerald-400 text-3xl md:text-5xl font-bold'>
                    {displayText}
                </span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className='inline-block w-1 h-8 md:h-12 bg-emerald-600 dark:bg-emerald-400 ml-1 align-middle'
                />
            </div>
        </div>
    );
}
