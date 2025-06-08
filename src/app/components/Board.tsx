'use client';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000/');
const initialBoard: string | null[] = Array(9).fill(null);

const Board = () => {
    const [board, setBoard] = useState<(string | null)[]>(initialBoard);
    const [roomId, setRoomId] = useState('');
    const [player, setPlayer] = useState('');
    const [joined, setJoined] = useState(false);
    const [isXTurn, setIsXTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [winingLine, setWiningLine] = useState<number[]>([]);

    const createRoom = () => {
        socket.emit('createRoom', (id: string) => {
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
                setWiningLine(line);
                return;
            }
        }
    };

    const handleClick = (idx: number) => {
        if (board[idx] || winner || !isMyTurn()) return;

        const newBoard = [...board];
        newBoard[idx] = player;
        setBoard(newBoard);

        socket.emit('makeMove', { roomId, index: idx, player });

        checkWinner(board);
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
        };

        socket.on('opponentMove', handleOpponentMove);

        return () => {
            socket.off('opponentMove', handleOpponentMove);
        };
    }, [board]);

    const copyPasteRoomId = () => {
        navigator.clipboard.writeText(roomId);
    };

    const handleRematch = () => {
        setBoard(initialBoard);
        setWinner(null);
        setIsXTurn(true);
        setWiningLine([]);
        socket.emit('rematch', roomId);
    };

    useEffect(() => {
        socket.on('rematch', () => {});
        setBoard(initialBoard);
        setWinner(null);
        setIsXTurn(true);
        setWiningLine([]);
    }, []);

    return <div>Board</div>;
};

export default Board;
