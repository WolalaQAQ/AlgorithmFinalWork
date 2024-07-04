import React, {useEffect, useState} from "react";
import {Button, Card, List, Typography} from "antd";
import {RecursiveStackObject} from "@class/recursive_function/recursive_stack/RecursiveStackClass.tsx";

interface RecursiveStackComponentProps {
    onSize: () => number;
    onClear: () => void;
    stack: RecursiveStackObject[]; // 添加一个方法来获取整个栈
}

const RecursiveStackComponent: React.FC<RecursiveStackComponentProps> = ({
                                                                             onSize,
                                                                             stack,
                                                                         }) => {
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
                        binarySearch({item.low}, {item.high})
                    </List.Item>
                )}
                style={{marginTop: 20}}
            />
        </Card>
    );
};

export default RecursiveStackComponent;
