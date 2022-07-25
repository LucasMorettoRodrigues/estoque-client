import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import { useNavigate } from "react-router-dom"
import ListWrapper from "../../components/UI/ListWrapper"
import { formatDate } from "../../utils/dateFunctions"
import AdminPanelHeader from "../../components/AdminPanel/AdminPanelHeader"
import { useEffect } from "react"
import { getAllInventories } from "../../features/inventory/inventorySlice"

const Container = styled.div``

export default function ListInventarios() {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllInventories())
    }, [dispatch])

    const inventories = useAppSelector(state => state.inventory.inventories)

    return (
        <>
            <AdminPanelHeader title={'Histórico de Inventários'} active={'Inventories'} />

            <ListWrapper>
                <ListHeader>
                    <Item width="100px" text='Data' />
                    <Item width="90px" text='Hora' />
                    <Item width="140px" text='Categoria' />
                    <Item flex={1} text='Responsável' />
                </ListHeader>
                <>
                    {
                        inventories.map((item) => (
                            <Container key={item.id}>
                                <ItemsContainer onClick={() => navigate(`/inventarios/${item.id}`)}>
                                    <Item width="100px" text={formatDate(item.createdAt)} />
                                    <Item width='90px' text={item.createdAt?.slice(11, 19)} />
                                    <Item width="140px" text={item.category} />
                                    <Item flex={1} text={item.user!.name} />
                                </ItemsContainer>
                            </Container>
                        ))
                    }
                </>
            </ListWrapper>
        </>
    )
}
