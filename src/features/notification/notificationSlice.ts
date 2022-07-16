import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment-timezone'
import { api } from '../../services/api.service'
import { TNotification } from '../../types/TNotification'

type notificationRequest = {
    notification: TNotification
    username?: string
    password?: string
}

export const createNotification = createAsyncThunk(
    'notifications/createNotification',
    async ({ notification, username, password }: notificationRequest, thunkAPI) => {
        await api.post('/notifications', { notification, username, password })
    }
)

export const getAllNotifications = createAsyncThunk(
    'notifications/getAllNotifications',
    async (thunkAPI) => {
        const notifications = await api.get('/notifications')
        const res = notifications.data.map((item: any) => (
            {
                ...item,
                createdAt: moment.tz(item.createdAt, "America/Sao_Paulo").format()
            }
        ))
        return res
    }
)

export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (id: number, thunkAPI) => {
        await api.delete(`/notifications/${id}`)
        return id
    }
)

export const archiveNotification = createAsyncThunk(
    'notifications/archiveNotification',
    async (notification: TNotification, thunkAPI) => {
        const res = await api.patch(`/notifications/${notification.id}`, notification)
        return { ...res.data, user: { name: notification.user?.name } }
    }
)

type State = {
    notifications: TNotification[],
    status: string
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        status: 'success'
    } as State,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(createNotification.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createNotification.fulfilled, (state, action) => {
            state.status = 'success'
        })
        builder.addCase(createNotification.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(getAllNotifications.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getAllNotifications.fulfilled, (state, action) => {
            state.status = 'success'
            state.notifications = action.payload
        })
        builder.addCase(getAllNotifications.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(deleteNotification.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(deleteNotification.fulfilled, (state, action) => {
            state.status = 'success'
            state.notifications = state.notifications.filter(i => i.id !== action.payload)
        })
        builder.addCase(deleteNotification.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(archiveNotification.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(archiveNotification.fulfilled, (state, action) => {
            state.status = 'success'
            state.notifications = state.notifications.map(i => i.id === action.payload.id
                ? action.payload
                : i
            )
        })
        builder.addCase(archiveNotification.rejected, (state) => {
            state.status = 'failed'
        })
    },
})

export default notificationSlice.reducer