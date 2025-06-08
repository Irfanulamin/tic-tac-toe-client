import { cn } from '@/components/lib/utils';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className,
    onClick,
    ...rest
}) => {
    const baseStyles =
        'text-base p-1 rounded-lg font-bold text-black border-2 border-b-4 active:border-b-2 hover:';

    const variants = {
        primary: 'bg-amber-600 border-amber-900 hover:border-amber-800',
        secondary: 'bg-white border-slate-700 hover:border-slate-600',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
