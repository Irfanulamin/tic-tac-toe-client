import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function Home() {
    return (
        <div className='bg-slate-900'>
            <Container>
                <h2 className='text-3xl font-bold text-center text-white'>
                    Tic Tac Toe
                </h2>
                <div className='flex justify-center items-center gap-2 '>
                    <div>
                        <Button className='text-amber-900'>Create Room</Button>
                    </div>
                    <div>
                        <Button variant='secondary' className='text-slate-700'>
                            Join Room
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
