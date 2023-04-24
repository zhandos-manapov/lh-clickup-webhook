import fs from 'fs/promises'
import axios from 'axios'
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { IMapping } from '../interfaces/IMapping'
import { BadRequestError } from '../errors'
import { IClickUpTaskResponse } from '../interfaces/clickup/IClickUpTaskResponse'
import { IProfile } from '../interfaces/IProfile'
import * as clickupService from '../services/clickup.service'

// For testing
// const receiveProfile = async (req: Request, res: Response) => {
//     const profile = req.body
//     const profileJSON = JSON.stringify(profile)

//     await fs.writeFile(`profiles/${profile.id}.json`, profileJSON)
//     res.status(StatusCodes.OK).json({ message: 'Profile created!' })
// }

const getProfileFields = async (req: Request, res: Response) => {
    const { list_id } = req.params
    if (!list_id) throw new BadRequestError('Please provide list_id')

    const default_fields = [
        {
            name: 'ID',
            type: 'text',
            required: true
        },
        {
            name: 'Name',
            type: 'text',
            required: true
        },
        {
            name: 'Description',
            type: 'text',
            required: false
        }
    ]

    const { data } = await clickupService.getCustomFields(list_id)
    const custom_fields = data.fields

    res.status(StatusCodes.OK).json({ default_fields, custom_fields })
}


const getProfiles = async (req: Request, res: Response) => {
    const { list_id } = req.params
    if (!list_id) throw new BadRequestError('Please provide list_id')

    const { data: profiles }: { data: { tasks: IClickUpTaskResponse[] } } = await clickupService.getTasks(list_id)

    // Filter redundant fields
    const profiles_filtered = profiles.tasks.map(profile => ({
        id: profile.id,
        name: profile.name,
        url: profile.url,
        list: profile.list,
        folder: profile.folder,
        space: profile.space
    }))

    res.status(StatusCodes.OK).json({ profiles: profiles_filtered })
}


const getProfile = async (req: Request, res: Response) => {
    const { task_id } = req.params
    if (!task_id) throw new BadRequestError('Please provide task_id')

    const { data: profile }: { data: IClickUpTaskResponse } = await clickupService.getTask(task_id)

    // Filter redundant fields
    res.status(StatusCodes.OK).json({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        custom_fields: profile.custom_fields,
        url: profile.url,
        team_id: profile.team_id,
        list: profile.list,
        project: profile.project,
        folder: profile.folder,
        space: profile.space
    })
}


const updateProfile = async (req: Request, res: Response) => {
    const { task_id } = req.params
    if (!task_id) throw new BadRequestError('Please provide task_id')

    // Get mapping from DB
    const mapping: IMapping = await import('../db/mapping.json')

    const profile: IProfile = req.body

    // Get profile from clickup api
    const { data: current_profile }: { data: IClickUpTaskResponse } = await clickupService.getTask(task_id)

    const payload_profile: { [key: string]: any } = {}
    if (profile.name) {
        if (mapping.default_fields.name.overwrite) {
            payload_profile.name = profile.name
        } else {
            if (!current_profile.name) {
                payload_profile.name = profile.name
            }
        }
    }

    if (profile.description && mapping.default_fields.description.overwrite) {
        if (mapping.default_fields.description.overwrite) {
            payload_profile.description = profile.description
        } else {
            if (!current_profile.description) {
                payload_profile.description = profile.description
            }
        }
    }

    // Put to ClickUp API
    const { data: updated_profile }: { data: IClickUpTaskResponse } = await clickupService.updateTask(task_id, payload_profile)

    // Update custom fields 
    if (Array.isArray(profile.custom_fields)) {
        // Put custom field ids in the Map
        const field_id_map = new Map<string, string>()
        for (const custom_field of profile.custom_fields) {
            field_id_map.set(custom_field.id, custom_field.value)
        }

        // Update custom field values
        for (const field_idx in updated_profile.custom_fields) {
            const current_field = updated_profile.custom_fields[field_idx]
            const endpoint = `${process.env.CLICKUP_API}/task/${task_id}/field/${current_field.id}`
            if (field_id_map.has(current_field.id)) {
                const new_value = field_id_map.get(current_field.id)!
                if (mapping.custom_fields.find(field => field.id == current_field.id)?.overwrite) {
                    await clickupService.setCustomField(task_id, current_field.id, new_value)
                    current_field.value = new_value
                } else {
                    const target_field = current_profile.custom_fields.find(field => field.id == current_field.id)
                    if (!target_field?.value) {
                        await clickupService.setCustomField(task_id, current_field.id, new_value)
                    }
                }
            }
        }
    }

    res.status(StatusCodes.OK).json({
        id: updated_profile.id,
        name: updated_profile.name,
        description: updated_profile.description,
        custom_fields: updated_profile.custom_fields,
        url: updated_profile.url,
        team_id: updated_profile.team_id,
        list: updated_profile.list,
        project: updated_profile.project,
        folder: updated_profile.folder,
        space: updated_profile.space
    })
}


const createProfile = async (req: Request, res: Response) => {
    // Get mapping from DB
    const mapping: IMapping = await import('../db/mapping.json')

    const LHProfile = req.body

    // Default field mapping
    const clickup_profile: { [key: string]: any } = { name: LHProfile.full_name }

    const description_field = mapping.default_fields.description.value.find(field_name => LHProfile[field_name] !== null)
    if (description_field)
        clickup_profile.description = LHProfile[description_field]

    // Custom field mapping
    const custom_fields: { [key: string]: string }[] = []
    for (const field of mapping.custom_fields) {
        const curr_field = field.value.find(field_name => LHProfile[field_name] !== null)
        if (curr_field) {
            custom_fields.push({
                id: field.id!,
                value: LHProfile[curr_field]
            })
        }
    }

    clickup_profile.custom_fields = custom_fields

    const { data: profile }: { data: IClickUpTaskResponse } = await clickupService.createTask(mapping.list_id, clickup_profile)

    // Write id mapping to DB
    const { default: ids } = await import('../db/id.json')
    await fs.writeFile(`${__dirname}/../db/id.json`, JSON.stringify([...ids, { [LHProfile.member_id]: profile.id }]))
    res.status(StatusCodes.OK).json({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        custom_fields: profile.custom_fields,
        url: profile.url,
        team_id: profile.team_id,
        list: profile.list,
        project: profile.project,
        folder: profile.folder,
        space: profile.space
    })
}


const createProfileFieldMapping = async (req: Request, res: Response) => {
    const mapping: IMapping = req.body

    if (!mapping.list_id || !mapping.custom_fields || !mapping.default_fields)
        throw new BadRequestError('Please provided valid request body')

    const mappingJSON = JSON.stringify(mapping)

    // Write to database
    await fs.writeFile('src/db/mapping.json', mappingJSON)
    res.status(StatusCodes.OK).json({ message: 'Mapping created' })
}


export {
    // receiveProfile,
    getProfileFields,
    createProfileFieldMapping,
    createProfile,
    getProfiles,
    getProfile,
    updateProfile
}
