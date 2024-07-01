import React, { useState } from 'react';
import {Button, Input, Row, Col, Layout, theme} from 'antd';
import {TapeClass} from "./TapeClass.tsx";

interface TapeComponentProps {
    tape: TapeClass;
    index: number;
    onUpdateTapeContent: (index: number, content: number[]) => void;
    onUpdateHeads: (index: number, heads: Set<number>) => void;
    onRemoveTape: (index: number) => void;
}

const TapeComponent : React.FC<TapeComponentProps> = ({ tape, index, onUpdateTapeContent, onUpdateHeads, onRemoveTape }) => {
    const [inputTape, setInputTape] = useState(tape.content.join(','));
    const [readOnly, setReadOnly] = useState(false);

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        // 只允许输入数字和逗号
        if (!/^[0-9,]*$/.test(e.target.value)) {
            return;
        }
        setInputTape(e.target.value);
    };

    const handleUpdateTape = () => {
        // 将输入的纸带内容转换为整数数组
        const newContent = inputTape.split(',').map(cell => parseInt(cell, 10));
        onUpdateTapeContent(index, newContent);
        onUpdateHeads(index, new Set([0]));
    };

    const toggleReadOnly = () => {
        setReadOnly(!readOnly);
    };

    const {
        token: {
            colorPrimaryBg,
        },
    } = theme.useToken();

    return (
        <Layout style={{ background: colorPrimaryBg }}>
            <Button onClick={toggleReadOnly} style={{ marginBottom: 20 }}>
                {readOnly ? '可写入' : '只读'}
            </Button>
            {!readOnly && (
                <>
                    <Input
                        value={inputTape}
                        onChange={handleInputChange}
                        placeholder="请输入纸带内容"
                        style={{ marginBottom: 20 }}
                    />
                    <Button onClick={handleUpdateTape} type="primary">
                        更新纸带内容
                    </Button>
                </>
            )}
            <Row gutter={[8, 8]} style={{
                marginTop: 20,
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'center',
            }}>
                {tape.content.map((cell, i) => (
                    <Col key={i}>
                        <Input
                            value={cell}
                            readOnly
                            style={{
                                width: 50,
                                textAlign: 'center',
                                border: tape.heads.has(i) ? '2px solid red' : '1px solid black'
                            }}
                        />
                    </Col>
                ))}
            </Row>
            <Button onClick={() => onRemoveTape(index)} danger type="primary">移除纸带</Button>
        </Layout>
    );
};

export default TapeComponent;
