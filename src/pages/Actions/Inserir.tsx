import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { FormEvent, useRef, useState } from "react"
import { AiOutlineDelete } from 'react-icons/ai'
import Button from "../../components/UI/Button"
import { TStockIn } from "../../types/TStockIn"
import { getProduct, getProvider } from "../../utils/functions"
import { createStockIn } from "../../features/AsyncThunkFunctions"
import EditDeleteButton from "../../components/UI/EditDeleteButton"
import Mensagem from "../../components/UI/Mensagem"
import { createProvider } from "../../features/provider/providerSlice"
import Input from "../../components/UI/Input"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import Form from "../../components/UI/Form"
import Title from "../../components/UI/Title"
import { Autocomplete, TextField } from "@mui/material"
import { createNotification, deleteNotification } from "../../features/notification/notificationSlice"
import { useLocation } from "react-router-dom"
import Loading from "../../components/UI/Loading"
import { TMessage } from "../../types/TMessage"
import { getProducts } from "../../features/product/productSlice"
import SignOperation from "../../components/Actions/SignOperation"
import { currencyMask } from "../../utils/masks"

const InputContainer = styled.div<{ flex: number, minWidth?: string }>`
    flex: ${props => props.flex};
    min-width: ${props => props.minWidth};
    display: flex;
    margin-right: 20px;
    flex-direction: column;
    font-size: 14px;
    margin-bottom: 10px;
`
const ProductListContainer = styled.div`
    margin-bottom: 30px;
`

export default function Inserir() {

    const dispatch = useAppDispatch()
    const { state }: any = useLocation()
    const products = useAppSelector(state => state.product.products)
    const providers = useAppSelector(state => state.provider.providers)
    const auth = useAppSelector(state => state.authentication)

    const [cart, setCart] = useState<TStockIn[]>(state ? state.data : [])
    const [productId, setProductId] = useState(0)
    const [providerId, setProviderId] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [validade, setValidade] = useState<string | null>(null)
    const [lote, setLote] = useState('')
    const [price, setPrice] = useState('')
    const [warning, setWarning] = useState<TMessage>(null)
    const [message, setMessage] = useState<TMessage>(null)
    const [loading, setLoading] = useState(false)
    const elmRef = useRef(null as HTMLElement | null);

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!productId || !providerId || !price || !lote || !quantity) {
            return setMessage({ title: 'Erro', message: 'Existem campos incompletos.' })
        }

        if (!getProduct(products, productId)) {
            return setMessage({ title: 'Erro', message: 'O produto não existe.' })
        }

        if (!findOrCreateProvider(providerId)) return

        const index = cart.findIndex(i => ((i.product_id === productId) && (i.lote === lote) && (i.provider_id === parseInt(providerId))))

        if (index < 0) {
            setCart([...cart, {
                product_id: productId,
                provider_id: parseInt(providerId),
                price: price,
                lote: lote,
                validade: validade,
                quantity: quantity
            }])
        } else {
            let newCart = cart.slice()
            newCart[index].quantity += quantity
            setCart(newCart)
        }

        Array.from(document.querySelectorAll("input")).forEach(
            input => (input.value = '')
        );

        elmRef.current!.querySelector("button")?.click();

        clearFields()
    }

    const clearFields = () => {
        setProductId(0)
        setProviderId('')
        setQuantity(0)
        setValidade(null)
        setLote('')
        setPrice('')
    }

    const findOrCreateProvider = (provider: string) => {
        const res = providers.find(i => i.id === parseInt(provider))

        if (!res) {
            setWarning({
                title: 'Atenção',
                message: `Fornecedor ${provider} não cadastrado. Deseja cadastra-lo?`
            })
            return false
        }

        return true
    }

    const handleCreateProvider = () => {
        dispatch(createProvider({ name: providerId }))
            .unwrap()
            .then((res) => {
                setProviderId(res.id)
            })
            .then(() => setWarning(null))
            .then(() => setMessage({ title: 'Sucesso', message: 'O fornecedor foi cadastrado.' }))
    }

    const handleCheckout = async (username: string, password: string) => {

        const prs: TStockIn[] = []
        const prsError: TStockIn[] = []

        for (const item of cart) {
            try {
                await dispatch(createStockIn({ ...item, username, password })).unwrap()
                prs.push(item)
            } catch (error) {
                prsError.push(item)
            }
        }

        setCart(prsError)
        setLoading(false)

        dispatch(getProducts())

        if (prsError.length === 0) {
            setMessage({ title: 'Sucesso', message: 'O(s) produto(s) foram inseridos com sucesso.' })

            if (state) {
                await dispatch(deleteNotification(state.id))
            }
        } else {
            setMessage({
                title: 'Erro',
                message:
                    `${prs.length > 0 ? `Produto(s) inserido(s): \n ${prs.map(item => `${getProduct(products, item.product_id)?.name} \n`)} \n` : ''} Não foi possível inserir o(s) produto(s): \n ${prsError.map(item => `${getProduct(products, item.product_id)?.name} \n`)}`
            })
        }

        setLoading(false)
    }

    const handleSendToAdmin = async (username: string, password: string) => {
        try {
            await dispatch(createNotification({
                notification: { description: 'Solicitação para Inserir', data: cart },
                username,
                password
            })).unwrap()
            setMessage({ title: 'Sucesso', message: 'Solicitação para inserir enviada.' })
            setCart([])

        } catch (error) {
            setMessage({ title: 'Erro', message: 'Não foi possível realizar a inserção.' })
        } finally {
            setLoading(false)
        }
    }

    const handleOnConclude = (user: string, password: string) => {
        setLoading(true)

        if (auth.role === 'admin') {
            handleCheckout(user, password)
        }

        if (auth.role !== 'admin') {
            handleSendToAdmin(user, password)
        }
    }

    return (
        <>
            < Loading loading={loading} />
            {message && <Mensagem onClick={() => setMessage(null)} message={message} />}
            {warning && <Mensagem onClick={handleCreateProvider} onClose={() => setWarning(null)} message={warning} />}
            <Title title='Inserir Produtos' />
            <Form onSubmit={handleOnSubmit}>
                <InputContainer flex={5} minWidth='65vw'>
                    <Autocomplete
                        ref={elmRef}
                        disablePortal
                        onChange={(event, newValue) => setProductId(newValue?.id || 0)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        id="select"
                        options={
                            products.map(i => ({
                                label: `${i.id} - ${i.name} - ${i.brand} - ${i.unit}`, id: i.id
                            }))
                        }
                        sx={{ backgroundColor: 'white', marginTop: '20px' }}
                        renderInput={(params) => <TextField {...params} label="Produto" size='small' />}
                    />
                </InputContainer>
                <InputContainer flex={3} minWidth='15vw'>
                    <Input
                        name="provider"
                        label="Fornecedor"
                        required
                        autoComplete="off"
                        onChange={(e) => setProviderId(e.target.value.split(' ')[0])}
                        list='providers'
                    />
                    <datalist id="providers">
                        {
                            providers.map(item => (
                                <option key={item.id}>{item.id}  -  {item.name}</option>
                            ))
                        }
                    </datalist>
                </InputContainer>
                <InputContainer flex={1} minWidth='150px'>
                    <Input
                        name="price"
                        label="Preço unitário"
                        required
                        type='string'
                        onChange={(e) => setPrice(currencyMask(e).target.value)}
                    />
                </InputContainer>
                <InputContainer flex={1} minWidth='150px'>
                    <Input
                        name="lote"
                        label="Lote"
                        required
                        onChange={(e) => setLote(e.target.value)}
                    />
                </InputContainer>
                <InputContainer flex={1}>
                    <Input
                        name="validade"
                        label="Validade"
                        onChange={(e) => setValidade(e.target.value)}
                        type='date'
                    />
                </InputContainer>
                <InputContainer flex={1}>
                    <Input
                        name="quantity"
                        label="Quantidade"
                        required
                        min={1}
                        type='number'
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                </InputContainer>
                <Button
                    style={{ marginRight: '20px', marginTop: '10px' }}
                    text='Lançar' />
            </Form>
            {
                cart.length > 0 &&
                <>
                    <ProductListContainer>
                        <ListHeader>
                            <Item flex={3} text='Produto' />
                            <Item flex={1} text='Fornecedor' />
                            <Item flex={1} text='Lote' />
                            <Item flex={1} text='Validade' />
                            <Item flex={1} text='Preço' />
                            <Item flex={1} text='Quantidade' />
                            <Item width='90px' text='Remover' align='center' />
                        </ListHeader>
                        <>
                            {
                                cart.map((item, index) => (
                                    <ItemsContainer key={index}>
                                        <Item flex={3} text={getProduct(products, item.product_id)?.name} />
                                        <Item flex={1} text={getProvider(providers, item.provider_id)?.name} />
                                        <Item flex={1} text={item.lote} />
                                        <Item flex={1} text={item.validade || 'Indeterminada'} />
                                        <Item flex={1} text={item.price} />
                                        <Item flex={1} text={item.quantity} />
                                        <EditDeleteButton
                                            onClick={() => {
                                                setCart(cart.filter((p, i) => i !== index))
                                                if (state && cart.length === 1) {
                                                    dispatch(deleteNotification(state.id))
                                                }
                                            }}
                                        >
                                            <AiOutlineDelete />
                                        </EditDeleteButton>
                                    </ItemsContainer>
                                ))
                            }
                        </>
                    </ProductListContainer>
                    <SignOperation
                        show={cart.length > 0}
                        handleSubmit={handleOnConclude}
                        buttonText='Concluir'
                    />
                </>
            }
        </>
    )
}
