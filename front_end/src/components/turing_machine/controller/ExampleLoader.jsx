export const loadExamples = async (setExamples) => {
    const response = await fetch('http://localhost:5000/api/transitions');
    const files = await response.json();
    const categorizedExamples = { single: [], double: [], triple: [] };

    for (const file of files) {
        const res = await fetch(`http://localhost:5000/api/transitions/${file}`);
        const data = await res.json();
        if (data.tapeCount === 1) categorizedExamples.single.push(file);
        else if (data.tapeCount === 2) categorizedExamples.double.push(file);
        else if (data.tapeCount === 3) categorizedExamples.triple.push(file);
    }

    setExamples(categorizedExamples);
};

export const loadExample = async (exampleFile, setTransitions, setTapesAndInitialTapes, resetMachine) => {
    const response = await fetch(`http://localhost:5000/api/transitions/${exampleFile}`);
    const data = await response.json();
    setTransitions(data.transitions);
    const newTapes = data.initialTapes || Array.from({ length: data.tapeCount || 1 }, () => Array(7).fill('_'));
    setTapesAndInitialTapes(newTapes);
    resetMachine();
    return data;
};
