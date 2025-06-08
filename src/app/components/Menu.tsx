import Button from '@/components/ui/Button';
import React from 'react';

interface MenuProps {
    createRoom: () => void;
    joinRoom: () => void;
}

const Menu: React.FC<MenuProps> = ({ createRoom, joinRoom }) => {
    return (
        <div className='flex justify-center items-center gap-4'>
            <Button onClick={createRoom} className='text-amber-900'>
                Create Room
            </Button>
            <Button
                onClick={joinRoom}
                variant='secondary'
                className='text-slate-700'
            >
                Join Room
            </Button>
        </div>
    );
};

export default Menu;
