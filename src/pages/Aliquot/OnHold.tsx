import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { formatValidity, isExpired } from "../../utils/functions"
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

export default function OnHold() {

    const navigate = useNavigate()

    const products = useAppSelector(state => state.produto.produtos)

    const productsOnHold = products
        .filter(product => product.qty_to_child &&
            product.product_child_id &&
            product.subproducts!.length > 0
        )

    return (
        <>
            <Title title='Produtos Em Espera Para Aliquotagem' />

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
                        productsOnHold.map((item) => (
                            <Container key={item.id}>

                                <ItemsContainer >
                                    <Item flex={3} text={item.name} fontSize='12px' />
                                    <Item flex={2} text={item.observation} fontSize='12px' />
                                    <Item width="90px" text={item.code} fontSize='12px' />
                                    <Item width="90px" text={item.category} fontSize='12px' />
                                    <Item width="130px" text={item.brand} fontSize='12px' />
                                    <Item width="65px" text={item.unit} fontSize='12px' />
                                    <Item width="65px" text={item.stock} align='center' fontSize='12px' />
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
                                            <div style={{ marginLeft: '60px' }}>
                                                <Item width='200px' color='#3142a0' text={`Lote: ${subitem.lote}`} />
                                            </div>
                                            <Item
                                                width='280px'
                                                color={isExpired(subitem.validade!) ? 'red' : '#3142a0'}
                                                text={`Validade: ${formatValidity(subitem.validade)}`}
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

