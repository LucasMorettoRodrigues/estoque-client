import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { TProduct } from "../types/TProduct"
import { FormEvent, useState } from "react"
import { AiOutlineDelete } from 'react-icons/ai'
import Button from "../components/Button"
import { createStockOut } from "../features/stockOut/stockOut"
import { TSubProduct } from "../types/TSubProduct"
import EditDeleteButton from "../components/EditDeleteButton"
import { compareDates, getProduct, getSubProduct } from "../utils/functions"
import Mensagem from "../components/Mensagem"
import Input from "../components/Input"
import Select from "../components/Select"
import ListHeader from "../components/List/ListHeader"

const Title = styled.h1`
    color: #222;
    margin: 30px 0;
`
const ListHeaderItem = styled.p<{ flex?: number }>`
    flex: ${props => props.flex ? props.flex : null};
    min-width: 90px;
    padding: 10px;
`
const Product = styled.ul`
    height: 40px;
    background-color: #cbe6ff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #cacaca;
`
const ProductLi = styled.li<{ flex?: number, color?: string }>`
    flex: ${props => props.flex ? props.flex : null};
    background-color: ${props => props.color ? props.color : null};
    font-size: 14px;
    min-width: 75px;
    padding: 10px;
`
const Form = styled.form`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const InputContainer = styled.div<{ flex: number }>`
    flex: ${props => props.flex};
    display: flex;
    margin-right: 20px;
    flex-direction: column;
    font-size: 14px;
`
const ProductListContainer = styled.div`
    margin-bottom: 30px;
`

type body = {
    product: TProduct,
    subProduct: TSubProduct | null,
    quantity: number
}

export default function Retirar() {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const products = useAppSelector(state => state.produto.produtos)

    const [quantity, setQuantity] = useState(1)
    const [subProductId, setSubProductId] = useState(0)
    const [productId, setProductId] = useState(0)
    const [productList, setProductList] = useState<body[]>([])
    const [error, setError] = useState('')
    const [warning, setWarning] = useState('')

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const productToAdd = getProduct(products, productId)
        const subProductToAdd = getSubProduct(products, productId, subProductId)

        if (!productToAdd) return setError('Produto não encontrado.')
        if (quantity > productToAdd.stock) return setError(`Existem ${productToAdd.stock} unidades do produto ${productToAdd.name}.`)
        if (subProductToAdd && quantity > subProductToAdd?.quantity) return setError(`Existem apenas ${subProductToAdd.quantity} unidades do lote ${subProductToAdd.lote}.`)
        if (subProductToAdd) {
            let sorted = [...productToAdd.subproducts!].sort(function compare(a, b) { return compareDates(b.validade!, a.validade!) })
            if (sorted[0].id !== subProductToAdd.id) setWarning(`O produto retirado não possui a data de validade mais próxima.`)
        }

        if (productList.find(i => i.product.id === productToAdd?.id &&
            productList.find(i => i.subProduct?.id === subProductToAdd?.id))) {
            setProductList(productList.map(item => (
                item.product.id === productToAdd.id &&
                    item.subProduct?.id === subProductToAdd?.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            )))
        } else {
            setProductList([...productList, {
                product: productToAdd,
                subProduct: subProductToAdd,
                quantity: quantity
            }])
        }

        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = '')
        );

        Array.from(document.querySelectorAll("select")).forEach(
            input => (input.value = '')
        );
    }

    const handleOnClick = async () => {
        for (const item of productList) {
            await dispatch(createStockOut({
                product_id: item.product.id!,
                quantity: item.quantity,
                subproduct_id: item.subProduct ? item.subProduct.id : null
            }))
        }

        navigate('/historico')
    }

    return (
        <>
            {error && <Mensagem onClick={() => setError('')} error={error} />}
            {warning && <Mensagem onClick={() => setWarning('')} warning={warning} />}
            <Title>Retirar Produtos</Title>
            <Form onSubmit={handleOnSubmit}>
                <InputContainer flex={5}>
                    <Input name="product" label='Produto' required list='products' onChange={(e) => setProductId(parseInt(e.target.value.split(' ')[0]))} />
                    <datalist id="products">
                        {
                            products.map(item => (
                                <option key={item.id}>{item.id} - {item.name} - {item.brand} - {item.unit}</option>
                            ))
                        }
                    </datalist>
                </InputContainer>
                <InputContainer flex={2}>
                    <Select name='lote-validade' label='Lote / Validade' required onChange={(e) => setSubProductId(parseInt(e.target.value))}>
                        <option value={0}></option>
                        {
                            products.filter(item => item.id === productId).map(item => (
                                item.subproducts?.map((item) => (
                                    <option key={item.id} value={item.id}>{item.lote} / {item.validade.slice(0, 10)}</option>
                                ))
                            ))
                        }
                    </Select>
                </InputContainer>
                <InputContainer flex={1}>
                    <Input name='quantity' label='Quantidade' type='number' min={1} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                </InputContainer>
                <Button style={{ padding: '12px 24px', alignSelf: 'flex-end' }} text={'Lançar'} />
            </Form>
            {
                productList.length > 0 &&
                <>
                    <ProductListContainer>
                        <ListHeader>
                            <ListHeaderItem flex={3}>Produto</ListHeaderItem>
                            <ListHeaderItem flex={1}>Marca</ListHeaderItem>
                            <ListHeaderItem flex={1}>Lote</ListHeaderItem>
                            <ListHeaderItem flex={1}>Validade</ListHeaderItem>
                            <ListHeaderItem flex={1}>Quantidade</ListHeaderItem>
                            <ListHeaderItem style={{ textAlign: 'center' }}>Remover</ListHeaderItem>
                        </ListHeader>
                        <>
                            {
                                productList.map((item, index) => (
                                    <Product key={index}>
                                        <ProductLi flex={3}>{item.product.name}</ProductLi>
                                        <ProductLi flex={1}>{item.product.brand}</ProductLi>
                                        <ProductLi flex={1}>{item.subProduct?.lote}</ProductLi>
                                        <ProductLi flex={1}>{item.subProduct?.validade.slice(0, 10)}</ProductLi>
                                        <ProductLi flex={1}>{item.quantity}</ProductLi>
                                        <EditDeleteButton
                                            onClick={() => setProductList(productList.filter((p, i) => i !== index))}
                                        >
                                            <AiOutlineDelete />
                                        </EditDeleteButton>
                                    </Product>
                                ))
                            }
                        </>
                    </ProductListContainer>
                    <Button onClick={handleOnClick} text={'Finalizar Retirada'} />
                </>
            }
        </>
    )
}
