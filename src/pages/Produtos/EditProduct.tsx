import { Autocomplete, TextField } from "@mui/material"
import { useState, FormEvent, ChangeEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Button from "../../components/UI/Button"
import Form from "../../components/UI/Form"
import Input from "../../components/UI/Input"
import Mensagem from "../../components/UI/Mensagem"
import Select from "../../components/UI/Select"
import Title from "../../components/UI/Title"
import { editProduct } from "../../features/product/productSlice"
import { TMessage } from "../../types/TMessage"
import { TProductRequest } from "../../types/TProduct"
import { getProduct } from "../../utils/functions"
import ListOperations from "../Historic/ListOperations"

const InputContainer = styled.div`
    margin-bottom: 20px;
    flex: 1;
`
const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`

interface ProductState extends TProductRequest {
    id: number
}

export default function EditProduct() {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const product = location.state as ProductState;
    const products = useAppSelector(state => state.product.products)
    const [message, setMessage] = useState<TMessage>(null)

    const options = products.map(i => ({
        label: `${i.id} - ${i.name} - ${i.brand} - ${i.unit}`, id: i.id
    }))

    options.unshift({ label: 'Sem Aliquotagem', id: 0 })

    const editingProductInitialState: TProductRequest = {
        name: product.name,
        code: product.code,
        category: product.category,
        brand: product.brand,
        unit: product.unit,
        min_stock: product.min_stock,
        max_stock: product.max_stock,
        delivery_time: product.delivery_time,
        observation: product.observation,
        product_child_id: product.product_child_id,
        qty_to_child: product.qty_to_child,
        hide: product.hide
    }

    const [editingProduct, setEditingProduct] = useState(editingProductInitialState)

    const [openAutoComplete, setOpenAutoComplete] = useState(false)
    const [childProductId, setChildProductId] = useState(product.product_child_id)

    const selectedChildProduct = editingProduct.product_child_id && getProduct(products, editingProduct.product_child_id)
    console.log(selectedChildProduct, editingProduct.product_child_id)

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let editedProduct = editingProduct

        if (openAutoComplete) {
            editedProduct = {
                ...editedProduct,
                product_child_id: childProductId
            }


        }

        if (!productIsValid(editedProduct)) {
            return
        }

        dispatch(editProduct({ id: product.id, product: editedProduct }))
        navigate('/produtos/detalhes')
    }

    const productIsValid = (product: TProductRequest) => {
        if (!product.name) return false
        if (!product.brand) return false
        if (!product.code) return false
        if (!product.category) return false
        if (!product.unit) return false
        if (!product.max_stock) return false
        if (!product.min_stock) return false
        if ((product.product_child_id && !product.qty_to_child) ||
            (!product.product_child_id && product.qty_to_child)) return false

        return true
    }

    const validateNumberInput = (e: ChangeEvent<HTMLInputElement>, key: string) => {
        if (parseInt(e.target.value)) {
            setEditingProduct({ ...editingProduct, [key]: parseInt(e.target.value) })
        } else {
            setEditingProduct({ ...editingProduct, [key]: null })
        }
    }

    const handleArchiveProduct = async (id: number) => {
        try {
            await dispatch(editProduct({ id: product.id, product: { hide: true } })).unwrap()
            setMessage({ title: 'Sucesso', message: 'O produto foi arquivado.' })
        } catch (error) {
            setMessage({ title: 'Erro', message: 'Não foi possível arquivar o produto.' })
        }

    }

    return (
        <>
            {message && <Mensagem onClick={() => setMessage(null)} message={message} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title title='Editar Produto' />
                <Button
                    onClick={() => handleArchiveProduct(product.id)}
                    text='Arquivar'
                    bg='red'
                />
            </div>
            <Form onSubmit={handleOnSubmit}>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            name={'name'}
                            label={'Name'}
                            value={editingProduct.name}
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, code: e.target.value })}
                            name={'codigo'}
                            label={'Código'}
                            value={editingProduct.code}
                            required
                        />
                    </InputContainer>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Select
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            name={'categoria'}
                            label={'Categoria'}
                            value={editingProduct.category}
                            required
                        >
                            <option></option>
                            <option>Reagentes</option>
                            <option>Descartáveis</option>
                            <option>Kits</option>
                        </Select>
                    </InputContainer>
                    <InputContainer>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            name={'brand'}
                            label={'Marca'}
                            value={editingProduct.brand}
                            required
                        />
                    </InputContainer>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                            name={'unit'}
                            label={'Unidade'}
                            value={editingProduct.unit}
                            required
                        />
                    </InputContainer>
                    <div style={{ display: 'flex', flex: 1 }}>
                        <InputContainer style={{ marginRight: '40px' }}>
                            <Input
                                onChange={(e) => validateNumberInput(e, 'min_stock')}
                                name={'minStock'}
                                label={'Estoque Mínimo'}
                                type='number'
                                value={editingProduct.min_stock}
                                min={0}
                                required
                            />
                        </InputContainer>
                        <InputContainer>
                            <Input
                                onChange={(e) => validateNumberInput(e, 'max_stock')}
                                name={'maxStock'}
                                label={'Estoque Máximo'}
                                type='number'
                                value={editingProduct.max_stock}
                                min={0}
                                required
                            />
                        </InputContainer>
                    </div>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, observation: e.target.value })}
                            name={'obervation'}
                            label={'Observação'}
                            value={editingProduct.observation || ''}
                        />
                    </InputContainer>
                    <InputContainer>
                        <Input
                            onChange={(e) => validateNumberInput(e, 'delivery_time')}
                            name={'deliveryTime'}
                            label={'Previsão de entrega (semanas)'}
                            value={editingProduct.delivery_time || ''}
                            type='number'
                        />
                    </InputContainer>
                </div>
                <div style={{ width: '100%' }}>
                    <InputContainer>
                        {!openAutoComplete &&
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '100%' }}>
                                    <Input disabled name="child" label='Aliquotagem' value={selectedChildProduct ? `${selectedChildProduct.name} - ${selectedChildProduct.brand} - ${selectedChildProduct.unit}` : 'Sem Aliquotagem'} />
                                </div>
                                <InputContainer
                                    style={{ marginLeft: '40px', minWidth: '240px', flex: 0 }}
                                >
                                    <Input
                                        name={'qtyToChild'}
                                        label={'Qtd. de aliq. mín. para estoque'}
                                        value={editingProduct.qty_to_child || ''}
                                        disabled
                                        type='number'
                                    />
                                </InputContainer>
                                <Button style={{ marginLeft: '40px', whiteSpace: 'nowrap', alignSelf: 'center' }} bg='blue' text="Editar Aliquotagem" onClick={() => setOpenAutoComplete(true)} />
                            </ div>
                        }
                        {openAutoComplete &&
                            <div style={{ display: 'flex', width: '100%' }}>
                                <InputContainer>
                                    <p style={{ marginLeft: '2px', marginBottom: '4px', color: '#666', fontSize: '15px', fontWeight: 400 }}>Aliquotagem</p>
                                    <Autocomplete
                                        disablePortal
                                        onChange={(_, newValue) => setChildProductId(newValue?.id || null)}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        id="select"
                                        options={options}
                                        sx={{ backgroundColor: 'white' }}
                                        renderInput={(params) => <TextField {...params} label="Produto" size='small' />}
                                    />
                                </InputContainer>
                                <InputContainer
                                    style={{ marginLeft: '40px', minWidth: '240px', flex: 0 }}
                                >
                                    <Input
                                        onChange={(e) => validateNumberInput(e, 'qty_to_child')}
                                        name={'qtyToChild'}
                                        label={'Qtd. de aliq. mín. para estoque'}
                                        value={editingProduct.qty_to_child || ''}
                                        type='number'
                                    />
                                </InputContainer>
                            </div>
                        }
                    </InputContainer>
                </div>
                <ButtonContainer>
                    <Button text='Concluir Edição' />
                </ButtonContainer>
            </Form>
            <ListOperations productFilter={product.name} />
        </>
    )
}
