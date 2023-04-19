import { IClickUpUser } from "./IClickUpUser"

export interface IClickUpTaskResponse {
    id: string
    custom_id: string
    name: string
    text_content: string
    description: string
    status: IClickUpTaskStatus
    orderindex: string
    date_created: string
    date_updated: string
    date_closed: string
    date_done: string
    archived: string
    creator: IClickUpUser
    assignees: IClickUpUser
    watchers: IClickUpUser
    checklists: string[]
    tags: string[]
    parent: string
    priority: string
    due_date: string
    start_date: string
    points: string
    time_estimate: string
    time_spent: string
    custom_fields: IClickUpCustomField[]
    dependencies: string[]
    linked_tasks: string[]
    team_id: string
    url: string
    sharing: {
        public: boolean
        public_share_expires_on: string
        public_fields: string[]
        token: string
        seo_optimized: boolean
    }
    permission_level: string
    list: IClickUpCollectionLink
    project: IClickUpCollectionLink
    folder: IClickUpCollectionLink
    space: IClickUpCollectionLink
    attachments: string[]
}

interface IClickUpCollectionLink {
    id: string
    name?: string
    hidden?: boolean
    access?: boolean
}

interface IClickUpTaskStatus {
    id: string
    status: string
    color: string
    orderindex: string
    type: string
}

interface IClickUpCustomField {
    id: string
    name: string
    type: string
    type_config: {}
    date_created: string
    hide_from_guests: boolean
    value?: string
    required: boolean
}