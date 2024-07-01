import BasePage from "../base_page/BasePage.tsx";
import SplashScreen from "../animation/SplashScreen.tsx";
import {useEffect, useState} from "react";

const HomePage = () => {
    const [showSplash, setShowSplash] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen displayText="Welcome to Algorithm Finalwork!" onFinished={() => setShowSplash(false)} />;
    }

    const header = (
        <h1>主页</h1>
    );

    const content = (
        <div>
            <h2>简介</h2>
            <p>这是算法课期末作业的主页</p>
            <h2>功能</h2>
            <p>这个网站包含了以下功能：</p>
            <ul>
                <li>图灵机模拟器</li>
                <li>递归函数模拟器</li>
            </ul>
            <h2>使用</h2>
            <p>请点击左侧导航栏的链接以使用功能</p>
        </div>
    );

    return (
        <BasePage header={header} content={content} />
    );
};

export default HomePage;