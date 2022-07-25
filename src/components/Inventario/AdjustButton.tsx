import { MouseEvent, useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { createAdjustStock } from "../../features/AsyncThunkFunctions"
import { TMessage } from "../../types/TMessage"
import Mensagem from "../UI/Mensagem"
import { TInventory } from "../../types/TInventory"
import { editInventory, getAllInventories } from "../../features/inventory/inventorySlice"
import styled from "styled-components"

const Button = styled.button`
    background-color: transparent;
    border: none;
    font-weight: bold;
    font-size: 14px;
    color: #009600;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
    }
`

type Props = {
    inventory: TInventory,
    subProduct: any
}

export default function AdjustButton({ subProduct, inventory }: Props) {

    const dispatch = useAppDispatch()
    const [text, setText] = useState('Ajustar')
    const [message, setMessage] = useState<TMessage>()

    const handleOnClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (text === 'Ajustar') {

            try {
                await dispatch(createAdjustStock({
                    force: true,
                    product_id: subProduct.product_id,
                    quantity: subProduct.inventory,
                    subproduct_id: subProduct.id
                })).unwrap()

                await dispatch(editInventory({
                    id: inventory.id,
                    payload: {
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
                onClick={(e) => handleOnClick(e)}
            >
                {text}
            </Button>
        </>
    )
}
