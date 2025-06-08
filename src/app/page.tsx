import Board from './components/Board';

export default function Home() {
    return (
        <div className='relative w-full bg-blue-950 overflow-hidden'>
            <div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
                <div className='w-full max-w-md  p-6 '>
                    <h2 className='mb-6 text-3xl font-bold text-center text-white'>
                        Tic Tac Toe
                    </h2>
                    <Board />
                </div>
            </div>
        </div>
    );
}
