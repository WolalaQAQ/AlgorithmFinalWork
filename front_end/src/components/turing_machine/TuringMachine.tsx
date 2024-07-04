// React
import {useState} from 'react';

// Ant Design
import {Alert, Button, Flex, Select, theme, Typography} from 'antd';
import {LeftOutlined, PlayCircleFilled, RightOutlined} from '@ant-design/icons';

// 纸带
import MultiTapeComponent from "@components/tape/MultiTapeComponent";
import useTapes from '@hooks/tape/useTapes';
import {TapeClass} from "@class/tape/TapeClass";

// 迭代二分搜索
import {IterativeBSSim, IterativeBSFSMStateEntry} from "@class/turing_machine/simulation/IterativeBSSim.tsx";

// 背包DP
import {KnapsackDPSim, KnapsackDPSimStateEntry} from "@class/turing_machine/simulation/KnapsackDPSim.tsx";

// 背包BB
import {KnapsackBBSim, KnapsackBBSimStateEntry} from "@class/turing_machine/simulation/KnapsackBBSim.tsx";

const TuringMachine = () => {
    const [alertMessage, setAlertMessage] = useState('');
    const [step, setStep] = useState(0);
    const {tapes, setTapes, addTape, removeTape, updateTapeContent, updateHeads} = useTapes([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [stateText, setStateText] = useState('');
    const options = [
        {value: 'binary_search', label: '二分搜索'},
        {value: 'knapsack_dp', label: '背包DP'},
        {value: 'knapsack_bb', label: '背包BB'},
    ];

    // 各个算法的历史状态记录
    const [bsHistory, setBsHistory] = useState<IterativeBSFSMStateEntry[]>([]);
    const [dpHistory, setDpHistory] = useState<KnapsackDPSimStateEntry[]>([]);
    const [bbHistory, setBbHistory] = useState<KnapsackBBSimStateEntry[]>([]);


    const handleSelectAlgorithm = (value: string) => {
        setSelectedAlgorithm(value);
        setStep(0);

        if (value === 'binary_search') {
            setTapes([
                new TapeClass([0, 9, 5, 0, 1, 2, 3, 4, 6, 7, 8, 9], new Set([0])),
                new TapeClass(),
                new TapeClass()
            ]);
            setBsHistory([]);
        } else if (value === 'knapsack_dp' || value === 'knapsack_bb') {
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
            setDpHistory([]);
        }
    }

    const updateTapes = (step: number) => {
        if (selectedAlgorithm === 'binary_search') {
            const current = bsHistory[step];
            const inputTape = current.BSFSMHistoryEntry.inputTape;
            const workTape = current.BSFSMHistoryEntry.workTape;
            const resultTape = current.BSFSMHistoryEntry.resultTape;
            updateTapeContent(0, inputTape.content);
            updateTapeContent(1, workTape.content);
            updateTapeContent(2, resultTape.content);
            updateHeads(0, inputTape.heads);
            updateHeads(1, workTape.heads);
            updateHeads(2, resultTape.heads);
        } else if (selectedAlgorithm === 'knapsack_dp') {
            const current = dpHistory[step];
            const capacityTape = current.KPFSMHistoryEntry.capacityTape;
            const itemsTape = current.KPFSMHistoryEntry.itemsTape;
            const dpTape = current.KPFSMHistoryEntry.dpTape;
            const resultTape = current.KPFSMHistoryEntry.resultTape;
            updateTapeContent(0, capacityTape.content);
            updateTapeContent(1, itemsTape.content);
            updateTapeContent(2, dpTape.content);
            updateTapeContent(3, resultTape.content);
            updateHeads(0, capacityTape.heads);
            updateHeads(1, itemsTape.heads);
            updateHeads(2, dpTape.heads);
            updateHeads(3, resultTape.heads);
        } else if (selectedAlgorithm === 'knapsack_bb') {
            const current = bbHistory[step];
            const capacityTape = current.KPBBFSMStateEntry.capacityTape;
            const itemsTape = current.KPBBFSMStateEntry.itemsTape;
            const boundTape = current.KPBBFSMStateEntry.queueTape;
            const resultTape = current.KPBBFSMStateEntry.resultTape;
            updateTapeContent(0, capacityTape.content);
            updateTapeContent(1, itemsTape.content);
            updateTapeContent(2, boundTape.content);
            updateTapeContent(3, resultTape.content);
            updateHeads(0, capacityTape.heads);
            updateHeads(1, itemsTape.heads);
            updateHeads(2, boundTape.heads);
            updateHeads(3, resultTape.heads);
        }
    }

    const handleRun = () => {
        if (selectedAlgorithm === 'binary_search') {
            if (tapes[0].content.length < 4) {
                setAlertMessage('请添加合法的纸带');
                return;
            }

            tapes[1] = new TapeClass();
            tapes[2] = new TapeClass();

            setAlertMessage('');
            const bsSim = new IterativeBSSim(tapes[0]);
            bsSim.run();
            setBsHistory(bsSim.getHistory());
            setStep(0);
        } else if (selectedAlgorithm === 'knapsack_dp') {
            if (tapes[0].content.length < 1 || tapes[1].content.length < 2 || tapes[1].content.length % 2 !== 0 || tapes[1].content.length < 2) {
                setAlertMessage('请添加合法的纸带');
                return;
            }

            setAlertMessage('');
            const dpSim = new KnapsackDPSim(tapes[0], tapes[1]);
            dpSim.run();
            setDpHistory(dpSim.getHistory());
            setStep(0);
        } else if (selectedAlgorithm === 'knapsack_bb') {
            if (tapes[0].content.length < 1 || tapes[1].content.length < 2 || tapes[1].content.length % 2 !== 0 || tapes[1].content.length < 2) {
                setAlertMessage('请添加合法的纸带');
                return;
            }

            setAlertMessage('');
            const fsm = new KnapsackBBSim(tapes[0], tapes[1]);
            fsm.run();
            setBbHistory(fsm.getHistory());
            setStep(0);
            // const bbSim = new KnapsackBBSim();
            // const res = bbSim.knapsackBranchAndBound([5, 15, 25, 27, 30], [12, 30, 44, 46, 50], 50);
            // console.log(res);
        }
    };

    const handleNextDisabled = () => {
        if (selectedAlgorithm === 'binary_search') {
            return(step === bsHistory.length - 1);
        } else if (selectedAlgorithm === 'knapsack_dp') {
            return(step === dpHistory.length - 1);
        } else if (selectedAlgorithm === 'knapsack_bb') {
            return (step === bbHistory.length - 1);
        }
        return true;
    }

    const handlePrevDisabled = () => {
        return step === 0;
    }

    const handleNextStep = () => {
        if (selectedAlgorithm === 'binary_search') {
            if (step < bsHistory.length - 1) {
                setStep(step + 1);
                updateTapes(step + 1);
                setStateText(bsHistory[step + 1].BSFSMHistoryEntry.state)
            }
        } else if (selectedAlgorithm === 'knapsack_dp') {
            if (step < dpHistory.length - 1) {
                setStep(step + 1);
                updateTapes(step + 1);
                setStateText(dpHistory[step + 1].KPFSMHistoryEntry.state)
            }
        } else if (selectedAlgorithm === 'knapsack_bb') {
            if (step < bbHistory.length - 1) {
                setStep(step + 1);
                updateTapes(step + 1);
                setStateText(bbHistory[step + 1].KPBBFSMStateEntry.state)
            }
        }
    };

    const handlePrevStep = () => {
        if (selectedAlgorithm === 'binary_search') {
            if (step > 0) {
                setStep(step - 1);
                updateTapes(step - 1);
                setStateText(bsHistory[step - 1].BSFSMHistoryEntry.state)
            }
        } else if (selectedAlgorithm === 'knapsack_dp') {
            if (step > 0) {
                setStep(step - 1);
                updateTapes(step - 1);
                setStateText(dpHistory[step - 1].KPFSMHistoryEntry.state)
            }
        } else if (selectedAlgorithm === 'knapsack_bb') {
            if (step > 0) {
                setStep(step - 1);
                updateTapes(step - 1);
                setStateText(bbHistory[step - 1].KPBBFSMStateEntry.state)
            }
        }
    };



    const {
        token: {colorBgContainer, borderRadiusLG},
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
                <Button onClick={handlePrevStep} disabled={handlePrevDisabled()} icon={<LeftOutlined/>}>
                    上一步
                </Button>
                <Button onClick={handleNextStep} disabled={handleNextDisabled()} icon={<RightOutlined/>}>
                    下一步
                </Button>
                <Select options={options} placeholder={'选择算法'} onSelect={handleSelectAlgorithm}/>
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
