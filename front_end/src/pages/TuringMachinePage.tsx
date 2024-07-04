import BasePage from "@pages/BasePage";
import TuringMachine from "@components/turing_machine/TuringMachine";
import SplashScreen from "@animation/SplashScreen.tsx";
import {useEffect, useState} from "react";

const TuringMachinePage = () => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen displayText="Turing Machine" onFinished={() => setShowSplash(false)} />;
    }
    
    const header = (
        <h1>图灵机仿真</h1>
    );

    const content = (
        <div>
            <TuringMachine />
        </div>
    );

    return (
        <div>
            <BasePage header={header} content={content} />
        </div>
    );
};

export default TuringMachinePage;
