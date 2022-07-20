import styled from "styled-components"
import { useAppSelector } from "../../app/hooks"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import { useNavigate } from "react-router-dom"
import ListWrapper from "../../components/UI/ListWrapper"
import { formatDate } from "../../utils/dateFunctions"
import { inventoriesSelector } from "../../app/selectors"
import AdminPanelHeader from "../../components/AdminPanel/AdminPanelHeader"

const Container = styled.div``

export default function ListInventarios() {

    const navigate = useNavigate()

    const notifications = useAppSelector(inventoriesSelector)

    const getCategory = (category: string) => {
        if (category === "Descartáveis") return "Descartáveis"
        if (category === "Reagentes" || category === "Kits") return "Reagentes e Kits"

        return ""
    }

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
                        notifications.map((item) => (
                            <Container key={item.id}>
                                <ItemsContainer onClick={() => navigate(`/inventarios/${item.id}`, { state: item })}>
                                    <Item width="100px" text={formatDate(item.createdAt)} />
                                    <Item width='90px' text={item.createdAt?.slice(11, 19)} />
                                    <Item width="140px" text={getCategory(item.data[0].category)} />
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
