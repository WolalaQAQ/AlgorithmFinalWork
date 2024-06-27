import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const StateMachineConfigurator = ({ onChange, initialTransitions }) => {
    const [state, setState] = useState('');
    const [inputSymbol, setInputSymbol] = useState('');
    const [newState, setNewState] = useState('');
    const [writeSymbols, setWriteSymbols] = useState('');
    const [directions, setDirections] = useState('');
    const [transitions, setTransitions] = useState({});

    useEffect(() => {
        setTransitions(initialTransitions);
    }, [initialTransitions]);

    const addTransition = () => {
        if (!transitions[state]) {
            transitions[state] = {};
        }

        transitions[state][inputSymbol] = {
            newState,
            writeSymbols: writeSymbols.split(','),
            directions: directions.split(','),
        };

        setTransitions({ ...transitions });
        onChange(transitions);

        // 清空输入框
        setState('');
        setInputSymbol('');
        setNewState('');
        setWriteSymbols('');
        setDirections('');
    };

    const removeTransition = (state, inputSymbol) => {
        if (transitions[state]) {
            delete transitions[state][inputSymbol];
            if (Object.keys(transitions[state]).length === 0) {
                delete transitions[state];
            }
            setTransitions({ ...transitions });
            onChange(transitions);
        }
    };

    return (
        <div>
            <h2>配置状态机</h2>
            <div>
                <input
                    type="text"
                    placeholder="当前状态"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="输入符号"
                    value={inputSymbol}
                    onChange={(e) => setInputSymbol(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="新状态"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="写入符号（逗号分隔）"
                    value={writeSymbols}
                    onChange={(e) => setWriteSymbols(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="方向（逗号分隔）"
                    value={directions}
                    onChange={(e) => setDirections(e.target.value)}
                />
                <button onClick={addTransition}>添加转移规则</button>
            </div>
            <h3>当前转移规则</h3>
            <ul>
                {Object.keys(transitions).map((state) => (
                    Object.keys(transitions[state]).map((inputSymbol) => (
                        <li key={`${state}-${inputSymbol}`}>
                            {state} + {inputSymbol} → {transitions[state][inputSymbol].newState} [ {transitions[state][inputSymbol].writeSymbols.join(', ')} ] [ {transitions[state][inputSymbol].directions.join(', ')} ]
                            <button onClick={() => removeTransition(state, inputSymbol)}>删除</button>
                        </li>
                    ))
                ))}
            </ul>
        </div>
    );
};

StateMachineConfigurator.propTypes = {
    onChange: PropTypes.func.isRequired,
    initialTransitions: PropTypes.object.isRequired,
};

export default StateMachineConfigurator;
