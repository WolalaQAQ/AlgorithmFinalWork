// React
import {useState} from "react";

// Ant Design
import {Button, Flex, Select, theme, Typography} from "antd";
import {LeftOutlined, PlayCircleFilled, RightOutlined} from "@ant-design/icons";

// 纸带
import {TapeClass} from "@class/tape/TapeClass.tsx";
import useTapes from "@hooks/tape/useTapes";
import MultiTapeComponent from "@components/tape/MultiTapeComponent";

// 递归栈
import {useRecursiveStack} from "@hooks/recursive_function/recursive_stack/useRecursiveStack.tsx";
import RecursiveStackComponent from "@components/recursive_function/recursive_stack/RecursiveStackComponent";

// 递归二分查找
import {RecursiveBSSim, RecursiveBSSimStateEntry} from "@class/recursive_function/simulation/RecursiveBSSim.tsx";

// 背包：递归备忘录
import {MemoizationKPSim, MemoizationKPSimStateEntry} from "@class/recursive_function/simulation/MemoizationKPSim.tsx";

// 背包：回溯
import {BacktrackKPSim, BacktrackKPSimStateEntry} from "@class/recursive_function/simulation/BacktrackKPSim.tsx";


const RecursiveFunction = () => {
    const {getInnerStack, stackSize, stackClear, setStack} = useRecursiveStack();
    const {tapes, setTapes, addTape, removeTape, updateTapeContent, updateHeads} = useTapes([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [stateText, setStateText] = useState('');
    const [step, setStep] = useState(0);
    const options = [
        {label: '递归二分查找', value: 'recursive_bs'},
        {label: '背包：备忘录递归', value: 'memoization_kp'},
        {label: '背包：回溯', value: 'backtrack_kp'},
    ]

    // 各个算法的历史状态记录
    const [bsHistory, setBsHistory] = useState<RecursiveBSSimStateEntry[]>([]);
    const [memoHistory, setMemoHistory] = useState<MemoizationKPSimStateEntry[]>([]);
    const [btHistory, setBtHistory] = useState<BacktrackKPSimStateEntry[]>([]);

    const handleSelectAlgorithm = (value: string) => {
        setSelectedAlgorithm(value);
        setStep(0);

        if (value === 'recursive_bs') {
            setTapes([
                new TapeClass([0, 9, 5, 0, 1, 2, 3, 4, 6, 7, 8, 9], new Set([0])),
                new TapeClass(),
                new TapeClass()
            ]);
            setBsHistory([]);
        } else if (value === 'memoization_kp') {
            setTapes([
                new TapeClass([50]),
                new TapeClass([
                    5, 12,
                    15, 30,
                    25, 44,
                    27, 46,
                    30, 50
                ]),
                new TapeClass(),
                new TapeClass()
            ]);
            setMemoHistory([]);
        } else if (value === 'backtrack_kp') {
            setTapes([
                new TapeClass([50]),
                new TapeClass([
                    5, 12,
                    15, 30,
                    25, 44,
                    27, 46,
                    30, 50
                ]),
                new TapeClass()
            ]);
            setBtHistory([]);
        }
    }

    const updateVisualization = (step: number) => {
        if (selectedAlgorithm === 'recursive_bs') {
            const current = bsHistory[step];
            setStack(current.stack);
            updateTapeContent(0, current.BSFSMStateEntry.inputTape.content);
            updateTapeContent(1, current.BSFSMStateEntry.workTape.content);
            updateTapeContent(2, current.BSFSMStateEntry.resultTape.content);
            updateHeads(0, current.BSFSMStateEntry.inputTape.heads);
            updateHeads(1, current.BSFSMStateEntry.workTape.heads);
            updateHeads(2, current.BSFSMStateEntry.resultTape.heads);
        } else if (selectedAlgorithm === 'memoization_kp') {
            const current = memoHistory[step];
            setStack(current.stack);
            updateTapeContent(0, current.MemoizationKPFSMStateEntry.capacityTape.content);
            updateTapeContent(1, current.MemoizationKPFSMStateEntry.itemsTape.content);
            updateTapeContent(2, current.MemoizationKPFSMStateEntry.memoTape.content);
            updateTapeContent(3, current.MemoizationKPFSMStateEntry.resultTape.content);
            updateHeads(0, current.MemoizationKPFSMStateEntry.capacityTape.heads);
            updateHeads(1, current.MemoizationKPFSMStateEntry.itemsTape.heads);
            updateHeads(2, current.MemoizationKPFSMStateEntry.memoTape.heads);
            updateHeads(3, current.MemoizationKPFSMStateEntry.resultTape.heads);
        } else if (selectedAlgorithm === 'backtrack_kp') {
            const current = btHistory[step];
            setStack(current.stack);
            updateTapeContent(0, current.BacktrackKPFSMStateEntry.capacityTape.content);
            updateTapeContent(1, current.BacktrackKPFSMStateEntry.itemsTape.content);
            updateTapeContent(2, current.BacktrackKPFSMStateEntry.resultTape.content);
            updateHeads(0, current.BacktrackKPFSMStateEntry.capacityTape.heads);
            updateHeads(1, current.BacktrackKPFSMStateEntry.itemsTape.heads);
            updateHeads(2, current.BacktrackKPFSMStateEntry.resultTape.heads);
        }
    }

    const handleRun = () => {
        if (selectedAlgorithm === 'recursive_bs') {
            tapes[1] = new TapeClass();
            tapes[2] = new TapeClass();

            const sim = new RecursiveBSSim(tapes[0]);
            sim.run();
            setBsHistory(sim.getHistory());
            setStep(0);
        } else if (selectedAlgorithm === 'memoization_kp') {
            tapes[2] = new TapeClass();
            tapes[3] = new TapeClass();

            const sim = new MemoizationKPSim(tapes[0], tapes[1]);
            sim.run();
            setMemoHistory(sim.getHistory());
            setStep(0);
        } else if (selectedAlgorithm === 'backtrack_kp') {
            tapes[2] = new TapeClass();

            const sim = new BacktrackKPSim(tapes[0], tapes[1]);
            sim.run();
            setBtHistory(sim.getHistory());
            setStep(0);
        }
    }

    const handleNextStep = () => {
        if (selectedAlgorithm === 'recursive_bs') {
            if (step < bsHistory.length - 1) {
                setStep(step + 1);
                updateVisualization(step + 1);
                setStateText(bsHistory[step + 1].BSFSMStateEntry.state)
            }
        } else if (selectedAlgorithm === 'memoization_kp') {
            if (step < memoHistory.length - 1) {
                setStep(step + 1);
                updateVisualization(step + 1);
                setStateText(memoHistory[step + 1].MemoizationKPFSMStateEntry.state)
            }
        } else if (selectedAlgorithm === 'backtrack_kp') {
            if (step < btHistory.length - 1) {
                setStep(step + 1);
                updateVisualization(step + 1);
                setStateText(btHistory[step + 1].BacktrackKPFSMStateEntry.state)
            }
        }
    };

    const handlePrevStep = () => {
        if (selectedAlgorithm === 'recursive_bs') {
            if (step > 0) {
                setStep(step - 1);
                updateVisualization(step - 1);
                setStateText(bsHistory[step - 1].BSFSMStateEntry.state)
            }
        } else if (selectedAlgorithm === 'memoization_kp') {
            if (step > 0) {
                setStep(step - 1);
                updateVisualization(step - 1);
                setStateText(memoHistory[step - 1].MemoizationKPFSMStateEntry.state)
            }
        } else if (selectedAlgorithm === 'backtrack_kp') {
            if (step > 0) {
                setStep(step - 1);
                updateVisualization(step - 1);
                setStateText(btHistory[step - 1].BacktrackKPFSMStateEntry.state)
            }
        }
    };

    const handleNextDisabled = () => {
        if (selectedAlgorithm === 'recursive_bs') {
            return(step === bsHistory.length - 1);
        } else if (selectedAlgorithm === 'memoization_kp') {
            return(step === memoHistory.length - 1);
        } else if (selectedAlgorithm === 'backtrack_kp') {
            return(step === btHistory.length - 1);
        }
        return true;
    }

    const handlePrevDisabled = () => {
        return step === 0;
    }

    const {
        token: { colorBgContainer, borderRadiusLG},
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
                <Select options={options} placeholder={'选择算法'} onSelect={handleSelectAlgorithm}/>
                <Flex gap={'large'} justify={'center'} align={'center'}>
                    <Button onClick={handlePrevStep} disabled={handlePrevDisabled()} icon={<LeftOutlined/>}>
                        上一步
                    </Button>
                    <Button onClick={handleNextStep} disabled={handleNextDisabled()} icon={<RightOutlined/>}>
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
                        {step !== 0 && stateText}
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
