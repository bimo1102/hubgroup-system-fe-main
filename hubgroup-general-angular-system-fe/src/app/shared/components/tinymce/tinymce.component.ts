import { environment } from 'src/environments/environment';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { ModuleBaseComponent } from '../../base-components/module-base-component';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../common.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EditorModeEnum } from '@hubgroup-share-system-fe/enums/common.enum';
import { NewsOnlineAddOrChangeModelClient } from '@hubgroup-share-system-fe/types/news-online-client.type';
import {
    FileSystemTypeEnum,
    FolderTypeEnum,
} from '@hubgroup-share-system-fe/enums/file-manager.enum';
import { AngularEnvironmentService, AngularSharedService } from 'nexussoft-angular-shared';

@Component({
    selector: 'app-news-tyt-editor',
    templateUrl: './tinymce.component.html',
})
export class TinyMceEditorWrapperComponent extends ModuleBaseComponent implements OnInit {
    constructor(
        cdr: ChangeDetectorRef,
        translate: TranslateService,
        commonService: CommonService,
        modalService: NzModalService,
        messageService: NzMessageService,
        angularSharedService: AngularSharedService,
        private angularEnvironmentService: AngularEnvironmentService
    ) {
        super(cdr, translate, commonService, modalService, messageService, angularSharedService);
    }

    editor: EditorComponent['editor'];

    @HostBinding('class.w-100')
    @Input()
    value?: string;
    @Output() valueChange = new EventEmitter<any>();

    @Input() mode: EditorModeEnum = EditorModeEnum.Default;

    @Input() viewportTopOffset: number = this.responsive.isDesktop ? 60 : 0;
    @Input() height: number = 600;
    @Input() inline: boolean = false;
    @Input() sticky: boolean = true;
    @Input() disabled: boolean = false;

    @Input() isEditorInModal: boolean = false;
    @Input() isModalAfterOpen: boolean = false;

    @Input() newsModel: Partial<NewsOnlineAddOrChangeModelClient> = {};
    @Input() isTemplatePodcastNotificationDisplayedChange: EventEmitter<boolean>;

    private readonly TINYMCE_TOOL_BAR_TEXT_MODE = [
        'bullist numlist outdent indent link forecolor backcolor table blocks',
        'undo redo | vFistText | bold italic underline | alignleft aligncenter alignright alignjustify',
    ];

    private readonly TINYMCE_TOOL_BAR_SIMPLE_TEXT_MODE = [
        'undo redo | outdent indent | link | fullscreen | forecolor backcolor',
        'blocks | vFistText bold italic underline | alignleft aligncenter alignright alignjustify',
    ];

    private readonly TINYMCE_TOOL_BAR_COMMENT_MODE = [
        'undo redo searchreplace | bold italic underline strikethrough | emoticons',
    ];

    embedDomainUrl = '';
    private readonly baseUrl = environment.origin + environment.baseHref;

    editorSettings: NonNullable<EditorComponent['init']> = {
        license_key: 'gpl',
        height: this.height,
        width: '100%',
        plugins:
            'noneditable preview importcss searchreplace autolink save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists help charmap quickbars',
        menu: {
            file: {
                title: 'File',
                items: 'newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations',
            },
            edit: {
                title: 'Edit',
                items: 'undo redo | cut copy paste pastetext | selectall | searchreplace',
            },
            view: {
                title: 'View',
                items: 'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments',
            },
            insert: {
                title: 'Insert',
                items: 'image vPanorama link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime',
            },
            format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat',
            },
            tools: {
                title: 'Tools',
                items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount',
            },
            table: {
                title: 'Table',
                items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
            },
            help: { title: 'Help', items: 'help' },
        },

        toolbar: [],
        toolbar_sticky: this.sticky,
        toolbar_sticky_offset: this.viewportTopOffset,

        importcss_append: true,
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic underline strikethrough | link ',
        quickbars_insert_toolbar: false,
        noneditable_noneditable_class: 'tyt-template-noneditable',
        noneditable_editable_class: 'tyt-template-editable',
        skin: 'oxide',
        content_css: ['default', `/assets/plugins/tinymce/custom.style.css?v=949283749274982375`],
        base_url: `/assets/plugins/tinymce`,
        // base_url: `${this.baseHref}/assets/plugins/tinymce`,

        suffix: '.min',
        language_url: `/assets/plugins/tinymce/langs/vi.js`,
        language: 'vi',

        promotion: false,
        branding: false,
        valid_elements: '*[*]',
        valid_child_elements: '*[*]',
        relative_urls: false,
        allow_unsafe_link_target: true,
        extended_valid_elements: 'summary[class|style]',
        custom_elements: 'summary',
        paste_as_text: true,

        sandbox_iframes: false,
        // referrer_policy: 'origin',

        invalid_styles: {
            '*': 'font-family font-size',
        },

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
        // imagetools_cors_hosts: ['picsum.photos'],

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

        setup: this.setup.bind(this),
    };

    ngOnInit(): void {
        switch (this.mode) {
            case EditorModeEnum.SimpleTextMode:
                this.editorSettings.toolbar = this.TINYMCE_TOOL_BAR_SIMPLE_TEXT_MODE;
                break;
            case EditorModeEnum.TextMode:
                this.editorSettings.toolbar = this.TINYMCE_TOOL_BAR_TEXT_MODE;
                break;
            case EditorModeEnum.Comment:
                this.editorSettings.toolbar = this.TINYMCE_TOOL_BAR_COMMENT_MODE;
                this.editorSettings.plugins += ' emoticons';
                this.editorSettings.menubar = false;
                break;
            default:
                this.editorSettings.toolbar = `undo redo searchreplace | vImage vVideo vGallery wikis | bold italic underline strikethrough | table | formatselect | alignleft aligncenter alignright | outdent indent | media link |  numlist bullist | forecolor backcolor removeformat charmap | fullscreen  preview print | ltr rtl`;
                break;
        }

        this.embedDomainUrl = 'https://' + this.angularEnvironmentService.environment.embedDomain;
    }

    setup(editor: EditorComponent['editor']) {
        this.editor = editor;
        const _this = this;

        editor.ui.registry.addIcon(
            'vImageIcon',
            `<img src="/assets/plugins/tinymce/icons/vimage.svg" alt="icon" style="height: 20px; width: 20px;"/>`
        );
        editor.ui.registry.addButton('vImage', {
            tooltip: 'Chọn ảnh',
            icon: 'vImageIcon',
            onAction: function () {
                _this.onOpenFileManagerModal(false);
            },
        });

        editor.ui.registry.addIcon(
            'vVideoIcon',
            `<img src="/assets/plugins/tinymce/icons/vvideo.svg" alt="icon" style="height: 20px; width: 20px;"/>`
        );
        editor.ui.registry.addButton('vVideo', {
            tooltip: 'Chọn video',
            icon: 'vVideoIcon',
            onAction: function () {
                _this.onOpenFileManagerModal(true);
            },
        });
    }

    onChangeHandler(data: any) {
        this.valueChange.emit(data);
    }

    onOpenFileManagerModal(isVideo = false, isPanorama = false) {
        const bookmark = this.editor.selection.getBookmark();
        this.showFileManagerDialog(
            {
                typeFolderDisplay: isVideo ? FolderTypeEnum.Video : FolderTypeEnum.Image,
                isFolderAudio: false,
                isFolderVideo: isVideo,
                isValidateMinSize: !isPanorama,
                isPanorama,
                fileType: isPanorama ? FileSystemTypeEnum.Panorama : FileSystemTypeEnum.AllImage,
            },
            (imageModels) => {
                this.editor.selection.moveToBookmark(bookmark);
                if (imageModels && imageModels.length > 0) {
                    const htmlString: string = imageModels
                        .map((file: any) => {
                            if (file.isVideo) {
                                return /*html */ `<figure class="tyt-embed tyt-template-noneditable" data-embed="true" data-embedtype="video" data-embedid="${file.id}">
                                    <iframe width="560" height="315" src="${file.embeddedData}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </figure>`;
                            } else if (file.isAudio) {
                                return '';
                            } else if (file.extension === '.pdf') {
                                return /*html */ `<figure class="tyt-embed tyt-pdf-embed tyt-template-noneditable" data-embed="true" data-embedtype="pdf" data-embedid="${file.id}">
                                    <iframe width="660" height="660" src="${file.embeddedData}" allowfullscreen></iframe>
                                </figure>`;
                            } else {
                                return /*html */ `<figure class="image tyt-image" data-embed="true" data-embedtype="image" data-embedid="${file.id}">
                                        <img alt="${file.name}" data-id="${file.id}" src="${file.thumbnailUrl}">
                                        <figcaption></figcaption>
                                    </figure>`;
                            }
                        })
                        .join('');
                    if (htmlString) {
                        this.editor.execCommand('mceInsertContent', false, htmlString);
                    }
                }
            }
        );
    }
}
