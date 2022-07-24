import { AiOutlineDelete } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch } from "../../app/hooks"
import { archiveNotification, deleteNotification } from "../../features/notification/notificationSlice"
import { TNotification } from "../../types/TNotification"
import EditDeleteButton from "./EditDeleteButton"
import { MouseEvent } from 'react'
import { formatDate } from "../../utils/dateFunctions"

const NotificationContainer = styled.div`
    padding: 10px;
    width: 80%;
    margin: 5px auto;
    padding-left: 20px;
    border-radius: 5px;
    background-color: white;
    border: 2px solid #d8d8d8;
    align-self: center;
    justify-self:center;
    cursor: pointer;

    &:hover {
        background-color: #badaf8;
    }
`
const NotificationRow = styled.div`
    display: flex;
    align-items: center;
`
const NotificationItem = styled.div`
    margin: 5px;
    display: flex;
    align-items: center;
`
const Description = styled.div<{ bk: string }>`
    width: fit-content;
    padding: 2px 6px;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    background-color: ${props => props.bk === 'Solicitação para Inserir' ? '#3dc73d' : props.bk === 'Inventário' ? '#168eff' : '#ff3e3e'};
`
const Text = styled.span`
    margin-top: 2px;    
    margin-right: 5px;
    color: #666;
    font-size: 14px;
`

type Props = {
    notification: TNotification
}

export default function Notification({ notification }: Props) {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleDelete = (e: MouseEvent<HTMLLIElement>, item: TNotification) => {
        e.stopPropagation()

        if (item.description === 'Solicitação para Inserir') {
            dispatch(deleteNotification(item.id!))
        }

        if (item.description === 'Notificação de Validade Incorreta') {
            dispatch(archiveNotification({ ...item, archived: true }))
        }

        if (item.description === 'Inventário') {
            dispatch(deleteNotification(item.id!))
        }
    }

    const handleClick = (item: TNotification) => {
        if (item.description === 'Solicitação para Inserir') {
            navigate('/inserir', { state: item })
        }

        if (item.description === 'Inventário') {
            navigate(`/inventarios/${item.data.inventory_id}`)
            dispatch(deleteNotification(item.id!))
        }
    }

    return (
        <NotificationContainer>
            <NotificationRow onClick={() => handleClick(notification)}>
                <NotificationItem style={{ flex: 1 }}>
                    <Description bk={notification.description}>
                        {notification.description}
                    </Description>
                </NotificationItem>
                <NotificationItem style={{ flex: 1 }}><Text>Enviado por:</Text>{notification.user?.name}</NotificationItem>
                <NotificationItem style={{ width: '90px', fontSize: '14px', color: '#666' }}>{formatDate(notification.createdAt)}</NotificationItem>
                <EditDeleteButton width="40px"
                    onClick={(e) => handleDelete(e, notification)}>
                    <AiOutlineDelete />
                </EditDeleteButton>
            </NotificationRow>

            {notification.description === 'Notificação de Validade Incorreta' &&
                <>
                    <NotificationRow style={{ display: 'flex' }}>
                        <NotificationItem style={{ width: '42%' }}><Text>Produto:</Text>{notification.data!.product}</NotificationItem>
                        <NotificationItem ><Text>Qtd. Retirada:</Text>{notification.data.quantity}</NotificationItem>
                    </NotificationRow>
                    <NotificationRow style={{ display: 'flex' }}>
                        <NotificationItem style={{ width: '42%' }}><Text>Lote:</Text>{notification.data!.subproduct}</NotificationItem>
                        <NotificationItem><Text>Validade:</Text>{formatDate(notification.data!.validity)}</NotificationItem>
                    </NotificationRow>
                    <NotificationRow style={{ display: 'flex' }}>
                        <NotificationItem ><Text>Motivo:</Text>{notification.data!.message}</NotificationItem>
                    </NotificationRow>
                </>
            }
        </NotificationContainer>
    )
}
