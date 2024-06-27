import { useState } from 'react';

const StateMachine = ({ initialState, transitions }) => {
    const [currentState, setCurrentState] = useState(initialState);

    const transition = (inputSymbols) => {
        if (!transitions[currentState]) {
            return null;
        }
        const transition = transitions[currentState][inputSymbols];
        return transition ? { ...transition, newState: transition.newState } : null;
    };

    const reset = () => {
        setCurrentState(initialState);
    };

    const setState = (newState) => {
        setCurrentState(newState);
    };

    return { currentState, transition, reset, setState };
};

export default StateMachine;
