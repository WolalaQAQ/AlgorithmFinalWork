import React, { useState, useEffect } from 'react';
import Tape from '../tape/Tape';
import StateMachine from '../state_machine/StateMachine';
import StateMachineConfigurator from '../state_machine/StateMachineConfigurator';
import './TuringMachineController.css';
import { addTape, removeTape } from './TapeOperations';
import { executeTransition, resetMachine } from './StateMachineOperations';
import { loadExamples, loadExample } from './ExampleLoader';

const TuringMachineController = () => {
    const [transitions, setTransitions] = useState({});
    const [examples, setExamples] = useState({ single: [], double: [], triple: [] });
    const [selectedExample, setSelectedExample] = useState('');
    const [initialState, setInitialState] = useState('q0');
    const stateMachine = StateMachine({ initialState, transitions });
    const [tapes, setTapes] = useState([['_', '1', '0', '1', '1', '0', '_']]);
    const [initialTapes, setInitialTapes] = useState([['_', '1', '0', '1', '1', '0', '_']]);
    const [headPositions, setHeadPositions] = useState([1]);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        loadExamples(setExamples);
    }, []);

    const handleTransitionsChange = (newTransitions) => {
        setTransitions(newTransitions);
    };

    const handleExampleChange = async (event) => {
        const exampleFile = event.target.value;
        setSelectedExample(exampleFile);
        const example = await loadExample(exampleFile, setTransitions, (newTapes) => {
            setTapes(newTapes);
            setInitialTapes(newTapes);
        }, () => resetMachine(stateMachine, tapes, setHeadPositions));
        setInitialState(example.init);
        stateMachine.setState(example.init); // Ensure initial state is set in the state machine
        setLocked(false);
    };

    const toggleLock = () => {
        if (!locked) {
            const newHeadPositions = tapes.map(tape => tape.findIndex(symbol => symbol !== '_'));
            const maxHeadPosition = Math.max(...newHeadPositions.map(pos => (pos === -1 ? 0 : pos)));
            setHeadPositions(newHeadPositions.map(() => maxHeadPosition));
        }
        setLocked(!locked);
    };

    const handleContentChange = (newTapes) => {
        setTapes(newTapes);
    };

    const resetTapes = () => {
        setTapes(initialTapes);
        const newHeadPositions = initialTapes.map(tape => tape.findIndex(symbol => symbol !== '_'));
        setHeadPositions(newHeadPositions.map(pos => (pos === -1 ? 0 : pos)));
    };

    return (
        <div className="turing-machine-container">
            <div className="configurator">
                <StateMachineConfigurator onChange={handleTransitionsChange} initialTransitions={transitions} />
            </div>
            <div className="simulation">
                <h1>图灵机仿真</h1>
                <Tape tapes={tapes} headPositions={headPositions} onContentChange={handleContentChange} locked={locked} />
                <p>当前状态: {stateMachine.currentState}</p>
                <button onClick={() => executeTransition(stateMachine, tapes, headPositions, setTapes, setHeadPositions, locked)}>执行一步</button>
                <button onClick={() => resetMachine(stateMachine, tapes, setHeadPositions)}>重置图灵机</button>
                <button onClick={resetTapes}>重置纸带</button>
                <button onClick={toggleLock}>{locked ? '解锁纸带' : '锁定纸带'}</button>
                <button onClick={() => addTape(tapes, headPositions, setTapes, setHeadPositions)}>添加纸带</button>
                <button onClick={() => removeTape(tapes, headPositions, setTapes, setHeadPositions)}>删除纸带</button>
                <select value={selectedExample} onChange={handleExampleChange}>
                    <option value="">选择示例</option>
                    <optgroup label="1 Tape">
                        {examples.single.map(example => (
                            <option key={example} value={example}>{example.replace('.json', '')}</option>
                        ))}
                    </optgroup>
                    <optgroup label="2 Tapes">
                        {examples.double.map(example => (
                            <option key={example} value={example}>{example.replace('.json', '')}</option>
                        ))}
                    </optgroup>
                    <optgroup label="3 Tapes">
                        {examples.triple.map(example => (
                            <option key={example} value={example}>{example.replace('.json', '')}</option>
                        ))}
                    </optgroup>
                </select>
            </div>
        </div>
    );
};

export default TuringMachineController;
