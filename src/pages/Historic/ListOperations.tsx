import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useEffect, useState } from "react"
import { TStockIn } from "../../types/TStockIn"
import Select from '../../components/UI/Select'
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import Title from "../../components/UI/Title"
import { groupStockByDate } from "../../utils/functions"
import ExportJSON from "../../components/Actions/ExportJSON"
import ListWrapper from "../../components/UI/ListWrapper"
import { getAllHistoric } from "../../features/historic/historicSlice"
import { formatDate } from "../../utils/dateFunctions"

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Filter = styled.div`
    display: flex;
    align-items: center;
`

type Props = {
    productFilter?: string
}

export default function ListOperations({ productFilter }: Props) {

    const historic = useAppSelector(state => state.historic.historic)
    const products = useAppSelector(state => state.product.products)
    const [orderedHistoric, setOrderedHistoric] = useState<{ [key: string]: any }>({})
    const [filteredHistoric, setFilteredHistoric] = useState<{ [key: string]: any }>({})
    const [filter, setFilter] = useState('')

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllHistoric())
    }, [dispatch])

    useEffect(() => {

        let filteredHistoric = productFilter ? historic.filter(i => i.product?.name === productFilter) : historic
        const historicByDate = groupStockByDate(filteredHistoric) as { [key: string]: TStockIn[] }
        setOrderedHistoric(historicByDate)

    }, [productFilter, products, historic])

    useEffect(() => {
        if (filter) {
            setFilteredHistoric(Object.keys(orderedHistoric)
                .filter((key) => key.includes(filter))
                .reduce((cur, key) => { return Object.assign(cur, { [key]: orderedHistoric[key] }) }, {})
            )
        } else {
            setFilteredHistoric(orderedHistoric)
        }
    }, [filter, orderedHistoric])

    const getColor = (description: string, highlight?: boolean): string => {
        if (highlight) {
            if (description === "Entrada") return '#a3ff86'
            if (description === "Retirada") return '#ffa7a7'
            if (description === "Ajuste") return '#a8aeff'
            return '#f5ff6d'
        }

        if (description === "Entrada") return '#ceffbf'
        if (description === "Retirada") return '#ffc6c6'
        if (description === "Ajuste") return '#c6caff'
        return '#fbffc6'
    }

    return (
        <>
            <HeaderContainer>
                <Title title='Histórico' />
                <Filter>
                    <Select
                        display="flex"
                        name="filter"
                        label="Ação:"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option></option>
                        <option value="Entrada">Entradas</option>
                        <option value="Retirada">Retiradas</option>
                        <option value="Ajuste">Ajustes</option>
                        <option value="Alíquota">Alíquotas</option>
                    </Select>
                </Filter>
            </HeaderContainer>

            <ListWrapper>
                <ListHeader>
                    <Item width='90px' text='Horário' />
                    <Item flex={4} text='Produto' />
                    <Item width='100px' text='Fornecedor' />
                    <Item flex={1.5} text='Marca' />
                    <Item width='80px' text='Unidade' />
                    <Item width='80px' text='Preço' />
                    <Item flex={1} text='Lote' />
                    <Item width='90px' text='Validade' />
                    <Item width='70px' text='Qtd.' align='center' />
                    <Item width='80px' text='Usuário' />
                </ListHeader>
                <>
                    {
                        Object.keys(filteredHistoric).map(key => (
                            <ItemsContainer
                                key={key}
                                subproducts={
                                    filteredHistoric[key].map((item: any, index: any) => (
                                        < div key={index}  >
                                            <ItemsContainer bg={getColor(item.description)} >
                                                <Item width='90px' text={item.createdAt!.slice(11, 19)} />
                                                <Item flex={4} text={item.product.name} />
                                                <Item width='100px' text={item.provider?.name} />
                                                <Item flex={1.5} text={item.product.brand} />
                                                <Item width='80px' text={item.product.unit} />
                                                <Item width='80px' text={item.price} />
                                                <Item flex={1} text={item.lote} />
                                                <Item width='90px' text={formatDate(item.validade)} />
                                                <Item width='70px' text={item.quantity} align='center' />
                                                <Item width='80px' text={item.user?.name} />
                                            </ItemsContainer>
                                        </div>
                                    ))
                                }
                                bg={getColor(key.split('_')[1], true)}
                            >
                                <Item width='90px' text={`${key.split('_')[0].slice(8, 10)}/${key.split('_')[0].slice(5, 7)}/${key.split('_')[0].slice(0, 4)}`} />
                                <Item text={key.split('_')[1]} />
                            </ItemsContainer>
                        ))
                    }
                </>
            </ListWrapper>
            <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'flex-end' }}>
                <ExportJSON data={filteredHistoric} fileName={`produtos-${new Date().toISOString().slice(0, 10)}`} />
            </div>

        </>
    )
}
