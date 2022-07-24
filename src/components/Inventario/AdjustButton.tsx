import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { createAdjustStock } from "../../features/AsyncThunkFunctions"
import { TMessage } from "../../types/TMessage"
import Mensagem from "../UI/Mensagem"
import Button from "../UI/Button"
import { TInventory } from "../../types/TInventory"
import { editInventory, getAllInventories } from "../../features/inventory/inventorySlice"

type Props = {
    inventory: TInventory,
    subProduct: any
}

export default function AdjustButton({ subProduct, inventory }: Props) {

    const dispatch = useAppDispatch()
    const [text, setText] = useState('Ajustar')
    const [message, setMessage] = useState<TMessage>()

    const handleOnClick = async () => {
        if (text === 'Ajustar') {
            setText('Carregando')

            try {
                await dispatch(createAdjustStock({
                    force: true,
                    product_id: subProduct.product_id,
                    quantity: subProduct.inventory,
                    subproduct_id: subProduct.id
                })).unwrap()

                setText('Ajustado')

                await dispatch(editInventory({
                    id: inventory.id,
                    body: {
                        inventory: inventory.inventory.map(item => (
                            item.id === subProduct.product_id
                                ? {
                                    ...item, subproducts: item.subproducts.map(subItem => (
                                        subItem.id === subProduct.id
                                            ? { ...subItem, adjusted: true }
                                            : subItem
                                    ))
                                }
                                : item
                        ))
                    }
                })).unwrap()

                await dispatch(getAllInventories()).unwrap()
            } catch (error) {
                setText('Erro')
            }
        }
    }

    return (
        <>
            {message && <Mensagem onClick={() => setMessage(null)} message={message} />}
            <Button
                style={{ padding: '5px 10px', marginRight: '10px' }}
                bg={text === 'Erro' ? 'red' : text === 'Ajustado' ? 'green' : 'blue'}
                text={text}
                onClick={handleOnClick}
            />
        </>
    )
}
