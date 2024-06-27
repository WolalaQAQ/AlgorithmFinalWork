export const executeTransition = (stateMachine, tapes, headPositions, setTapes, setHeadPositions, locked) => {
    if (!locked) return;
    const currentSymbols = headPositions.map((pos, i) => tapes[i][pos] || '_');
    const transition = stateMachine.transition(currentSymbols.join(''));

    if (transition) {
        const { newState, writeSymbols, directions } = transition;

        // Update tape content
        const newTapes = tapes.map((tape, i) => {
            const newTape = [...tape];
            newTape[headPositions[i]] = writeSymbols[i] || '_';
            return newTape;
        });

        // Move heads
        const newHeadPositions = headPositions.map((pos, i) => {
            if (directions[i] === 'R') {
                pos += 1;
                if (pos >= newTapes[i].length) {
                    newTapes[i].push('_');
                }
            } else if (directions[i] === 'L') {
                pos -= 1;
                if (pos < 0) {
                    newTapes[i].unshift('_');
                    pos = 0;
                }
            }
            return pos;
        });

        setTapes(newTapes);
        setHeadPositions(newHeadPositions);

        // Update state
        stateMachine.setState(newState);
    }
};

export const resetMachine = (stateMachine, tapes, setHeadPositions) => {
    stateMachine.reset();
    const newHeadPositions = tapes.map(tape => tape.findIndex(symbol => symbol !== '_'));
    setHeadPositions(newHeadPositions.map(pos => (pos === -1 ? 0 : pos)));
};
