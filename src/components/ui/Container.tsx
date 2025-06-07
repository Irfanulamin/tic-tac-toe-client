import React from 'react';
import { cn } from '../lib/utils';

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className={cn('w-full', className)}>{children}</div>
        </div>
    );
};

export default Container;
