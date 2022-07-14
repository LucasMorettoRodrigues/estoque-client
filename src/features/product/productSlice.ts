import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api.service'
import { TProduct, TProductRequest } from '../../types/TProduct'
import { TSubProduct } from '../../types/TSubProduct'
import { getProduct } from '../../utils/functions'
import { createAdjustStock } from '../AsyncThunkFunctions'

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async () => {
        try {
            const data = await api.get('/products')
            return data.data
        } catch (error) {
            console.log(error)
        }
    }
)

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (newProduct: TProductRequest, thunkAPI) => {
        const product = await api.post('/products', newProduct)
        return product.data
    }
)

export const editProduct = createAsyncThunk(
    'products/editProduct',
    async ({ id, product }: { id: number, product: TProductRequest }, thunkAPI) => {
        const result = await api.patch(`/products/${id}`, product)
        return result.data
    }
)

export const editSubProduct = createAsyncThunk(
    'products/editSubProduct',
    async (subProduct: TSubProduct, thunkAPI) => {
        const result = await api.patch(`/subProducts/${subProduct.id}`, subProduct)
        return result.data
    }
)

export const createAliquot = createAsyncThunk(
    'aliquots/createAliquot',
    async (data: any, thunkAPI) => {
        try {
            await api.post(`/aliquot`, data)
            thunkAPI.dispatch(getProducts())
        } catch (err: any) {
            if (!err.response) {
                throw err
            }

            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

type State = {
    products: TProduct[],
    status: string,
    missingFilter: boolean,
    providerFilter: string[],
    categoryFilter: string[],
    searchFilter: string | undefined
}

export const produtoSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        status: 'success',
        missingFilter: false,
        providerFilter: [],
        categoryFilter: [],
        searchFilter: undefined,
    } as State,
    reducers: {
        switchMissingFilter: (state) => {
            state.missingFilter = !state.missingFilter
        },
        setProviderFilter: (state, action) => {
            state.providerFilter = action.payload
        },
        SetCategoryFilter: (state, action) => {
            state.categoryFilter = action.payload
        },
        SetSearchFilter: (state, action) => {
            state.searchFilter = action.payload.toLowerCase()
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.status = 'success'
            state.products = action.payload
        })
        builder.addCase(getProducts.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(createProduct.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.status = 'success'
            state.products.push({ ...action.payload, subproducts: [] })
            // state.products = state.products
            //     .map((item) => item.name === action.payload.name
            //         ? { ...item, min_stock: action.payload.min_stock, max_stock: action.payload.max_stock }
            //         : item
            //     )

        })
        builder.addCase(createProduct.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(editProduct.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(editProduct.fulfilled, (state, action) => {
            state.status = 'success'
            state.products = state.products
                .map((item) => item.id === action.payload.id
                    ? { ...action.payload, subproducts: getProduct(state.products, action.payload.id)?.subproducts }
                    : item.name === action.payload.name
                        ? { ...item, min_stock: action.payload.min_stock, max_stock: action.payload.max_stock }
                        : item
                )
        })
        builder.addCase(editProduct.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(editSubProduct.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(editSubProduct.fulfilled, (state) => {
            state.status = 'success'
        })
        builder.addCase(createAdjustStock.fulfilled, (state, action) => {
            state.status = 'success'
            let updatedProduct = getProduct(state.products, action.payload.product_id)
            updatedProduct = { ...updatedProduct!, stock: updatedProduct!.stock + action.payload.quantity }

            updatedProduct.subproducts = updatedProduct.subproducts?.map(item => (item.lote === action.payload.lote
                ? { ...item, quantity: item.quantity + action.payload.quantity }
                : item
            ))

            state.products = state.products.map(item => (item.id === action.payload.product_id
                ? updatedProduct!
                : item
            ))

            state.products = state.products.map(item => ({ ...item, subproducts: item.subproducts?.filter(i => i.quantity !== 0) }))
        })
        builder.addCase(createAliquot.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createAliquot.fulfilled, (state) => {
            state.status = 'success'
        })
        builder.addCase(createAliquot.rejected, (state) => {
            state.status = 'failed'
        })
    },
})

export const { switchMissingFilter, setProviderFilter, SetCategoryFilter, SetSearchFilter } = produtoSlice.actions

export default produtoSlice.reducer