import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { TAccount } from '../Types/taccount'
import { api } from '../../services/api.service'
import { TProduct } from '../../types/TProduct'
import { TSubProduct } from '../../types/TSubProduct'
import { getProduct } from '../../utils/functions'
import { createAdjustStock } from '../adjustStock/adjustStock'
import { createStockOut } from '../stockOut/stockOut'

export const getProdutos = createAsyncThunk(
    'produtos/getProdutos',
    async () => {
        try {
            const data = await api.get('/products')
            return data.data
        } catch (error) {
        }
    }
)

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (newProduct: TProduct, thunkAPI) => {
        const product = await api.post('/products', newProduct)
        return product.data
    }
)

export const editProduct = createAsyncThunk(
    'products/editProduct',
    async (product: TProduct, thunkAPI) => {
        const result = await api.patch(`/products/${product.id}`, product)
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

type State = {
    produtos: TProduct[],
    status: string
}

export const produtoSlice = createSlice({
    name: 'fornecedor',
    initialState: {
        produtos: [],
        status: 'success'
    } as State,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getProdutos.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getProdutos.fulfilled, (state, action) => {
            state.status = 'success'
            state.produtos = action.payload
        })
        builder.addCase(getProdutos.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(createProduct.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.status = 'success'
            state.produtos.push(action.payload)
            state.produtos = state.produtos
                .map((item) => item.name === action.payload.name
                    ? { ...item, min_stock: action.payload.min_stock, max_stock: action.payload.max_stock }
                    : item
                )
        })
        builder.addCase(createProduct.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(editProduct.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(editProduct.fulfilled, (state, action) => {
            state.status = 'success'
            state.produtos = state.produtos
                .map((item) => item.id === action.payload.id
                    ? { ...action.payload, subproducts: getProduct(state.produtos, action.payload.id)?.subproducts }
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
        builder.addCase(editSubProduct.fulfilled, (state, action) => {
            state.status = 'success'

            state.produtos = state.produtos
                .map((item) => item.id === action.payload.product_id
                    ? {
                        ...item,
                        subproducts: [
                            ...item.subproducts!.filter(item => item.id !== action.payload.id),
                            action.payload
                        ]
                    }
                    : item
                )
        })
        builder.addCase(editSubProduct.rejected, (state) => {
            state.status = 'failed'
        })
        builder.addCase(createStockOut.fulfilled, (state, action) => {
            state.status = 'success'

            let updatedProduct = getProduct(state.produtos, action.payload.product_id)

            updatedProduct = { ...updatedProduct!, stock: updatedProduct!.stock - action.payload.quantity }

            updatedProduct.subproducts = updatedProduct.subproducts?.map(item => (item.lote === action.payload.lote
                ? { ...item, quantity: item.quantity - action.payload.quantity }
                : item
            ))

            state.produtos = state.produtos.map(item => (item.id === action.payload.product_id
                ? updatedProduct!
                : item
            ))

            state.produtos = state.produtos.map(item => ({ ...item, subproducts: item.subproducts?.filter(i => i.quantity !== 0) }))
        })
        builder.addCase(createAdjustStock.fulfilled, (state, action) => {
            state.status = 'success'
            let updatedProduct = getProduct(state.produtos, action.payload.product_id)
            updatedProduct = { ...updatedProduct!, stock: updatedProduct!.stock + action.payload.quantity }

            updatedProduct.subproducts = updatedProduct.subproducts?.map(item => (item.lote === action.payload.lote
                ? { ...item, quantity: item.quantity + action.payload.quantity }
                : item
            ))

            state.produtos = state.produtos.map(item => (item.id === action.payload.product_id
                ? updatedProduct!
                : item
            ))

            state.produtos = state.produtos.map(item => ({ ...item, subproducts: item.subproducts?.filter(i => i.quantity !== 0) }))
        })
    },
})

export default produtoSlice.reducer