interface Field {
    id?: string
    name?: string
    value: string[]
    overwrite: boolean
}

interface DefaultFields {
    name: Field
    description: Field
}

export interface IMapping {
    list_id: string
    default_fields: DefaultFields
    custom_fields: Field[]
}