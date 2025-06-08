'use client';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Menu from './Menu';
import { FaCopy } from 'react-icons/fa';

const socket = io('http://localhost:8000/');
const initialBoard: (string | null)[] = Array(9).fill(null);

const Board = () => {
    const [board, setBoard] = useState<(string | null)[]>(initialBoard);
    const [roomId, setRoomId] = useState('');
    const [player, setPlayer] = useState('');
    const [joined, setJoined] = useState(false);
    const [isXTurn, setIsXTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [winningLine, setWinningLine] = useState<number[]>([]);

    const createRoom = () => {
        console.log('Emitting createRoom');
        socket.emit('createRoom', (id: string) => {
            console.log('Got room id back:', id);
            setRoomId(id);
            setJoined(true);
            setPlayer('X');
        });
    };

    const joinRoom = () => {
        const id = prompt('Enter Room Id:');
        if (!id?.trim()) {
            alert('Error: Enter Valid Id!');
            return;
        }

        socket.emit('joinRoom', id, (res: { success: boolean }) => {
            if (res.success) {
                setRoomId(id);
                setPlayer('O');
                setJoined(true);
            } else {
                alert('Failed To Join the Room');
            }
        });
    };

    const isMyTurn = () => {
        return (isXTurn && player === 'X') || (!isXTurn && player === 'O');
    };

    const checkWinner = (board: (string | null)[]) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a]);
                setWinningLine(line);
                return;
            }
        }

        if (board.every((cell) => cell !== null)) {
            setWinner('Draw');
        }
    };

    const handleClick = (idx: number) => {
        if (board[idx] || winner || !isMyTurn()) return;

        const newBoard = [...board];
        newBoard[idx] = player;
        setBoard(newBoard);

        socket.emit('makeMove', { roomId, index: idx, player });

        checkWinner(newBoard);
        setIsXTurn((prev) => !prev);
    };

    useEffect(() => {
        const handleOpponentMove = ({
            index,
            player,
        }: {
            index: number;
            player: string;
        }) => {
            const newBoard = [...board];
            newBoard[index] = player;
            setBoard(newBoard);
            setIsXTurn((prev) => !prev);
            checkWinner(newBoard);
        };

        socket.on('opponentMove', handleOpponentMove);

        return () => {
            socket.off('opponentMove', handleOpponentMove);
        };
    }, [board]);

    useEffect(() => {
        const handleRematch = () => {
            setBoard(initialBoard);
            setWinner(null);
            setIsXTurn(true);
            setWinningLine([]);
        };

        socket.on('rematch', handleRematch);

        return () => {
            socket.off('rematch', handleRematch);
        };
    }, []);

    const copyPasteRoomId = () => {
        navigator.clipboard.writeText(roomId);
    };

    const handleRematch = () => {
        setBoard(initialBoard);
        setWinner(null);
        setIsXTurn(true);
        setWinningLine([]);
        socket.emit('rematch', roomId);
    };

    return (
        <div>
            {joined ? (
                <>
                    <div className='flex justify-center items-center space-x-2 mb-6'>
                        <span className='text-lg bg-white text-gray-800 px-3 py-1 rounded-lg shadow-lg'>
                            Room: {roomId}
                        </span>
                        <FaCopy
                            onClick={copyPasteRoomId}
                            className='cursor-pointer text-xl text-yellow-300 hover:text-yellow-900'
                        />
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-3 gap-4'>
                            {board.map((cell, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleClick(idx)}
                                    className={`w-24 h-24 text-3xl font-bold flex items-center justify-center bg-white text-gray-800 shadow-lg rounded-lg ${
                                        winningLine.includes(idx)
                                            ? 'bg-yellow-300 text-yellow-900'
                                            : ''
                                    } ${
                                        !isMyTurn() || cell || winner
                                            ? 'cursor-not-allowed opacity-50'
                                            : 'cursor-pointer hover:scale-105 transform transition-all'
                                    }`}
                                    disabled={
                                        !isMyTurn() ||
                                        Boolean(cell) ||
                                        Boolean(winner)
                                    }
                                >
                                    {cell === 'Draw' ? '-' : cell}
                                </button>
                            ))}
                        </div>
                    </div>
                    {winner && winner !== 'Draw' && (
                        <p className='mt-2 text-green-600 text-lg'>
                            Winner: {winner}
                        </p>
                    )}
                    {winner === 'Draw' && (
                        <p className='mt-2 text-gray-600 text-lg'>
                            It&apos;s a draw!
                        </p>
                    )}
                    {(winner || board.every((cell) => cell)) && (
                        <button
                            onClick={handleRematch}
                            className='mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded'
                        >
                            Rematch
                        </button>
                    )}
                    {!isMyTurn() && !winner && !board.every((cell) => cell) && (
                        <p className='mt-2 text-gray-600 text-center'>
                            Waiting for opponent&apos;s move...
                        </p>
                    )}
                </>
            ) : (
                <Menu createRoom={createRoom} joinRoom={joinRoom} />
            )}
        </div>
    );
};

export default Board;
