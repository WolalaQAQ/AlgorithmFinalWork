import BasePage from "@pages/BasePage.tsx";
import {useEffect, useState} from "react";
import SplashScreen from "@animation/SplashScreen";
import RecursiveFunction from "@components/recursive_function/RecursiveFunction";

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
        <RecursiveFunction />
    );

    return (
        <div>
            <BasePage header={header} content={content} />
        </div>
    );
};

export default RecursiveFunctionPage;
