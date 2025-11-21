export enum ModeMicroFrontedEnum {
    Normal = 'normal',
    IFrame = 'iframe',
    WebComponent = 'webComponent',
}

export enum StatusEnum {
    Deleted = -1,
    Active = 1,
    New = 2,
    InActive = 3,
}

export enum AuthorizationApplicationEnum {
    Default = 0,
    CMS = 1,
    CustomerAppAPI = 2,
    SSO = 3,
}

export enum StatusFilterTypeEnum {
    All = 0,
    Active = 1,
    InActive = 2,
}

export enum EditorModeEnum {
    Default = 0,
    TextMode = 1,
    SimpleTextMode = 2,
    Comment = 3,
}

export enum NewsAdminSortFieldEnum {
    Default = 0,
    CreateDate = 1,
    PublishDate = 2,
    PageView = 3,
    Position = 4,
    Comment = 5,
    Event = 6,
    Series = 7,
    UpdatedDate = 8,
    PageView12Hour = 9,
    PageView3Hour = 10,
    PageView6Hour = 11,
    PageView9Hour = 12,
}

export enum NewsAdminSortTypeEnum {
    Asc = 1,
    Desc = 2,
}

export enum SortTypeEnum {
    Asc = 1,
    Desc = 2,
}

export enum LeagueStatusEnum {
    New = 0,
    Active = 1,
    DisplayInSportHomePage = 2,
    DisplayInMenuSportHomePage = 4,
    DisplayInSchedulePage = 8,
}

export enum UserLoyaltyTypeEnum {
    Anonymous = 1,
    Normal = 2,
    Loyal = 3,
    Favourite = 4,
}

export enum AuthReloadEnum {
    ReloadGetUserByToken = 1,
    ReloadLoginProcess = 2,
    End = 4,
}

export enum StatusColLeftEnum {
    Collapse = 0,
    Expand = 1,
}

export enum PageSourceType {
    All = 0,
    Article = 1,
    Product = 2,
    ProductManufacturer = 3,
    ProductVendor = 4,
    ProductAttributeValue = 5,
    ProductEstate = 6,
}

export enum BreakpointEnum {
    XXlAnt = '(min-width: 1600px)',
    XXl = '(min-width: 1399px)',
    Xl = '(min-width: 1199px)',

    Desktop = '(min-width: 1024px)',

    Lg = '(min-width: 991px)',
    MaxMd = '(min-width: 768px)',
    Md = '(min-width: 767px)',
    Sm = '(min-width: 575px)',
    Xs = '(max-width: 576px)',
}

export enum DayOfWeek {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
}

export enum GroupTypeEnum {
    Default = 0,
    Administrator = 1,
    EditorialSecretary = 2, // Thư ký tòa soạn
    SectionSecretary = 3, // Thư ký chuyên mục,
    Reporter = 4, // Phóng viên,
    VnPost = 5, // Đối tác VNPOST
    VnPostCustomer = 6, // khách hàng do vnpost giới thiệu
    Pseudonym = 7, // Bút danh
    Collaborators = 8, // Cong tac vien
}

export enum ModeRenderEnum {
    Page = 1,
    DialogSearch = 2,
    DialogAction = 3,
}

export enum ButtonArrowEnum {
    Up = 0,
    Down = 1,
    Right = 2,
    Left = 3,
}

export enum ValidateClientEnum {
    Default = 0,
    TemplateAudio = 1,
}

export enum UserBehaviorStatusEnum {
    InActive = 0,
    Active = 1,
}

export enum FileTypeEnum {
    Comment = 1,
    FeedBack = 2,
}

export enum DisplayConfigEnum {
    OriginUrl = 1,
    TarotTemplate = 2,
}

export enum LocaleModuleEnum {
    GeneralModule = 0,
    FileManagerModule = 1,
    ReceptionModule = 2,
    NewsModule = 3,
    ProductModule = 4,
    RepairModule = 5,
}
export enum AuthenApplicationOptionEnum {
    ExternalTokenValidate = 1,
    CheckUserExist = 2,
}

export enum ESSortTypeEnum {
    Asc = 1,
    Desc = 2,
}

export enum TmssStatus {
    Yes = 1,
    No = 0,
}
export enum GenderEnum {
    Male = 1,
    Female = 2,
    Other = 3,
}
