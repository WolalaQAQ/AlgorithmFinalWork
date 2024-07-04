import {Card, List, Typography} from "antd";
import {useEffect, useState} from "react";

interface RecursiveStackComponentProps<T> {
    onSize: () => number;
    onClear: () => void;
    stack: T[]; // 添加一个方法来获取整个栈
}

const getTypeName = <T,>(item: T): string => {
    if (item === null || item === undefined) {
        return 'unknown';
    }
    if (typeof item === 'object') {
        if ('low' in item && 'high' in item) {
            return 'RecursiveBSStackObject';
        } else if ('index' in item && 'remainingCapacity' in item) {
            return 'RecursiveKPStackObject';
        }

        return 'Object';
    }
    return typeof item;
};

const RecursiveStackComponent = <T,>({onSize, stack}:RecursiveStackComponentProps<T>) => {
    const [functionName, setFunctionName] = useState<string>('');

    useEffect(() => {
        if (stack.length > 0) {
            const typeName = getTypeName(stack[0]);
            if (typeName === 'RecursiveBSStackObject') {
                setFunctionName('BinarySearch');
            } else if (typeName === 'RecursiveKPStackObject') {
                setFunctionName('Knapsack');
            } else {
                setFunctionName(`Unknown Type with ${typeName}`);
            }
        } else {
            setFunctionName('Empty Stack');
        }
    }, [stack]);

    return (
        <Card title="递归栈" style={{width: 400, margin: "0 auto", marginTop: 20}}>
            <Typography.Text style={{display: "block", marginTop: 20}}>
                栈大小: {onSize()}
            </Typography.Text>
            <List
                header={<div>Stack Items</div>}
                bordered
                dataSource={[...stack].reverse()} // 反转数组以倒序显示
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        {functionName}({JSON.stringify(item)})
                    </List.Item>
                )}
                style={{marginTop: 20}}
            />
        </Card>
    );
};

export default RecursiveStackComponent;
