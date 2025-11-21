import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { merge } from 'lodash';

type Props = IAllProps;

const EditorComponent: React.FC<Props> = (props): React.ReactNode => {
    const editorRef = useRef<any>(null);
    const mergeProps = useMemo(
        () =>
            merge(
                {
                    licenseKey: 'gpl',
                    tinymceScriptSrc: '/assets/plugins/tinymce/tinymce.min.js',
                    init: {
                        height: 400,
                        width: '100%',
                        language_url: `/assets/plugins/tinymce/langs/vi.js`,
                        language: 'vi',
                        branding: false,
                        promotion: false,
                        // onboarding: false,
                        paste_preprocess: (plugin: any, args: any) => {
                            let content = args.content;
                            content = content.replace(/<p>\s*<\/p>/g, '');
                            var ua = navigator.userAgent.toLowerCase();
                            if (ua.indexOf('safari') <= -1) {
                                content = content.replace(/\s*<br \/>/g, '');
                                content = content.replace(/\s*<br\/>/g, '');
                            }
                            args.content = content;
                        },
                        sandbox_iframes: false,
                        // referrer_policy: 'origin',
                        invalid_styles: {
                            '*': 'font-family font-size',
                        },
                        valid_elements: '*[*]',
                        valid_child_elements: '*[*]',
                        relative_urls: false,
                        allow_unsafe_link_target: true,
                        extended_valid_elements: 'summary[class|style]',
                        custom_elements: 'summary',
                        paste_as_text: true,
                        textpattern_patterns: [
                            { start: '*', end: '*', format: 'italic' },
                            { start: '**', end: '**', format: 'bold' },
                            { start: '#', format: 'h1' },
                            { start: '##', format: 'h2' },
                            { start: '###', format: 'h3' },
                            { start: '####', format: 'h4' },
                            { start: '#####', format: 'h5' },
                            { start: '######', format: 'h6' },
                        ],
                        importcss_append: true,
                        image_caption: true,
                        quickbars_selection_toolbar:
                            'bold italic underline strikethrough | link ',
                        quickbars_insert_toolbar: false,
                        noneditable_noneditable_class:
                            'tyt-template-noneditable',
                        noneditable_editable_class: 'tyt-template-editable',
                        skin: 'oxide',
                        highlight_on_focus: true,
                        base_url: '/assets/plugins/tinymce',
                    },
                } as IAllProps,
                props
            ),
        [props]
    );

    return (
        <React.Fragment>
            <Editor
                {...mergeProps}
                onEditorChange={(content, editor) => {
                    props.onEditorChange?.(content, editor);
                }}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    props.onInit?.(evt, editor);
                }}
                initialValue={''}
            />
        </React.Fragment>
    );
};

export default React.memo(EditorComponent);
