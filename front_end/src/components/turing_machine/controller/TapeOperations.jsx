import React from 'react';

export const addTape = (tapes, headPositions, setTapes, setHeadPositions) => {
    setTapes([...tapes, Array(tapes[0].length).fill('_')]);
    setHeadPositions([...headPositions, 0]);
};

export const removeTape = (tapes, headPositions, setTapes, setHeadPositions) => {
    if (tapes.length > 1) {
        const newTapes = tapes.slice(0, -1);
        const newHeadPositions = headPositions.slice(0, -1);
        setTapes(newTapes);
        setHeadPositions(newHeadPositions);
    }
};

export const resetTapes = (setTapes, setHeadPositions) => {
    setTapes([['_', '1', '0', '1', '1', '0', '_']]);
    setHeadPositions([1]);
};
