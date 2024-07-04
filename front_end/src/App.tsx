import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from '@pages/HomePage'
import TuringMachinePage from '@pages/TuringMachinePage';
import RecursiveFunctionPage from '@pages/RecursiveFunctionPage';

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
