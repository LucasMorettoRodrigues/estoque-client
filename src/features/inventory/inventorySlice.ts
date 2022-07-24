import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api.service'
import moment from 'moment-timezone';
import { TInventory } from '../../types/TInventory';

export const getAllInventories = createAsyncThunk(
    'inventory/getAllInventories',
    async (thunkAPI) => {
        const res = await api.get('/inventories')
        const inventories = res.data.map((item: any) => (
            {
                ...item,
                createdAt: moment.tz(item.createdAt, "America/Sao_Paulo").format()
            }
        ))
        return inventories
    }
)

export const createInventory = createAsyncThunk(
    'inventory/createInventory',
    async ({ inventory, category, username, password }: any, thunkAPI) => {
        await api.post('/inventories', { inventory, category, username, password })
    }
)

export const deleteInventory = createAsyncThunk(
    'inventory/deleteInventory',
    async (id: number, thunkAPI) => {
        await api.delete(`/inventories/${id}`)
    }
)

export const editInventory = createAsyncThunk(
    'inventory/editInventory',
    async ({ id, body }: { id: number, body: any }, thunkAPI) => {
        await api.patch(`/inventories/${id}`, body)
    }
)

type State = {
    inventories: TInventory[],
    status: string
}

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        inventories: [],
        status: 'success'
    } as State,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getAllInventories.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getAllInventories.fulfilled, (state, action) => {
            state.status = 'success'
            state.inventories = action.payload
        })
        builder.addCase(getAllInventories.rejected, (state) => {
            state.status = 'failed'
        })

        builder.addCase(createInventory.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createInventory.fulfilled, (state) => {
            state.status = 'success'
        })
        builder.addCase(createInventory.rejected, (state) => {
            state.status = 'failed'
        })

        builder.addCase(deleteInventory.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(deleteInventory.fulfilled, (state) => {
            state.status = 'success'
        })
        builder.addCase(deleteInventory.rejected, (state) => {
            state.status = 'failed'
        })

        builder.addCase(editInventory.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(editInventory.fulfilled, (state) => {
            state.status = 'success'
        })
        builder.addCase(editInventory.rejected, (state) => {
            state.status = 'failed'
        })
    },
})

export default inventorySlice.reducer