import { useState } from 'react';
import { TapeClass } from '@class/tape/TapeClass';

interface UseTapes {
    tapes: TapeClass[];
    setTapes: (tapes: TapeClass[]) => void;
    addTape: () => void;
    removeTape: (index: number) => void;
    updateTapeContent: (index: number, content: number[]) => void;
    updateHeads: (index: number, heads: Set<number>) => void;
}

const useTapes = (initialTapes: TapeClass[] = []) : UseTapes => {
    const [tapes, setTapes] = useState<TapeClass[]>(initialTapes);

    const addTape = () => setTapes([...tapes, new TapeClass()]);
    const removeTape = (index: number) => setTapes(tapes.filter((_, i) => i !== index));
    const updateTapeContent = (index: number, content: number[]) => {
        setTapes(tapes.map((tape, i) => {
            if (i === index) {
                tape.content = content;
            }
            return tape;
        }));
    };
    const updateHeads = (index: number, heads: Set<number>) => {
        setTapes(tapes.map((tape, i) => {
            if (i === index) {
                tape.heads = heads;
            }
            return tape;
        }));
    };

    return { tapes, setTapes, addTape, removeTape, updateTapeContent, updateHeads };
};

export default useTapes;
