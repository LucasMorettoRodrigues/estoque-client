import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import Button from "../../components/UI/Button"
import { useAppSelector } from "../../app/hooks"
import { compare, mergeProducts } from "../../utils/functions"
import { useEffect, useState } from "react"
import { TProduct } from "../../types/TProduct"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import ProductBtn from "../../components/UI/ProductBtn"
import Title from "../../components/UI/Title"
import Filters from "../../components/UI/Filters"
import ListWrapper from "../../components/UI/ListWrapper"

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

export default function ProductsResume() {

    const navigate = useNavigate()

    const products = useAppSelector(state => state.product.products)
    const missingFilter = useAppSelector(state => state.product.missingFilter)
    const providerFilter = useAppSelector(state => state.product.providerFilter)
    const searchFilter = useAppSelector(state => state.product.searchFilter)

    const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([])
    const [sort, setSort] = useState('')
    const [sortedProducts, setSortedProducts] = useState<TProduct[]>([])

    useEffect(() => {
        let produtos = products.slice()

        sort ? setSortedProducts(compare(produtos, sort)) : setSortedProducts(produtos)

    }, [sort, products])

    useEffect(() => {
        let filtered = mergeProducts(sortedProducts)

        if (missingFilter) {
            filtered = filtered.filter(i => i.stock < i.min_stock)
        }

        if (searchFilter) {
            filtered = filtered.filter(i => i.name.toLowerCase().includes(searchFilter))
        }

        if (providerFilter.length > 0) {
            filtered = filtered.filter(i => providerFilter.some(r => i.providers?.includes(r)))
        }

        setFilteredProducts(filtered)
    }, [missingFilter, sortedProducts, searchFilter, providerFilter])

    return (
        <>
            <TitleContainer>
                <Title title='Produtos /' />
                <ProductBtn onClick={() => navigate('/produtos/detalhes')} text='Detalhes' />
                <ProductBtn active={true} text='Resumo' />
                <ProductBtn onClick={() => navigate('/produtos/escondidos')} text='Arquivados' />
            </TitleContainer>
            <MenuContainer>
                <Button onClick={() => navigate('/novoProduto')} text={'Cadastrar Novo Produto'} />
                <Filters hasCategoryFilter={false} hasMissingFilter />
            </MenuContainer>

            <ListWrapper>
                <ListHeader>
                    <Item flex={8} text='Produto' cursor='pointer' onClick={() => setSort('name')} />
                    <Item flex={2} text='Fornecedores' cursor='pointer' onClick={() => setSort('providers')} />
                    <Item flex={1} text='Estoque' align='center' />
                    <Item flex={1} text='Est. Mín' align='center' />
                    <Item flex={1} text='Est. Max' align='center' />
                </ListHeader>
                <>
                    {
                        filteredProducts.map((item) => (
                            <Container key={item.id}>
                                <ItemsContainer onClick={() => navigate(`/produtos/${item.id}/historico`, { state: item })}>
                                    <Item flex={8} text={item.name} />
                                    <Item flex={2} text={item.providers?.map(i => `${i}`).toString().replaceAll(',', ', ')} />
                                    <Item flex={1} text={item.stock} align='center'
                                        bg={item.stock < item.min_stock
                                            ? '#ff5353'
                                            : (item.stock === 0 && item.min_stock === 0) ? '#ff5353' : 'inherit'
                                        } />
                                    <Item flex={1} text={item.min_stock} align='center' />
                                    <Item flex={1} text={item.max_stock} align='center' />
                                </ItemsContainer>
                            </Container>
                        ))
                    }
                </>
            </ListWrapper>
        </>
    )
}
