import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { productsToAliquotSelector } from "../../app/selectors"
import { formatDate, isExpired } from "../../utils/dateFunctions"

import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import Title from "../../components/UI/Title"
import ListWrapper from "../../components/UI/ListWrapper"

const Container = styled.div``
const HeaderContainer = styled.div`
    display: flex;
    z-index: 1;
    position: sticky;
    top: 0;
`
const Message = styled.p`
    margin-top: 50px;
    text-align: center;
    font-style: italic;
    color: #888;
`

export default function ToAliquot() {

    const navigate = useNavigate()
    const productsToAliquot = useAppSelector(productsToAliquotSelector)

    if (productsToAliquot.length === 0) {
        return (
            <>
                <Message>Nenhum produto em espera.</Message>
            </>
        )
    }

    return (
        <>
            <Title title='Alíquotas - Produtos em espera' />

            <ListWrapper>
                <HeaderContainer>
                    <ListHeader fontSize='12px'>
                        <Item flex={3} text='Produto' fontSize='12px' />
                        <Item flex={2} text='Observação' fontSize='12px' />
                        <Item width="90px" text='Código' fontSize='12px' />
                        <Item width="90px" text='Categoria' fontSize='12px' />
                        <Item width="130px" text='Marca' fontSize='12px' />
                        <Item width="65px" text='Unidade' fontSize='12px' />
                        <Item width="65px" text='Estoque' align='center' fontSize='12px' />
                    </ListHeader>
                </HeaderContainer>
                <>
                    {
                        productsToAliquot.map((item) => (
                            <Container key={item.id}>

                                <ItemsContainer >
                                    <Item flex={3} text={item.name} />
                                    <Item flex={2} text={item.observation} />
                                    <Item width="90px" text={item.code} />
                                    <Item width="90px" text={item.category} />
                                    <Item width="130px" text={item.brand} />
                                    <Item width="65px" text={item.unit} />
                                    <Item width="65px" text={item.stock} align='center' />
                                </ItemsContainer>

                                {item.subproducts &&
                                    item.subproducts.map((subitem) => (
                                        <ItemsContainer
                                            type="subItem"
                                            bg='#eef7ff'
                                            key={subitem.id}
                                            onClick={() =>
                                                navigate(`/aliquotagem/${item.id}/${subitem.id}`,
                                                    { state: subitem })}
                                        >
                                            <Item width='200px' color='#3142a0' text={`Lote: ${subitem.lote}`} />
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
        </>
    )
}

