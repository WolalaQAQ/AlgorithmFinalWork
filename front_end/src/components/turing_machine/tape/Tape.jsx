import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const Tape = ({ tape, head }) => {
    const [tapeContent, setTapeContent] = useState(tape);
    const [headPosition, setHeadPosition] = useState(head);

    const handleTapeChange = (event) => {
        setTapeContent(event.target.value);
    };

    const handleHeadChange = (event) => {
        setHeadPosition(event.target.value);
    };

    return (
        <div>
            <label>
                磁带内容：
                <Input size="large" type="text" value={tapeContent} onChange={handleTapeChange} />
            </label>
            <br />
            <label>
                头位置：
                <Input size="large" type="text" value={headPosition} onChange={handleHeadChange} />
            </label>
        </div>
    );
}

export default Tape;

Tape.propTypes = {
    tape: PropTypes.string.isRequired,
    head: PropTypes.string.isRequired
};