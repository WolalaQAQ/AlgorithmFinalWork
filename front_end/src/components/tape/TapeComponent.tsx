import React, {useState} from 'react';
import {Button, Col, Flex, Input, Row, theme} from 'antd';
import {TapeClass} from "@class/tape/TapeClass.tsx";
import {DeleteFilled, EditFilled, FileTextFilled, SaveOutlined} from '@ant-design/icons';

interface TapeComponentProps {
    tape: TapeClass;
    index: number;
    onUpdateTapeContent: (index: number, content: number[]) => void;
    onUpdateHeads: (index: number, heads: Set<number>) => void;
    onRemoveTape: (index: number) => void;
}

const TapeComponent: React.FC<TapeComponentProps> = ({
                                                         tape,
                                                         index,
                                                         onUpdateTapeContent,
                                                         onUpdateHeads,
                                                         onRemoveTape
                                                     }) => {
    const [inputTape, setInputTape] = useState(tape.content.join(','));
    const [readOnly, setReadOnly] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            borderRadiusLG,
        },
    } = theme.useToken();

    return (
        <Flex gap={"small"} vertical={true}
              style={{background: colorPrimaryBg, borderRadius: borderRadiusLG, padding: '20px'}}>
            <Flex gap={"small"} vertical={false}>
                <Button onClick={toggleReadOnly} icon={readOnly ? <FileTextFilled/> : <EditFilled/>}>
                    {readOnly ? '只读' : '可写入'}
                </Button>
                {!readOnly && (
                    <>
                        <Input
                            value={inputTape}
                            onChange={handleInputChange}
                            placeholder="请输入纸带内容"
                        />
                        <Button onClick={handleUpdateTape} type="primary" icon={<SaveOutlined />}>
                            更新纸带内容
                        </Button>
                        <Button onClick={() => onRemoveTape(index)} danger type="primary" icon={<DeleteFilled/>}
                                shape={"round"}>
                            移除纸带
                        </Button>
                    </>
                )}

            </Flex>
            <Flex gap={"small"} vertical={true} justify={'center'}>
                <Row gutter={[8, 8]} style={{
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
            </Flex>
        </Flex>
    );
};

export default TapeComponent;
