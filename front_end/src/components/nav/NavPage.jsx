import {Menu} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {useState} from 'react';

import {
    HomeFilled,
    PrinterFilled,
    InteractionFilled,
} from "@ant-design/icons";

const NavPage = () => {
    const location = useLocation();
    const selectedKey = location.pathname;

    const items = [
        {
            key: "/",
            label: (
                <Link to="/">
                    主页面
                </Link>
            ),
            icon: <HomeFilled />,
        },
        {
            key: "/turing-machine",
            label: (
                <Link to="/turing-machine">
                    图灵机仿真系统
                </Link>
            ),
            icon: <PrinterFilled />,
        },
        {
            key: "/recursive-function",
            label: (
                <Link to="/recursive-function">
                    递归函数仿真系统
                </Link>
            ),
            icon: <InteractionFilled />,
        },
    ];

    return (
        <div>
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={items}
                theme={"dark"}
            >
            </Menu>
        </div>
    );
};

export default NavPage;
