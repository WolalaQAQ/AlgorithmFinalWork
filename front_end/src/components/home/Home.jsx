import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Simulation Systems</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/turing-machine">Turing Machine Simulation</Link>
                    </li>
                    <li>
                        <Link to="/recursive-function">Recursive Function Simulation</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;
