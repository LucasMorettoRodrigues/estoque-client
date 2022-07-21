import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createNotification } from "../../features/notification/notificationSlice"

import { TMessage } from "../../types/TMessage"
import { TProduct } from "../../types/TProduct"

import Title from "../../components/UI/Title"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import SignOperation from "../../components/Actions/SignOperation"
import Mensagem from "../../components/UI/Mensagem"
import Modal from "../../components/UI/Modal"
import Loading from "../../components/UI/Loading"
import ListWrapper from "../../components/UI/ListWrapper"
import Select from "../../components/UI/Select"
import Input from "../../components/UI/Input"
import { formatDate, isExpired } from "../../utils/dateFunctions"
import { activeProducts } from "../../app/selectors"

const Container = styled.div``
const HeaderContainer = styled.div`
    display: flex;
    z-index: 1;
    position: sticky;
    top: 0;
`

const reasons = [
    'Entrada/saída incorretos',
    'Erro de digitação',
    'Erro não identificado',
    'Bug do sistema',
    'Local de armazenamento incorreto',
    'Contagem inventário incorreta'
]

export default function Inventario() {

    const productsData = useAppSelector(activeProducts)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [products, setProducts] = useState<TProduct[]>([])
    const [verifiedStock, setVerifiedStock] = useState<any>({})
    const [divergentItemsList, setDivergentItemsList] = useState<number[]>([])
    const [message, setMessage] = useState<TMessage>(null)
    const [submissionCounter, setSubmissionCounter] = useState(0)
    const [modalIsOpen, setModalIsOpen] = useState(true)
    const [category, setCategory] = useState<string[]>([])
    const [systemStock, setSystemStock] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        if (category.length > 0) {
            let products = productsData.filter(i => i.hide === false && i.subproducts!.length > 0)
            products = productsData.filter(i => category.includes(i.category))

            if (divergentItemsList.length > 0) {
                products = products.map(i => ({ ...i, subproducts: i.subproducts?.filter(j => divergentItemsList.includes(j.id!)) }))
                products = products.filter(i => i.subproducts!.length > 0)
            }

            setProducts(products)
        }

    }, [productsData, divergentItemsList, category])

    useEffect(() => {
        if (category.length > 0) {
            const systemStockObj: any = {}
            productsData.filter(i => category.includes(i.category)).forEach((product) => {
                product.subproducts && product.subproducts.forEach((subproduct) => {
                    systemStockObj[subproduct.id!] = subproduct.quantity
                })
            })
            setSystemStock(systemStockObj)
        }
    }, [category, productsData])

    const submitInventory = (username: string, password: string) => {
        setIsLoading(true)

        if (!isValidated()) return setIsLoading(false)

        const divergentItems = getDivergentItems()

        if (divergentItems.length === 0 || submissionCounter === 1) {
            return sendInventory(username, password)
        }

        setDivergentItemsList(divergentItems)

        setIsLoading(false)

        if (submissionCounter === 0) {
            setMessage({
                title: 'Atenção',
                message: `${divergentItems.length} item(s) com divergência. 
                Confira novamente o estoque do(s) iten(s) a seguir por favor.`
            })
            setSubmissionCounter(1)
            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = '')
            );
        }
    }

    const sendInventory = async (username: string, password: string) => {

        if (submissionCounter === 1 && !justificationIsValid()) {
            setIsLoading(false)
            return setMessage({ title: 'Erro', message: 'Por favor preencha todas as justificativas e motivos.' })
        }

        if (!username || !password) {
            setIsLoading(false)
            return setMessage({ title: 'Erro', message: 'Por favor preencha o usuário e senha.' })
        }

        const data = productsData.filter(i => category.includes(i.category)).slice().map(item => (
            {
                ...item, subproducts:
                    item.subproducts!.map(subitem => (
                        {
                            ...subitem,
                            inventory: verifiedStock[subitem.id!].inventory,
                            justification: verifiedStock[subitem.id!].justification,
                            reason: verifiedStock[subitem.id!].reason
                        }
                    ))
            }
        ))

        try {
            await dispatch(createNotification({
                notification: { description: 'Inventário', data },
                username,
                password
            })).unwrap()
            setMessage({ title: 'Sucesso', message: 'O inventário foi submetido.' })
        } catch (error) {
            console.log(error)
            setMessage({ title: 'Erro', message: 'Não foi possivel concluir a ação.' })
        } finally {
            setIsLoading(false)
        }
    }

    const justificationIsValid = () => {
        for (const value of divergentItemsList) {

            if (verifiedStock[value].inventory !== verifiedStock[value].system &&
                (!verifiedStock[value].justification || !verifiedStock[value].reason)
            ) {
                return false
            }
        }
        return true
    }

    const isValidated = () => {
        if (Object.keys(verifiedStock).length !== Object.keys(systemStock).length) {
            setMessage({ title: 'Erro', message: 'Por favor preencha todos os campos.' })
            return false
        }
        return true
    }

    const getDivergentItems = () => {
        const divergentItems: number[] = []

        for (const [key,] of Object.entries(systemStock)) {
            if (systemStock[key] !== verifiedStock[key].inventory) {
                divergentItems.push(Number(key))
            }
        }

        return divergentItems
    }

    const selectCategory = (category: string[]) => {
        setCategory(category)
        setModalIsOpen(false)
    }

    const handleMessageClick = (title: string) => {
        if (title === "Sucesso") {
            navigate('/inserir')
        }

        setMessage(null)
    }

    return (
        <>
            {isLoading && <Loading loading={isLoading} />}
            {modalIsOpen && <Modal selectCategory={selectCategory} />}
            {message && <Mensagem onClick={handleMessageClick} message={message} />}
            <Title title='Inventario' />
            <ListWrapper>
                <HeaderContainer>
                    <ListHeader fontSize='12px'>
                        <Item width="26px" text='Id' fontSize='12px' />
                        <Item flex={3} text='Produto' fontSize='12px' />
                        <Item flex={2} text='Observação' fontSize='12px' />
                        <Item width="90px" text='Código' fontSize='12px' />
                        <Item width="90px" text='Categoria' fontSize='12px' />
                        <Item width="180px" text='Marca' fontSize='12px' />
                        <Item width="65px" text='Unidade' fontSize='12px' />
                    </ListHeader>
                </HeaderContainer>
                <>
                    {
                        products.map((item) => (
                            <Container key={item.id}>
                                <div style={{ display: 'flex' }}>
                                    <ItemsContainer>
                                        <Item width="26px" text={item.id} fontSize='12px' />
                                        <Item flex={3} text={item.name} fontSize='12px' />
                                        <Item flex={2} text={item.observation} fontSize='12px' />
                                        <Item width="90px" text={item.code} fontSize='12px' />
                                        <Item width="90px" text={item.category} fontSize='12px' />
                                        <Item width="180px" text={item.brand} fontSize='12px' />
                                        <Item width="65px" text={item.unit} fontSize='12px' />
                                    </ItemsContainer>
                                </div>

                                {item.subproducts &&
                                    item.subproducts.map((subitem) => (
                                        <div key={subitem.id}>
                                            <ItemsContainer
                                                type="subItem"
                                                bg='#eef7ff'
                                            >
                                                <Item width='160px' color='#3142a0' text={`Lote: ${subitem.lote}`} />
                                                <Item width='150px' color={isExpired(subitem.validade!) ? 'red' : '#3142a0'} text={`Validade: ${formatDate(subitem.validade)}`} />
                                                {submissionCounter === 1
                                                    ? <>
                                                        <Item width='100px' color='#ff0000' text={`Qtd (sis): ${subitem.quantity}`} />
                                                        <Item width='100px' color='#ff0000' text={`Qtd (inv): ${verifiedStock[subitem.id!].inventory}`} />
                                                    </>
                                                    : <></>
                                                }
                                                <div style={{ marginLeft: 'auto', paddingRight: '10px', display: 'flex', alignItems: 'center', width: '180px' }}>
                                                    <Input
                                                        label="Contagem:"
                                                        type="number"
                                                        min="0"
                                                        name="contagem"
                                                        display="flex"
                                                        style={{ fontSize: '12px', padding: '8px' }}
                                                        onChange={(e) => setVerifiedStock({ ...verifiedStock, [subitem.id!]: { inventory: Number(e.target.value), system: subitem.quantity } })} />
                                                </div>

                                            </ItemsContainer>
                                            {submissionCounter === 1

                                                ? <>
                                                    {subitem.quantity !== verifiedStock[subitem.id!].inventory &&
                                                        <>
                                                            <ItemsContainer
                                                                type="subItem"
                                                                bg='#eef7ff'
                                                                key={subitem.id}
                                                            >
                                                                <div style={{ marginRight: '10px', marginLeft: '45px', display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                    <Select label="Motivo:" name="reason" display="flex" style={{ fontSize: '12px', padding: '8px' }} onChange={(e) => setVerifiedStock({ ...verifiedStock, [subitem.id!]: { ...verifiedStock[subitem.id!], reason: e.target.value } })}>
                                                                        <>
                                                                            <option></option>
                                                                            {reasons.map((item) =>
                                                                                <option key={item}>{item}</option>
                                                                            )}
                                                                        </>
                                                                    </Select>
                                                                </div>
                                                            </ItemsContainer>
                                                            <ItemsContainer
                                                                type="subItem"
                                                                bg='#eef7ff'
                                                                key={subitem.id}
                                                            >
                                                                <div style={{ margin: '10px', display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                    <Input label="Justificativa:" name="justification" display="flex" style={{ fontSize: '12px', padding: '8px' }} onChange={(e) => setVerifiedStock({ ...verifiedStock, [subitem.id!]: { ...verifiedStock[subitem.id!], justification: e.target.value } })} />
                                                                </div>
                                                            </ItemsContainer>
                                                        </>
                                                    }

                                                </>
                                                : <></>
                                            }

                                        </div>
                                    ))
                                }
                            </Container>
                        ))
                    }
                </>
            </ListWrapper>

            <div style={{ margin: '30px 0' }}>
                <SignOperation show={true} handleSubmit={submitInventory} buttonText='Submeter Inventário' />
            </div>
        </>
    )
}
