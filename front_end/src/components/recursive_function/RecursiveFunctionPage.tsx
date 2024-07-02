import BasePage from "../base_page/BasePage.tsx";
import {useEffect, useState} from "react";
import SplashScreen from "../animation/SplashScreen.tsx";

const RecursiveFunctionPage = () => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen displayText="Recursive Function" onFinished={() => setShowSplash(false)} />;
    }

    const header = (
        <h1>递归函数仿真</h1>
    );

    const content = (
        <div>
            递归函数
        </div>
    );

    return (
        <div>
            <BasePage header={header} content={content} />
        </div>
    );
};

export default RecursiveFunctionPage;
