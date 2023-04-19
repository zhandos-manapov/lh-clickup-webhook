export interface IProfile {
    id: string
    name: string
    description?: string
    custom_fields?: ICustomField[]
}

interface ICustomField {
    id: string
    value: string
}