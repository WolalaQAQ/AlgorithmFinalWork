import {useState} from "react";
import {BinarySearchFSMClass, FSMHistory} from "./BinarySearchFSMClass.tsx";
import {TapeClass} from "../tape/TapeClass.tsx";

interface UseBinarySearchFSM {
    fsm: BinarySearchFSMClass;
    configureTape: (inputTape: TapeClass) => void;
    reset: () => void;
    calcHistory: () => FSMHistory;
}

const useBinarySearchFSM = (): UseBinarySearchFSM => {
    const [fsm, setFSM] = useState(new BinarySearchFSMClass());

    const configureTape = (inputTape: TapeClass) => {
        fsm.configureTape(inputTape);
        setFSM(fsm);
    };

    const reset = () => {
        fsm.reset();
        setFSM(fsm);
    };

    const calcHistory = () => {
        const fsm_history = fsm.calcHistory();
        setFSM(fsm);
        return fsm_history;
    };

    return {fsm, configureTape, reset, calcHistory};
}

export default useBinarySearchFSM;