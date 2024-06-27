import BasePage from "../base_class/BasePage.jsx";

const RecursiveFunctionPage = () => {
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
