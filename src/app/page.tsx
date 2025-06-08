import Container from '@/components/ui/Container';
import Board from './components/Board';

export default function Home() {
    return (
        <div className='bg-slate-900'>
            <Container>
                <h2 className='text-3xl font-bold text-center text-white'>
                    Tic Tac Toe
                </h2>
                <Board />
            </Container>
        </div>
    );
}
