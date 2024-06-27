import Tape from "./tape/Tape.jsx";
import BasePage from "../base_class/BasePage.jsx";

const TuringMachinePage = () => {
    const header = (
        <h1>图灵机仿真</h1>
    );

    const content = (
        <div>
            图灵机
        </div>
    );

    return (
        <div>
            <BasePage header={header} content={content} />
        </div>
    );
};

export default TuringMachinePage;
