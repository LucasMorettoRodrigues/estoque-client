import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { IProductInventory } from "../../types/TProduct"
import Title from "../../components/UI/Title"
import { TMessage } from "../../types/TMessage"
import Mensagem from "../../components/UI/Mensagem"
import InventarioList from "../../components/Inventario/InventarioList"
import InventoryAnalisys from "../../components/Inventario/InventoryAnalisys"
import Button from "../../components/UI/Button"
import { useAppDispatch } from "../../app/hooks"
import { createNotification, deleteNotification } from "../../features/notification/notificationSlice"
import { formatDate } from "../../utils/dateFunctions"
import ModalInput from "../../components/UI/ModalInput"

export default function VizualizarInventario() {

    const { state }: any = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const products: IProductInventory[] = state.data
    const [message, setMessage] = useState<TMessage>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [daysUntilNextInventory, setDaysUntilNextInventory] = useState('')

    const divergentProducts = products
        .map(product => (
            { ...product, subproducts: product.subproducts.filter(sub => !!sub.justification) })
        ).filter(product => product.subproducts.length > 0)

    const handleMessage = () => {
        if (message!.title === 'Sucesso') {
            navigate('/historico/inventarios')
        } else {
            setMessage(null)
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteNotification(state.id!)).unwrap()
            setMessage({ title: 'Sucesso', message: 'O inventário foi deletado com êxito.' })
        } catch (error) {
            setMessage({ title: 'Erro', message: 'Não foi possível deletar o inventário' })
        }
    }

    const handleScheduleInventory = () => {
        setIsModalOpen(true)
    }

    const handleConfirmScheduleInventory = async () => {

        if (!daysUntilNextInventory) {
            return
        }

        let category = products[0].category
        if (category === 'Kits' || category === 'Reagentes') {
            category = 'Kits e Reagentes'
        }

        const inventoryDate = new Date(state.createdAt)
        var scheduleDate = inventoryDate.setDate(inventoryDate.getDate() + parseInt(daysUntilNextInventory));
        const notification = { description: `Agendamento de Inventário - ${category}`, data: new Date(scheduleDate) }

        try {
            dispatch(createNotification({ notification })).unwrap()
            setIsModalOpen(false)
            setMessage({ title: "Sucesso", message: "O próximo inventário foi agendado." })
        } catch (error) {
            setIsModalOpen(false)
            setMessage({ title: "Erro", message: "Não foi possível agendar o inventário." })
        }
    }

    return (
        <>
            {isModalOpen &&
                <ModalInput
                    message={{ title: "Agendar Inventário", message: "Selecione o prazo até o próximo inventário." }}
                    onConfirm={handleConfirmScheduleInventory}
                    onClose={() => setIsModalOpen(false)}
                    onSelectChange={(e) => setDaysUntilNextInventory(e.target.value)}
                    options={[{ value: '15', text: '15 dias' }, { value: '30', text: '30 dias' }, { value: '45', text: '45 dias' }]}
                />}
            {message && <Mensagem onClick={handleMessage} message={message} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title title='Inventário' />
                <div style={{ fontSize: 14, color: '#555' }}>
                    <p style={{ marginBottom: '8px' }}>Realizado por {state.user?.name} em {formatDate(state.createdAt)}</p>
                </div>
            </div>
            <InventoryAnalisys products={products} />

            <div style={{ margin: '30px 0' }}>
                <InventarioList
                    products={divergentProducts}
                    title={'Produtos com Divergência'}
                />
            </div>
            <div style={{ margin: '30px 0' }}>
                <InventarioList
                    products={products}
                    title='Inventário Completo'
                />
            </div>
            <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'flex-end' }}>
                <Button style={{ marginLeft: '20px' }} text='Agendar Inventário' bg='green' onClick={handleScheduleInventory} />
                <Button style={{ marginLeft: '20px' }} text='Deletar Inventário' bg='red' onClick={handleDelete} />
            </div>
        </>
    )
}