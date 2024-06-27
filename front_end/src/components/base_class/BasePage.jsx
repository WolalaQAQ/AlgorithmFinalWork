import NavPage from "../nav/NavPage.jsx";
import {useState} from "react";
import {Layout, theme} from "antd";
import PropTypes from "prop-types";

const {Header, Content, Footer, Sider} = Layout;

const BasePage = ({header, content}) => {
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

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

BasePage.propTypes = {
    header: PropTypes.element.isRequired,
    content: PropTypes.element.isRequired,
}