import {useState} from "react";
import {IterativeBSFSMClass, FSMHistory} from "./IterativeBSFSMClass.tsx";
import {TapeClass} from "../../tape/TapeClass.tsx";

interface UseIterativeBSFSM {
    fsm: IterativeBSFSMClass;
    configureTape: (inputTape: TapeClass) => void;
    reset: () => void;
    calcHistory: () => FSMHistory;
}

const useIterativeBSFSM = (): UseIterativeBSFSM => {
    const [fsm, setFSM] = useState(new IterativeBSFSMClass());

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

export default useIterativeBSFSM;