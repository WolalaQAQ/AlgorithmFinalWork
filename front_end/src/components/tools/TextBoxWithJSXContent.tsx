import React, {useState, useEffect} from 'react';
import {Input} from "antd";

const { TextArea } = Input;

interface TextBoxWithJSXContentProps {
    filePath: string;
}

const TextBoxWithJSXContent : React.FC<TextBoxWithJSXContentProps> = ({filePath}) => {
    const [fileContent, setFileContent] = useState<string>('');

    useEffect(() => {
        import(/* @vite-ignore */ `${filePath}?raw`)
            .then(module => {
                setFileContent(module.default);
                console.log('Loaded file:', filePath)
            })
            .catch(err => {
                console.error('Failed to load file:', err);
            });
    }, [filePath]);

    return (
        <TextArea
            readOnly
            value={fileContent}
            style={{
                fontFamily: 'monospace',
            }}
            autoSize={{maxRows: 25}}
        />
    );
};

export default TextBoxWithJSXContent;
