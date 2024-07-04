import {useRecursiveStack} from "@hooks/recursive_function/recursive_stack/useRecursiveStack.tsx";
import RecursiveStackComponent from "@components/recursive_function/recursive_stack/RecursiveStackComponent";
import {Button, Flex, theme, Typography} from "antd";
import useTapes from "@hooks/tape/useTapes";
import MultiTapeComponent from "@components/tape/MultiTapeComponent";
import {useState} from "react";
import {RecursiveBSSim, RecursiveBNSimStateEntry} from "@class/recursive_function/simulation/RecursiveBSSim.tsx";
import {LeftOutlined, PlayCircleFilled, RightOutlined} from "@ant-design/icons";
import {TapeClass} from "@class/tape/TapeClass.tsx";

const RecursiveFunction = () => {
    const {getInnerStack, stackSize, stackClear, setStack} = useRecursiveStack();
    const {tapes, addTape, removeTape, updateTapeContent, updateHeads} = useTapes([
        new TapeClass([0, 9, 5, 0, 1, 2, 3, 4, 6, 7, 8, 9, 10], new Set([0])),
        new TapeClass(),
        new TapeClass(),
    ]);

    const [simHistory, setSimHistory] = useState<RecursiveBNSimStateEntry[]>([]);
    const [step, setStep] = useState(0);

    const updateVisualization = (step: number) => {
        const current = simHistory[step];
        setStack(current.stack);
        updateTapeContent(0, current.BSFSMStateEntry.inputTape.content);
        updateTapeContent(1, current.BSFSMStateEntry.workTape.content);
        updateTapeContent(2, current.BSFSMStateEntry.resultTape.content);
        updateHeads(0, current.BSFSMStateEntry.inputTape.heads);
        updateHeads(1, current.BSFSMStateEntry.workTape.heads);
        updateHeads(2, current.BSFSMStateEntry.resultTape.heads);
    }

    const handleRun = () => {
        while (tapes.length > 3) {
            removeTape(tapes.length - 1);
        }
        while (tapes.length < 3) {
            addTape();
        }

        tapes[1] = new TapeClass();
        tapes[2] = new TapeClass();

        const sim = new RecursiveBSSim(tapes[0]);
        sim.run();
        setSimHistory(sim.getHistory());
        setStep(0);
    }

    const handlePrevStep = () => {
        if (step > 0) {
            setStep(step - 1);
            updateVisualization(step - 1);
        }
    }

    const handleNextStep = () => {
        if (step < simHistory.length - 1) {
            setStep(step + 1);
            updateVisualization(step + 1);
        }
    }

    const {
        token: {colorPrimaryBg, colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Flex gap={'large'} justify={'center'}>
            <Flex vertical={true} gap={'small'}>
                <MultiTapeComponent
                    tapes={tapes}
                    onAddTape={addTape}
                    onUpdateTapeContent={updateTapeContent}
                    onUpdateHeads={updateHeads}
                    onRemoveTape={removeTape}
                />
                <Button onClick={handleRun} type="primary" icon={<PlayCircleFilled/>}>
                    运行
                </Button>
                <Flex gap={'large'} justify={'center'} align={'center'}>
                    <Button onClick={handlePrevStep} disabled={step === 0} icon={<LeftOutlined/>}>
                        上一步
                    </Button>
                    <Button onClick={handleNextStep} disabled={step >= simHistory.length - 1} icon={<RightOutlined/>}>
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
                        {simHistory[step] && simHistory[step].BSFSMStateEntry.state}
                    </Typography.Text>
                </Flex>
            </Flex>
            <RecursiveStackComponent
                stack={getInnerStack()}
                onSize={stackSize}
                onClear={stackClear}
            />
        </Flex>

    );
};

export default RecursiveFunction;
