import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import { useAppSelector } from "../../app/hooks"
import { useEffect, useState } from "react"
import { TProduct } from "../../types/TProduct"
import { compare, formatValidity } from "../../utils/functions"
import Input from "../../components/Input"
import Select from "../../components/Select"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import ProductBtn from "../../components/ProductBtn"
import Title from "../../components/Title"
import { BsArrowDownSquare } from 'react-icons/bs'

const Container = styled.div``
const TitleContainer = styled.div`
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
const ExpandIconContainer = styled.div<{ bg: string }>`
    display: flex;
    color: #555;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.bg};
    padding-left: 10px;
    padding-right: 3px;
    border-top: 1px solid #c9c9c9;

    &:hover svg path {
        color: black;
    }
`

export default function Detalhes() {

    const navigate = useNavigate()
    const productsData = useAppSelector(state => state.produto.produtos)
    const stockOuts = useAppSelector(state => state.stockOut.stockOuts)
    const providers = useAppSelector(state => state.fornecedor.fornecedores)
    const [category, setCategory] = useState('')
    const [provider, setProvider] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([])
    const [sortedProducts, setSortedProducts] = useState<TProduct[]>([])
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState<number[]>([])
    const [isAllOpen, setIsAllOpen] = useState(false)

    let categories = Array.from(new Set(productsData.map(i => i.category)))

    const getStockOutFrequency = (id: number): number | null => {

        let dates: any[] = []
        let distances = []

        stockOuts
            .filter(i => i.product_id === id)
            .map(i => dates.push(new Date(i.createdAt!)))

        if (dates.length <= 1) return null

        for (let j = 0; j < dates.length - 1; j++) {
            distances.push(Math.abs(dates[j + 1] - dates[j]))
        }

        const sum = distances.reduce((partialSum, a) => partialSum + a, 0) / (distances.length);

        return Math.ceil(sum / (1000 * 60 * 60 * 24));
    }

    useEffect(() => {
        let products = productsData.slice().filter(i => i.hide === false)

        sort ? setSortedProducts(compare(products, sort)) : setSortedProducts(products)

    }, [sort, productsData, category])

    useEffect(() => {
        let filtered = sortedProducts

        if (category) {
            filtered = filtered.filter(i => i.category === category)
        }

        if (provider) {
            filtered = filtered.filter(i => i.providers?.includes(provider))
        }

        if (search) {
            filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        }

        setFilteredProducts(filtered)

    }, [category, sortedProducts, search, provider])

    const handleClose = () => {
        if (isAllOpen) {
            setIsOpen([])
        }
        setIsAllOpen(!isAllOpen)
    }

    return (
        <>
            <TitleContainer>
                <Title title='Produtos /' />
                <ProductBtn active={true} text='Detalhes' />
                <ProductBtn onClick={() => navigate('/produtos')} text='Resumo' />
                <ProductBtn onClick={() => navigate('/produtos/escondidos')} text='Arquivados' />
            </TitleContainer>
            <MenuContainer>
                <Button onClick={() => navigate('/novoProduto')} text={'Cadastrar Novo Produto'} />
                <Filter>
                    <InputContainer>
                        <Input name="search" label="Pesquisar:" display="flex" type='text' onChange={(e) => setSearch(e.target.value)}></Input>
                    </InputContainer>
                    <InputContainer>
                        <Select name="categories" label="Categoria:" display="flex" onChange={(e) => setCategory(e.target.value)}>
                            <option></option>
                            {categories.map((i, index) => <option key={index}>{i}</option>)}
                        </Select>
                    </InputContainer>
                    <InputContainer>
                        <Select name="providers" label="Fornecedor:" display="flex" onChange={(e) => setProvider(e.target.value)}>
                            <option></option>
                            {providers.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                        </Select>
                    </InputContainer>
                </Filter>
            </MenuContainer>
            <div style={{ display: 'flex' }}>

                <ExpandIconContainer
                    bg='#5fb4ff'
                    onClick={handleClose}>
                    <BsArrowDownSquare />
                </ExpandIconContainer>
                <ListHeader fontSize='12px'>
                    <Item width="26px" text='Id' onClick={() => setSort('id')} cursor='pointer' fontSize='12px' />
                    <Item flex={3} text='Produto' onClick={() => setSort('name')} cursor='pointer' fontSize='12px' />
                    <Item flex={2} text='Observação' fontSize='12px' />
                    <Item width="90px" text='Código' fontSize='12px' />
                    <Item flex={2} text='Fornecedores' fontSize='12px' onClick={() => setSort('providers')} cursor='pointer' />
                    <Item width="90px" text='Categoria' onClick={() => setSort('category')} cursor='pointer' fontSize='12px' />
                    <Item width="130px" text='Marca' onClick={() => setSort('brand')} cursor='pointer' fontSize='12px' />
                    <Item width="65px" text='Unidade' onClick={() => setSort('unit')} cursor='pointer' fontSize='12px' />
                    <Item width="65px" text='Estoque' align='center' fontSize='12px' />
                    <Item width="65px" text='Est. Mín.' align='center' fontSize='12px' />
                    <Item width="65px" text='Est. Max.' align='center' fontSize='12px' />
                    <Item width="83px" text='Frequência Retirada' align='center' fontSize='12px' />
                </ListHeader>
            </div>

            {
                filteredProducts.map((item) => (
                    <Container key={item.id}>
                        <div style={{ display: 'flex' }}>
                            <ExpandIconContainer
                                bg='#cbe6ff'
                                onClick={() => (
                                    isOpen.includes(item.id!)
                                        ? setIsOpen(isOpen.filter(id => id !== item.id))
                                        : setIsOpen([...isOpen, item.id!])
                                )}>
                                <BsArrowDownSquare />
                            </ExpandIconContainer>
                            <ItemsContainer onClick={() => navigate(`/produtos/${item.id}`, { state: item })}>
                                <Item width="26px" text={item.id} fontSize='12px' />
                                <Item flex={3} text={item.name} fontSize='12px' />
                                <Item flex={2} text={item.observation} fontSize='12px' />
                                <Item width="90px" text={item.code} fontSize='12px' />
                                <Item flex={2} text={item.providers?.map((i) => `${i} `)} fontSize='12px' />
                                <Item width="90px" text={item.category} fontSize='12px' />
                                <Item width="130px" text={item.brand} fontSize='12px' />
                                <Item width="65px" text={item.unit} fontSize='12px' />
                                <Item width="65px" text={item.stock} align='center' fontSize='12px' />
                                <Item width="65px" text={item.min_stock} align='center' fontSize='12px' />
                                <Item width="65px" text={item.max_stock} align='center' fontSize='12px' />
                                <Item width="83px" text={getStockOutFrequency(item.id!)} align='center' fontSize='12px' />
                            </ItemsContainer>

                        </div>

                        {item.subproducts && (isOpen.includes(item.id!) || isAllOpen) &&
                            item.subproducts.map((subitem) => (
                                <ItemsContainer
                                    type="subItem"
                                    bg='#eef7ff'
                                    key={subitem.id}
                                    onClick={() =>
                                        navigate(`/produtos/${item.id}/subprodutos/${subitem.id}`,
                                            { state: subitem })}
                                >
                                    <div style={{ marginLeft: '60px' }}>
                                        <Item width='200px' color='#3142a0' text={`Lote: ${subitem.lote}`} />
                                    </div>
                                    <Item width='280px' color='#3142a0' text={`Validade: ${formatValidity(subitem.validade)}`} />
                                    <Item width='200px' color='#3142a0' text={`Quantidade: ${subitem.quantity}`} />
                                </ItemsContainer>
                            ))
                        }
                    </Container>
                ))
            }
        </>
    )
}
