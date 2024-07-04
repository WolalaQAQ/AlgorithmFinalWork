import React from 'react';
import { Button, Flex } from 'antd';
import TapeComponent from './TapeComponent';
import {PlusCircleOutlined} from "@ant-design/icons";
import {TapeClass} from "@class/tape/TapeClass.tsx";

interface MultiTapeComponentProps {
    tapes: TapeClass[];
    onAddTape: () => void;
    onUpdateTapeContent: (index: number, content: number[]) => void;
    onUpdateHeads: (index: number, heads: Set<number>) => void;
    onRemoveTape: (index: number) => void;
}

const MultiTapeComponent: React.FC<MultiTapeComponentProps> = ({tapes, onAddTape, onUpdateTapeContent, onUpdateHeads, onRemoveTape}) => {

    return (
        <Flex gap={"middle"} vertical={true} style={{
            padding: '16px',
        }}>
            <Button onClick={onAddTape} icon={<PlusCircleOutlined/>}>
                添加纸带
            </Button>
            {tapes.map((tape, index) => (
                <TapeComponent
                    key={index}
                    tape={tape}
                    index={index}
                    onUpdateTapeContent={onUpdateTapeContent}
                    onUpdateHeads={onUpdateHeads}
                    onRemoveTape={onRemoveTape}
                />
            ))}
        </Flex>
    );
};

export default MultiTapeComponent;
