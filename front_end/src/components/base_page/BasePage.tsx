import NavPage from "../nav/NavPage.tsx";
import React, {useEffect, useState} from "react";
import {Layout, theme} from "antd";

const {Header, Content, Footer, Sider} = Layout;

interface BasePageProps {
    header: React.ReactNode;
    content: React.ReactNode;
}

const BasePage : React.FC<BasePageProps> = ({header, content}) => {
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        // 初始状态从 localStorage 读取
        const savedState = localStorage.getItem('siderCollapsed');
        return savedState !== null ? JSON.parse(savedState) : false;
    });

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    useEffect(() => {
        // 每次折叠状态改变时，更新 localStorage
        localStorage.setItem('siderCollapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    return (
        <Layout
            style={{
                minHeight: '100vh',
                borderRadius: borderRadiusLG,
                margin: '6px 6px',
            }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="demo-logo-vertical"/>
                <NavPage/>
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        margin: '8px 16px',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {header}
                </Header>

                <Content
                    style={{
                        margin: '0px 16px',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {content}
                    </div>
                </Content>

                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Algorithm Final Work ©{new Date().getFullYear()} Created by Wolala
                </Footer>
            </Layout>
        </Layout>
    );
};

export default BasePage;
