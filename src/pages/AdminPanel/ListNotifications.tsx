import styled from "styled-components"
import { useAppSelector } from "../../app/hooks"
import ListHeader from "../../components/List/ListHeader"
import Item from "../../components/List/Item"
import ItemsContainer from "../../components/List/ItemsContainer"
import ListWrapper from "../../components/UI/ListWrapper"
import { formatDate } from "../../utils/dateFunctions"
import AdminPanelHeader from "../../components/AdminPanel/AdminPanelHeader"

const Container = styled.div``

export default function ListNotifications() {

    const notifications = useAppSelector(state => state.notification.notifications.filter(
        i => i.description === 'Notificação de Validade Incorreta'
    ))

    return (
        <>
            <AdminPanelHeader title={'Histórico de Retiradas Incorretas'} active={'Notifications'} />
            <ListWrapper>
                <ListHeader>
                    <Item width="100px" text='Data' />
                    <Item flex={1} text='Produto' />
                    <Item flex={1} text='Motivo' />
                    <Item width="200px" text='Lote' />
                    <Item width="100px" text='Validade' />
                    <Item width="100px" text='Qtd. Retirada' />
                    <Item width="100px" text='Usuário' />
                </ListHeader>
                <>
                    {
                        notifications.map((item) => (
                            <Container key={item.id}>
                                <ItemsContainer>
                                    <Item width="100px" text={formatDate(item.createdAt)} />
                                    <Item flex={1} text={item.data!.product} />
                                    <Item flex={1} text={item.data!.message} />
                                    <Item width="200px" text={item.data!.subproduct} />
                                    <Item width="100px" text={formatDate(item.data!.validity)} />
                                    <Item width="100px" align="center" text={item.data.quantity} />
                                    <Item width="100px" text={item.user!.name} />
                                </ItemsContainer>
                            </Container>
                        ))
                    }
                </>
            </ListWrapper>
        </>
    )
}
