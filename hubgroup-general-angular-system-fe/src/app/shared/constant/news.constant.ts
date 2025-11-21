const NEWS_DETAIL_VALIDATE = {
    titleLength: 250,
    subTitleLength: 250,
    descriptionLength: 1250,

    contentMinLength: 100,

    seoTitleLength: 80,
    seoDescriptionLength: 180,
};

const NEWS_VALIDATE_MESSAGE = {
    content: 'news.online.add.or.change.content.required',
    contentMinLength: 'news.online.add.or.change.content.min.length',
    author: 'news.online.add.or.change.author.required',
    group: 'news.online.add.or.change.group.required',
    groupType: 'news.online.add.or.change.group.type.required',
};

const CONFIG_MODAL_CONFIRM_BACK = {
    title: 'news.editor.back.warning.title',
    description: 'news.editor.back.warning.content',
    textYesButton: 'continue',
};

const CONFIG_MODAL_CONFIRM_CHANGE_STATUS = {
    title: 'news.online.change.status.warning.title',
    description: 'news.online.change.status.warning.content',
    textYesButton: 'save.and.continue',
    textYesButton2: 'not.save.and.continue',
    isShowBtnYes2: true,
};

const CONFIG_MODAL_CONFIRM_OVERWRITE = {
    title: 'news.online.change.version.warning.title',
    description: 'news.online.change.version.warning.content',
    textYesButton: 'accept.overwrite',
};

const MESSAGE_ERROR_VERSION_CHANGED = 'NEWS_VERSION_CHANGED';

export {
    NEWS_DETAIL_VALIDATE,
    NEWS_VALIDATE_MESSAGE,
    CONFIG_MODAL_CONFIRM_BACK,
    MESSAGE_ERROR_VERSION_CHANGED,
    CONFIG_MODAL_CONFIRM_CHANGE_STATUS,
    CONFIG_MODAL_CONFIRM_OVERWRITE,
};
