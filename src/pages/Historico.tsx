import styled from "styled-components"
import { useAppSelector } from "../app/hooks"
import { getProduct, getProvider } from "../utils/functions"
import { useEffect, useState } from "react"
import { TStockIn } from "../types/TStockIn"
import { TStockOut } from "../types/TStockOut"
import { AiFillPlusSquare } from 'react-icons/ai'

const Container = styled.div<{ show?: boolean }>`
    visibility: ${props => props.show === false ? 'hidden' : 'visible'};
    height: ${props => props.show === false ? '0px' : 'auto'};
`
const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Title = styled.h1`
    color: #222;
    margin: 30px 0;
`
const Filter = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`
const Label = styled.label`
    margin-right: 5px;
`
const Select = styled.select`
    padding: 5px 10px;
`
const ListHeader = styled.div`
    height: 45px;
    padding: 0 10px;
    background-color: #5fb4ff;
    height: 45px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 1px solid #cacaca;
`
const ListHeaderItem = styled.p<{ flex?: number }>`
    flex: ${props => props.flex ? props.flex : null};
    min-width: 75px;
    padding: 10px;
`
const Product = styled.ul<{ backgroundColor: string }>`
    height: 40px;
    background-color: ${props => props.backgroundColor};
    display: flex;
    align-items: center;
    border-bottom: 1px solid #cacaca;
`
const ProductLi = styled.li<{ flex?: number, color?: string }>`
    flex: ${props => props.flex ? props.flex : null};
    align-items: center;
    background-color: ${props => props.color ? props.color : null};
    font-size: 14px;
    min-width: 75px;
    padding: 10px;
`

type Props = {
    productFilter?: string
}

export default function Historico({ productFilter }: Props) {

    const stockOuts = useAppSelector(state => state.stockOut.stockOuts)
    const stockIns = useAppSelector(state => state.stockIn.stockIns)
    const products = useAppSelector(state => state.produto.produtos)
    const providers = useAppSelector(state => state.fornecedor.fornecedores)
    const [orderedStocks, setOrderedStocks] = useState<{ [key: string]: any }>({})
    const [filteredStocks, setFilteredStocks] = useState<{ [key: string]: any }>({})
    const [filter, setFilter] = useState('')
    const [show, setShow] = useState('')

    useEffect(() => {

        let stockInByDate: { [key: string]: TStockIn[] } = {}
        let stockOutByDate: { [key: string]: TStockOut[] } = {}

        const filteredIns = productFilter ? stockIns.filter(i => getProduct(products, i.product_id)?.name === productFilter) : stockIns
        const filteredOuts = productFilter ? stockOuts.filter(i => getProduct(products, i.product_id)?.name === productFilter) : stockOuts

        filteredIns.forEach((i) => {
            let index = i.date!.slice(0, 10) + '_in'
            if (stockInByDate[index]) {
                stockInByDate[index].push(i)
            } else {
                stockInByDate[index] = [i]
            }
        })

        filteredOuts.forEach((i) => {
            let index = i.date!.slice(0, 10) + '_out'
            if (stockOutByDate[index]) {
                stockOutByDate[index].push(i)
            } else {
                stockOutByDate[index] = [i]
            }
        })

        const stocks = { ...stockInByDate, ...stockOutByDate }

        let orderedStocks = Object.keys(stocks).sort().reduce(
            (obj: { [key: string]: any }, key) => {
                obj[key] = stocks[key];
                return obj;
            },
            {}
        );

        setOrderedStocks(orderedStocks)

    }, [stockIns, stockOuts, productFilter, products])

    useEffect(() => {
        if (!filter) {
            setFilteredStocks(orderedStocks)
        }

        if (filter === 'Compras') {
            setFilteredStocks(Object.keys(orderedStocks)
                .filter((key) => key.includes('_in'))
                .reduce((cur, key) => { return Object.assign(cur, { [key]: orderedStocks[key] }) }, {})
            )
        }

        if (filter === 'Retiradas') {
            setFilteredStocks(Object.keys(orderedStocks)
                .filter((key) => key.includes('_out'))
                .reduce((cur, key) => { return Object.assign(cur, { [key]: orderedStocks[key] }) }, {})
            )
        }
    }, [filter, orderedStocks])

    return (
        <>
            <HeaderContainer>
                <Title>Histórico</Title>
                <Filter>
                    <Label>Ação:</Label>
                    <Select onChange={(e) => setFilter(e.target.value)}>
                        <option></option>
                        <option>Compras</option>
                        <option>Retiradas</option>
                    </Select>
                </Filter>
            </HeaderContainer>
            <ListHeader>
                <ListHeaderItem flex={0.9}>Data</ListHeaderItem>
                <ListHeaderItem flex={1}>Ação</ListHeaderItem>
                <ListHeaderItem flex={3}>Produto</ListHeaderItem>
                <ListHeaderItem flex={1}>Fornecedor</ListHeaderItem>
                <ListHeaderItem flex={1}>Marca</ListHeaderItem>
                <ListHeaderItem flex={1}>Unidade</ListHeaderItem>
                <ListHeaderItem flex={0.9}>Preço</ListHeaderItem>
                <ListHeaderItem flex={0.7}>Lote</ListHeaderItem>
                <ListHeaderItem flex={1}>Validade</ListHeaderItem>
                <ListHeaderItem flex={0.8} style={{ textAlign: 'center' }}>Quantidade</ListHeaderItem>
            </ListHeader>
            {
                Object.keys(filteredStocks).reverse().map(key => (
                    < Container key={key} >
                        <Product backgroundColor={key.split('_')[1] === 'in' ? '#a3ff86' : '#ffa7a7'} >
                            <ProductLi flex={1}>{key.split('_')[0]}</ProductLi>
                            <ProductLi flex={12}>{key.split('_')[1] === 'in' ? "Compra" : "Retirada"}</ProductLi>
                            <ProductLi style={{ marginTop: '3px' }} onClick={() => setShow(show === key ? '' : key)}>
                                <AiFillPlusSquare fontSize='22px' color="#f1f1f1" cursor='pointer' style={{ backgroundColor: 'black' }} />
                            </ProductLi>
                        </Product>
                        {
                            filteredStocks[key].map((item: any, index: any) => (
                                < Container key={index} show={show === key ? true : false} >
                                    <Product backgroundColor={key.split('_')[1] === 'in' ? '#a3ff86' : '#ffa7a7'} >
                                        <ProductLi flex={0.9}></ProductLi>
                                        <ProductLi flex={1}></ProductLi>
                                        <ProductLi flex={3}>{getProduct(products, item.product_id)?.name}</ProductLi>
                                        <ProductLi flex={1}>{item.provider_id && getProvider(providers, item.provider_id)?.name}</ProductLi>
                                        <ProductLi flex={1}>{getProduct(products, item.product_id)?.brand}</ProductLi>
                                        <ProductLi flex={1}>{getProduct(products, item.product_id)?.unit}</ProductLi>
                                        <ProductLi flex={0.9}></ProductLi>
                                        <ProductLi flex={0.7}>{item.lote}</ProductLi>
                                        <ProductLi flex={1}>{item.validade && item.validade.slice(0, 10)}</ProductLi>
                                        <ProductLi flex={0.8} style={{ textAlign: 'center' }}>- {item.quantity}</ProductLi>
                                    </Product>
                                </Container>
                            ))
                        }
                    </Container>
                ))
            }
        </>
    )
}
