import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import Button from "../../components/UI/Button"
import { useAppSelector } from "../../app/hooks"
import { useEffect, useState } from "react"
import { TProduct } from "../../types/TProduct"
import { compare } from "../../utils/functions"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import ProductBtn from "../../components/UI/ProductBtn"
import Title from "../../components/UI/Title"
import { BsFillPlusSquareFill } from 'react-icons/bs'
import Filters from "../../components/UI/Filters"
import ListWrapper from "../../components/UI/ListWrapper"
import { formatDate, isExpired } from "../../utils/dateFunctions"
import ExportXLSX from "../../components/Actions/ExportXLSX"

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
const HeaderContainer = styled.div`
    display: flex;
    z-index: 1;
    position: sticky;
    top: 0;
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

    const productsData = useAppSelector(state => state.product.products)
    const stockOuts = useAppSelector(state => state.historic.historic.filter(i => i.description === 'Retirada'))
    const providerFilter = useAppSelector(state => state.product.providerFilter)
    const categoryFilter = useAppSelector(state => state.product.categoryFilter)
    const searchFilter = useAppSelector(state => state.product.searchFilter)

    const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([])
    const [sortedProducts, setSortedProducts] = useState<TProduct[]>([])
    const [sort, setSort] = useState('')
    const [isOpen, setIsOpen] = useState<number[]>([])
    const [isAllOpen, setIsAllOpen] = useState(false)

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

    }, [sort, productsData])

    useEffect(() => {
        let filtered = sortedProducts

        if (categoryFilter.length > 0) {
            filtered = filtered.filter(i => categoryFilter.includes(i.category))
        }

        if (providerFilter.length > 0) {
            filtered = filtered.filter(i => providerFilter.some(r => i.providers?.includes(r)))
        }

        if (searchFilter) {
            filtered = filtered.filter(i => i.name.toLowerCase().includes(searchFilter))
        }

        setFilteredProducts(filtered)

    }, [categoryFilter, sortedProducts, searchFilter, providerFilter])

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
                <Filters hasMissingFilter={false} hasCategoryFilter />
            </MenuContainer>

            <ListWrapper>
                <HeaderContainer>
                    <ExpandIconContainer
                        bg='#5fb4ff'
                        onClick={handleClose}>
                        <BsFillPlusSquareFill color="#333" size='15px' />
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
                </HeaderContainer>
                <>
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
                                        <BsFillPlusSquareFill color="#333" size='15px' />
                                    </ExpandIconContainer>
                                    <ItemsContainer onClick={() => navigate(`/produtos/${item.id}`, { state: item })}>
                                        <Item width="26px" text={item.id} fontSize='12px' />
                                        <Item flex={3} text={item.name} fontSize='12px' />
                                        <Item flex={2} text={item.observation} fontSize='12px' />
                                        <Item width="90px" text={item.code} fontSize='12px' />
                                        <Item flex={2} text={item.providers?.map(i => `${i}`).toString().replaceAll(',', ', ')} fontSize='12px' />
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
                                            <Item
                                                width='280px'
                                                color={isExpired(subitem.validade!) ? 'red' : '#3142a0'}
                                                text={`Validade: ${formatDate(subitem.validade)}`}
                                            />
                                            <Item width='200px' color='#3142a0' text={`Quantidade: ${subitem.quantity}`} />
                                        </ItemsContainer>
                                    ))
                                }
                            </Container>
                        ))
                    }
                </>
            </ListWrapper>
            <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'flex-end' }}>
                <ExportXLSX data={productsData} fileName={`produtos-${new Date().toISOString().slice(0, 10)}`} />
            </div>
        </>
    )
}
