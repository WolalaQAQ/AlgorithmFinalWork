import {useState} from "react";
import {RecursiveStackClass, RecursiveStackObject} from "@class/recursive_function/recursive_stack/RecursiveStackClass";

interface RecursiveStack {
    stackPush: (value: RecursiveStackObject) => void;
    stackPop: () => void;
    stackTop: () => RecursiveStackObject;
    stackSize: () => number;
    stackEmpty: () => boolean;
    stackClear: () => void;
    setStack: (newStack: RecursiveStackClass) => void;
    getInnerStack: () => RecursiveStackObject[];
}

export const useRecursiveStack = (): RecursiveStack => {
    const [stack, setStack] = useState(new RecursiveStackClass());

    const stackPush = (value: RecursiveStackObject) => {
        const newStack = stack.clone();
        newStack.push(value);
        setStack(newStack);
    };

    const stackPop = () => {
        const newStack = stack.clone();
        newStack.pop();
        setStack(newStack);
    };

    const stackTop = () => {
        return stack.top();
    };

    const stackSize = () => {
        return stack.size();
    };

    const stackEmpty = () => {
        return stack.empty();
    };

    const stackClear = () => {
        const newStack = new RecursiveStackClass();
        newStack.clear()
        setStack(newStack);
    };

    const getInnerStack = () => {
        return stack.clone().stack_;
    };

    return { stackPush, stackPop, stackTop, stackSize, stackEmpty, stackClear, setStack, getInnerStack };
};
