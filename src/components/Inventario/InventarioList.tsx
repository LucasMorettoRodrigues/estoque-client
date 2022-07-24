import styled from "styled-components"
import { IProductInventory } from "../../types/TProduct"
import Item from "../List/Item"
import ItemsContainer from "../List/ItemsContainer"
import ListHeader from "../../components/List/ListHeader"
import ListWrapper from "../UI/ListWrapper"
import { formatDate } from "../../utils/dateFunctions"
import AdjustButton from "./AdjustButton"
import { TInventory } from "../../types/TInventory"

const Container = styled.div``
const HeaderContainer = styled.div`
    display: flex;
    z-index: 1;
    position: sticky;
    top: 0;
`
const Title = styled.h3`
    margin-top: 40px; 
    margin-bottom: 10px;
`

type Props = {
    products: IProductInventory[],
    title: string
    adjustButton?: boolean
    inventory: TInventory
}

export default function InventarioList({ products, title, adjustButton, inventory }: Props) {

    if (products.length === 0) {
        return <></>
    }

    return (
        <>
            <Title>
                {title}
            </Title>
            <ListWrapper>
                <HeaderContainer>
                    <ListHeader fontSize='12px'>
                        <Item width="26px" text='Id' fontSize='12px' />
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
                        products.map((item) => (
                            <Container key={item.id}>
                                <div style={{ display: 'flex' }}>
                                    <ItemsContainer>
                                        <Item width="26px" text={item.id} fontSize='12px' />
                                        <Item flex={3} text={item.name} fontSize='12px' />
                                        <Item flex={2} text={item.observation} fontSize='12px' />
                                        <Item width="90px" text={item.code} fontSize='12px' />
                                        <Item width="90px" text={item.category} fontSize='12px' />
                                        <Item width="130px" text={item.brand} fontSize='12px' />
                                        <Item width="65px" text={item.unit} fontSize='12px' />
                                        <Item width="65px" text={item.stock} align='center' fontSize='12px' />
                                    </ItemsContainer>
                                </div>

                                {item.subproducts &&
                                    item.subproducts.map((subitem) => (
                                        <ItemsContainer
                                            type="subItem"
                                            bg={subitem.justification ? '#ffd2d2' : '#eef7ff'}
                                            key={subitem.id}
                                        >
                                            <Item width='200px' color='#3142a0' text={`Lote: ${subitem.lote}`} />
                                            <Item width='150px' color='#3142a0' text={`Validade: ${formatDate(subitem.validade)}`} />
                                            <>
                                                {subitem.inventory === subitem.quantity &&
                                                    <Item width='90px' color='#3142a0' text={`Qtd: ${subitem.inventory}`} />
                                                }
                                            </>
                                            <>
                                                {subitem.inventory !== subitem.quantity &&
                                                    <>
                                                        <Item width='90px' color='#3142a0' text={`Qtd (sis): ${subitem.quantity}`} />
                                                        <Item width='90px' color='#3142a0' text={`Qtd (inv): ${subitem.inventory}`} />
                                                    </>
                                                }
                                            </>
                                            <>
                                                {subitem.justification &&
                                                    <>
                                                        <Item flex={1} color='#3142a0' text={`Motivo: ${subitem.reason}`} />
                                                        <Item flex={2} color='#3142a0' text={`Justificativa: ${subitem.justification}`} />
                                                    </>
                                                }
                                            </>
                                            <>
                                                {adjustButton && !subitem.adjusted &&
                                                    <AdjustButton subProduct={subitem} inventory={inventory} />
                                                }
                                            </>
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
