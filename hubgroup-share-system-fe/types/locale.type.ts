export type LocaleServiceGetRequest = {
    LanguageId: string
    ResourceName: string
    ResourceVale: string
    PageIndex: number
    PageSize: number
}

export type LocaleStringResourceResponse = {
    id?: string
    languageId: string
    resourceName?: string
    resourceValue?: string
    status?: number
    displayOrder?: number
    module?: number
}
  