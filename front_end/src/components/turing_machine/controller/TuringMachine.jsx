import { useState } from 'react';
import Tape from '../tape/Tape.jsx';
import StateMachine from '../state_machine/StateMachine.jsx';
import StateMachineConfigurator from '../state_machine/StateMachineConfigurator.jsx';

const TuringMachine = () => {
    const [transitions, setTransitions] = useState({});
    const initialState = 'q0';
    const stateMachine = StateMachine({ initialState, transitions });

    const handleTransition = (input) => {
        const result = stateMachine.transition(input);
        if (result) {
            console.log('Transition:', result);
        } else {
            console.log('No transition available for input:', input);
        }
    };

    const handleTransitionsChange = (newTransitions) => {
        setTransitions(newTransitions);
    };

    return (
        <div>
            <Tape initialContent={['1', '0', '1', '1', '0']} initialHeadPosition={2} />
            <p>Current State: {stateMachine.currentState}</p>
            <button onClick={() => handleTransition('0')}>Input 0</button>
            <button onClick={() => handleTransition('1')}>Input 1</button>
            <button onClick={stateMachine.reset}>Reset</button>
            <StateMachineConfigurator onChange={handleTransitionsChange} />
        </div>
    );
};

export default TuringMachine;
