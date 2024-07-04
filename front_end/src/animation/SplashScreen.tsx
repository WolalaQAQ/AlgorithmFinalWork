import {motion} from 'framer-motion';
import {Button} from 'antd';
import React from "react";

interface SplashScreenProps {
    displayText: string;
    onFinished: () => void;
}

const SplashScreen : React.FC<SplashScreenProps> = ({ displayText, onFinished }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff' }}
        >
            <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2em', marginBottom: '20px'}}>{displayText}</div>
                    <Button type="primary" onClick={onFinished}>Get Started</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;