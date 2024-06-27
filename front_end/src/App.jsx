import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/home/HomePage.jsx';
import TuringMachinePage from './components/turing_machine/TuringMachinePage';
import RecursiveFunctionPage from './components/recursive_function/RecursiveFunctionPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/turing-machine" element={<TuringMachinePage />} />
                <Route path="/recursive-function" element={<RecursiveFunctionPage />} />
            </Routes>
        </Router>
    );
}

export default App;
