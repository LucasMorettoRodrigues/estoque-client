import { Autocomplete, TextField } from "@mui/material"
import { useState, FormEvent, ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import Button from "../../components/UI/Button"
import Form from "../../components/UI/Form"
import Input from "../../components/UI/Input"
import Select from "../../components/UI/Select"
import Title from "../../components/UI/Title"
import { createProduct } from "../../features/product/productSlice"
import { TProductRequest } from "../../types/TProduct"

const InputContainer = styled.div`
    margin-bottom: 20px;
    flex: 1;
`

export default function CreateProduct() {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const products = useAppSelector(state => state.product.products)

    const newProductInicialState: TProductRequest = {
        name: '',
        code: '',
        category: '',
        brand: '',
        unit: '',
        min_stock: 0,
        max_stock: 0,
        delivery_time: null,
        observation: null,
        product_child_id: null,
        qty_to_child: null,
        hide: false
    }

    const [newProduct, setNewProduct] = useState(newProductInicialState)

    const productIsValid = (product: TProductRequest) => {
        if (!product.name) return false
        if (!product.brand) return false
        if (!product.code) return false
        if (!product.category) return false
        if (!product.unit) return false
        if (!product.max_stock) return false
        if (!product.min_stock) return false

        if (product.product_child_id && !product.qty_to_child) return false

        if (!product.product_child_id && product.qty_to_child) return false

        return true
    }

    const validateNumberInput = (e: ChangeEvent<HTMLInputElement>, key: string) => {
        if (parseInt(e.target.value)) {
            setNewProduct({ ...newProduct, [key]: parseInt(e.target.value) })
        } else {
            setNewProduct({ ...newProduct, [key]: null })
        }
    }

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!productIsValid(newProduct)) {
            return
        }

        dispatch(createProduct(newProduct))
        navigate('/produtos')
    }

    return (
        <>
            <Title title='Novo Produto' />
            <Form onSubmit={handleOnSubmit}>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, name: e.target.value })}
                            name={'name'}
                            label={'Name'}
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, code: e.target.value })}
                            name={'codigo'}
                            label={'Código'}
                            required
                        />
                    </InputContainer>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Select
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewProduct({ ...newProduct, category: e.target.value })}
                            name={'categoria'}
                            label={'Categoria'}
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, brand: e.target.value })}
                            name={'brand'}
                            label={'Marca'}
                            required
                        />
                    </InputContainer>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, unit: e.target.value })}
                            name={'unit'}
                            label={'Unidade'}
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
                                min={0}
                                required
                            />
                        </InputContainer>
                    </div>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer style={{ marginRight: '40px' }}>
                        <Input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, observation: e.target.value })}
                            name={'obervation'}
                            label={'Observação'}
                            type='string'
                        />
                    </InputContainer>
                    <InputContainer>
                        <Input
                            onChange={(e) => validateNumberInput(e, 'delivery_time')}
                            name={'deliveryTime'}
                            label={'Previsão de entrega (semanas)'}
                            type='number'
                        />
                    </InputContainer>
                </div>
                <div style={{ display: 'flex', width: '100%' }}>
                    <InputContainer>
                        <p style={{ marginLeft: '2px', marginBottom: '4px', color: '#666', fontSize: '15px', fontWeight: 400 }}>Aliquotagem:</p>
                        <Autocomplete
                            disablePortal
                            onChange={(_, newValue) => setNewProduct({ ...newProduct, product_child_id: newValue?.id || null })}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            id="select"
                            options={
                                products.map(i => ({
                                    label: `${i.id} - ${i.name} - ${i.brand} - ${i.unit}`, id: i.id
                                }))
                            }
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
                            type='number'
                        />
                    </InputContainer>
                </div>
                <Button text={'Cadastrar Produto'} />
            </Form>
        </>
    )
}
