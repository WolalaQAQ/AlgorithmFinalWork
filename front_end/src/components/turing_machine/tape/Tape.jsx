import React from 'react';
import PropTypes from 'prop-types';
import './Tape.css';

const Tape = ({ tapes, headPositions, onContentChange, locked }) => {
    const handleContentChange = (tapeIndex, cellIndex, newValue) => {
        if (locked) return;
        const newTapes = tapes.map((tape, i) =>
            i === tapeIndex ? tape.map((cell, j) => (j === cellIndex ? (newValue === '' ? '_' : newValue) : cell)) : tape
        );
        onContentChange(newTapes);
    };

    const handleAddLeft = (tapeIndex) => {
        if (locked) return;
        const newTapes = tapes.map((tape, i) =>
            i === tapeIndex ? ['_', ...tape] : tape
        );
        onContentChange(newTapes);
    };

    const handleAddRight = (tapeIndex) => {
        if (locked) return;
        const newTapes = tapes.map((tape, i) =>
            i === tapeIndex ? [...tape, '_'] : tape
        );
        onContentChange(newTapes);
    };

    const handleDelete = (tapeIndex, cellIndex) => {
        if (locked || tapes[tapeIndex].length <= 1) return;
        const newTapes = tapes.map((tape, i) =>
            i === tapeIndex ? tape.filter((_, j) => j !== cellIndex) : tape
        );
        onContentChange(newTapes);
    };

    return (
        <div>
            {tapes.map((tape, tapeIndex) => (
                <div key={tapeIndex} className="tape-container">
                    {!locked && (
                        <div className="tape-cell add-cell" onClick={() => handleAddLeft(tapeIndex)}>
                            +
                        </div>
                    )}
                    {tape.map((symbol, cellIndex) => (
                        <div
                            key={cellIndex}
                            className={`tape-cell ${cellIndex === headPositions[tapeIndex] ? 'head' : ''}`}
                        >
                            <input
                                type="text"
                                value={symbol === '_' ? '' : symbol}
                                onChange={(e) => handleContentChange(tapeIndex, cellIndex, e.target.value)}
                                maxLength="1"
                                style={{ width: '100%', height: '100%', textAlign: 'center', border: 'none', background: 'none' }}
                                disabled={locked}
                            />
                            {!locked && (
                                <button className="delete-cell" onClick={() => handleDelete(tapeIndex, cellIndex)}>
                                    x
                                </button>
                            )}
                        </div>
                    ))}
                    {!locked && (
                        <div className="tape-cell add-cell" onClick={() => handleAddRight(tapeIndex)}>
                            +
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

Tape.propTypes = {
    tapes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    headPositions: PropTypes.arrayOf(PropTypes.number).isRequired,
    onContentChange: PropTypes.func.isRequired,
    locked: PropTypes.bool.isRequired,
};

export default Tape;
