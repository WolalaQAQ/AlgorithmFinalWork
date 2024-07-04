import {useState} from 'react';
import {Alert, Button, Flex, theme, Typography} from 'antd';
import MultiTapeComponent from "@components/tape/MultiTapeComponent";
import useTapes from '@hooks/tape/useTapes';
import {TapeClass} from "@class/tape/TapeClass";
import {IterativeBNSim} from "@class/turing_machine/simulation/IterativeBNSim.tsx";
import {IterativeBSFSMStateEntry} from "@class/turing_machine/simulation/IterativeBNSim.tsx";
import {LeftOutlined, PlayCircleFilled, RightOutlined} from '@ant-design/icons';

const TuringMachine = () => {
    const [alertMessage, setAlertMessage] = useState('');
    const [step, setStep] = useState(0);
    const [fsmHistory, setFsmHistory] = useState<IterativeBSFSMStateEntry[]>([]);
    const {tapes, addTape, removeTape, updateTapeContent, updateHeads} = useTapes([
        new TapeClass([0, 9, 5, 0, 1, 2, 3, 4, 6, 7, 8, 9], new Set([0])),
        new TapeClass(),
        new TapeClass(),
    ]);

    const updateTapes = (step: number) => {
        const current = fsmHistory[step];
        const inputTape = current.BSFSMHistoryEntry.inputTape;
        const workTape = current.BSFSMHistoryEntry.workTape;
        const resultTape = current.BSFSMHistoryEntry.resultTape;

        updateTapeContent(0, inputTape.content);
        updateTapeContent(1, workTape.content);
        updateTapeContent(2, resultTape.content);

        updateHeads(0, inputTape.heads);
        updateHeads(1, workTape.heads);
        updateHeads(2, resultTape.heads);
    }

    const handleRun = () => {
        if (tapes[0].content.length < 4) {
            setAlertMessage('请添加合法的纸带');
            return;
        }
        while (tapes.length > 3) {
            removeTape(tapes.length - 1);
        }
        while (tapes.length < 3) {
            addTape();
        }

        tapes[1] = new TapeClass();
        tapes[2] = new TapeClass();

        setAlertMessage('');
        const fsm = new IterativeBNSim(tapes[0]);
        fsm.run();
        setFsmHistory(fsm.getHistory());
        setStep(0);
    };

    const handleNextStep = () => {
        if (step < Object.keys(fsmHistory).length - 1) {
            setStep(step + 1);
            updateTapes(step + 1);
        }
    };

    const handlePrevStep = () => {
        if (step > 0) {
            setStep(step - 1);
            updateTapes(step - 1);
        }
    };

    const {
        token: {colorPrimaryBg, colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Flex vertical={true} justify={'space-around'} gap={'large'}
              style={{
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
              }}
        >
            <MultiTapeComponent
                tapes={tapes}
                onAddTape={addTape}
                onRemoveTape={removeTape}
                onUpdateTapeContent={updateTapeContent}
                onUpdateHeads={updateHeads}/>
            <Button onClick={handleRun} type="primary" icon={<PlayCircleFilled/>}>
                运行
            </Button>
            <Flex gap={'large'} justify={'center'} align={'center'}>
                <Button onClick={handlePrevStep} disabled={step === 0} icon={<LeftOutlined />}>
                    上一步
                </Button>
                <Button onClick={handleNextStep} disabled={step >= Object.keys(fsmHistory).length - 1} icon={<RightOutlined />}>
                    下一步
                </Button>
            </Flex>
            <Flex justify={'center'} vertical={true} align={'center'}
                  style={{
                      background: colorBgContainer,
                      borderRadius: borderRadiusLG,
                  }}>
                <Typography.Title level={4}>Step: {step}</Typography.Title>
                <Typography.Text>
                    {fsmHistory[step] && fsmHistory[step].BSFSMHistoryEntry.state}
                </Typography.Text>
            </Flex>
            {alertMessage && (
                <Alert
                    message="错误"
                    type="error"
                    showIcon
                    description={alertMessage}
                    closable
                    afterClose={() => setAlertMessage('')}
                />
            )}
        </Flex>
    );
};

export default TuringMachine;
