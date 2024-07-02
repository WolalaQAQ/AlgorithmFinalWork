import {useState} from 'react';
import {Alert, Button, Layout, Row, theme} from 'antd';
import TapeComponent from '../tape/TapeComponent.js';

import useTapes from '../tape/useTapes.js';
import useIterativeBSFSM from "./fsm/useIterativeBSFSM.tsx";
import {TapeClass} from "../tape/TapeClass.tsx";
import {FSMHistory} from "./fsm/IterativeBSFSMClass.tsx";

const TuringMachine = () => {
    const [alertMessage, setAlertMessage] = useState('');
    const [step, setStep] = useState(0);
    const [fsmHistory, setFsmHistory] = useState<FSMHistory>({});
    const {tapes, addTape, removeTape, updateTapeContent, updateHeads} = useTapes([
        new TapeClass([0, 9, 7, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], new Set([0])),
        new TapeClass(),
        new TapeClass(),
    ]);
    const {fsm, configureTape, reset, calcHistory} = useIterativeBSFSM();

    const updateTapes = (step: number) => {
        const current = fsmHistory[step];
        const inputTape = current.inputTape;
        const workTape = current.workTape;
        const resultTape = current.resultTape;

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
        configureTape(tapes[0]);
        setFsmHistory(calcHistory());
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
        <Layout
            style={{
                padding: 20,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
        >
            <Button onClick={addTape} style={{marginBottom: 20, marginTop: 20}}>
                添加纸带
            </Button>
            {tapes.map((tape, index) => (
                <Layout
                    key={index}
                    style={{
                        background: colorPrimaryBg,
                        padding: 20,
                        borderRadius: borderRadiusLG,
                        marginBottom: 16,
                    }}
                >
                    <TapeComponent
                        tape={tape}
                        index={index}
                        onUpdateTapeContent={updateTapeContent}
                        onUpdateHeads={updateHeads}
                        onRemoveTape={removeTape}
                    />
                </Layout>
            ))}
            <Button onClick={handleRun} type="primary" style={{marginBottom: 20}}>
                运行
            </Button>
            <Row gutter={16} justify="center" align="middle">
                <Button onClick={handlePrevStep} disabled={step === 0}>
                    上一步
                </Button>
                <Button onClick={handleNextStep} disabled={step >= Object.keys(fsmHistory).length - 1}>
                    下一步
                </Button>
            </Row>
            <Layout style={{
                padding: 20,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                当前步数: {step}
                <br/>
                当前状态: {fsmHistory[step]?.state}
            </Layout>
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
        </Layout>
    );
};

export default TuringMachine;
