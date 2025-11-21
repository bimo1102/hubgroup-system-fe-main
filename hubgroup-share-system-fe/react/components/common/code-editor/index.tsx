import React, { useMemo, useRef } from 'react';
import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";
import { merge } from 'lodash';

type Props = EditorProps;
const CodeEditorComponent: React.FC<Props> = (props): React.ReactNode => {
    const editorRef = useRef();
    const editorProps = useMemo<EditorProps>(() => merge({
        options: {
            automaticLayout: true
        },
        defaultLanguage: 'json',
        width: '100%',
        height: '300px',
        theme: 'vs-dark',
    } as EditorProps,props),[props]);
    
    return (
        <React.Fragment>
            <Editor {...editorProps} />
        </React.Fragment>
    )
};

export default CodeEditorComponent;