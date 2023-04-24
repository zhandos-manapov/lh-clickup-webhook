import { access_token as token } from '../db/token.json'
import axios from 'axios'

const getTeams = () => {
    const endpoint = `${process.env.CLICKUP_API}/team`
    return axios.get(endpoint, { headers: { 'Authorization': token } })
}

const getSpaces = (team_id: string, query: any) => {
    const endpoint = `${process.env.CLICKUP_API}/team/${team_id}/space`
    return axios.get(endpoint, {
        params: query,
        headers: { 'Authorization': token }
    })
}

const getFolders = (space_id: string, query: any) => {
    const endpoint = `${process.env.CLICKUP_API}/space/${space_id}/folder`
    return axios.get(endpoint, {
        params: query,
        headers: { 'Authorization': token }
    })
}

const getLists = (folder_id: string, query: any) => {
    const endpoint = `${process.env.CLICKUP_API}/folder/${folder_id}/list`
    return axios.get(endpoint, {
        params: query,
        headers: { 'Authorization': token }
    })
}

const getFolderlessLists = (space_id: string, query: any) => {
    const endpoint = `${process.env.CLICKUP_API}/space/${space_id}/list`
    return axios.get(endpoint, {
        params: query,
        headers: { 'Authorization': token }
    })
}

const getCustomFields = (list_id: string) => {
    const endpoint = `${process.env.CLICKUP_API}/list/${list_id}/field`
    return axios.get(endpoint, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
}

const getTasks = (list_id: string) => {
    const endpoint = `${process.env.CLICKUP_API}/list/${list_id}/task`
    return axios.get(endpoint, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
}

const getTask = (task_id: string) => {
    const endpoint = `${process.env.CLICKUP_API}/task/${task_id}`
    return axios.get(endpoint, {
        headers: {
            'Authorization': token
        }
    })
}

const updateTask = (task_id: string, body: any) => {
    const endpoint = `${process.env.CLICKUP_API}/task/${task_id}`
    return axios.put(endpoint, body, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
}

const createTask = (list_id: string, body: any) => {
    const endpoint = `${process.env.CLICKUP_API}/list/${list_id}/task`
    return axios.post(endpoint, body, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
}

const setCustomField = (task_id: string, field_id: string, field_value: string) => {
    const endpoint = `${process.env.CLICKUP_API}/task/${task_id}/field/${field_id}`
    return axios.post(endpoint, { value: field_value }, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    })
}

export {
    getTeams,
    getSpaces,
    getFolders,
    getLists,
    getFolderlessLists,
    getCustomFields,
    getTasks,
    getTask,
    updateTask,
    setCustomField,
    createTask
}