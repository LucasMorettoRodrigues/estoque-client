import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import { useAppSelector } from "../../app/hooks"
import { mergeProducts } from "../../utils/functions"
import { useEffect, useState } from "react"
import { TProduct } from "../../types/TProduct"
import Select from "../../components/Select"
import Input from "../../components/Input"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import ProductBtn from "../../components/ProductBtn"

const Container = styled.div``
const Title = styled.h1`
    display: flex;
    color: #222;
    margin: 30px 0;
`
const ProductsBtnContainer = styled.div`
    display: flex;
`
const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`
const Filter = styled.div`
    display: flex;
    align-items: center;
`
const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 20px;
`
const Label = styled.label`
    margin-right: 5px;
    cursor: pointer;
`
const CheckBox = styled.input`
    padding: 5px 10px;
    margin-right: 10px;
`

export default function Produtos() {

    const navigate = useNavigate()
    const products = useAppSelector(state => state.produto.produtos)
    const providers = useAppSelector(state => state.fornecedor.fornecedores)
    const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([])
    const [lowStockFilter, setLowStockFilter] = useState(false)
    const [search, setSearch] = useState('')
    const [provider, setProvider] = useState('')

    useEffect(() => {
        let filtered = []

        if (lowStockFilter) {
            filtered = mergeProducts(products).filter(i => i.stock < i.min_stock)
        } else {
            filtered = mergeProducts(products)
        }

        if (search) {
            filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        }

        if (provider) {
            filtered = filtered.filter(i => i.providers?.includes(provider))
        }

        setFilteredProducts(filtered)
    }, [lowStockFilter, products, search, provider])

    return (
        <>
            <Title>Produtos /
                <ProductsBtnContainer>
                    <ProductBtn onClick={() => navigate('/produtos/detalhes')} text='Detalhes' />
                    <ProductBtn active={true} text='Resumo' />
                    <ProductBtn onClick={() => navigate('/produtos/escondidos')} text='Arquivados' />
                </ProductsBtnContainer>
            </Title>
            <MenuContainer>
                <Button onClick={() => navigate('/novoProduto')} text={'Cadastrar Novo Produto'} />
                <Filter>
                    <InputContainer>
                        <Input name="search" label="Pesquisar:" display="flex" type='text' onChange={(e) => setSearch(e.target.value)}></Input>
                    </InputContainer>
                    <InputContainer>
                        <Select name="providers" label="Fornecedores:" display="flex" onChange={(e) => setProvider(e.target.value)}>
                            <option></option>
                            {providers.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                        </Select>
                    </InputContainer>
                    <CheckBox style={{ width: '18px', height: '18px', cursor: 'pointer' }} onChange={() => setLowStockFilter(!lowStockFilter)} id="lowStock" name="lowStock" type='checkbox'></CheckBox>
                    <Label htmlFor="lowStock">Produtos em falta</Label>
                </Filter>
            </MenuContainer>
            <ListHeader>
                <Item flex={8} text='Produto' />
                <Item flex={2} text='Fornecedores' />
                <Item flex={1} text='Estoque' align='center' />
                <Item flex={1} text='Est. Mín' align='center' />
                <Item flex={1} text='Est. Max' align='center' />
            </ListHeader>
            {
                filteredProducts.map((item) => (
                    <Container key={item.id}>
                        <ItemsContainer onClick={() => navigate(`/produtos/${item.id}/historico`, { state: item })}>
                            <Item flex={8} text={item.name} />
                            <Item flex={2} text={item.providers?.map(i => `${i} `)} />
                            <Item flex={1} text={item.stock} align='center'
                                bg={item.stock < item.min_stock
                                    ? '#ff5353'
                                    : (item.stock == 0 && item.min_stock == 0) ? '#ff5353' : 'inherit'
                                } />
                            <Item flex={1} text={item.min_stock} align='center' />
                            <Item flex={1} text={item.max_stock} align='center' />
                        </ItemsContainer>
                    </Container>
                ))
            }
        </>
    )
}
