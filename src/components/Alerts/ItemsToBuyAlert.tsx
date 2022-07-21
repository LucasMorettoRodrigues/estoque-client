import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { TMessage } from "../../types/TMessage"
import { TSubProduct } from "../../types/TSubProduct"
import Mensagem from "../UI/Mensagem"
import ValidityInfoItem from "./AlertItem"

interface AlertList extends TSubProduct {
    product: string
}

export default function ItemsToBuyAlert() {

    const products = useAppSelector(state => state.product.products)

    const [message, setMessage] = useState<TMessage>(null)
    const [alertItems, setAlertItems] = useState<AlertList[]>([])

    const isTimeToBuy = (validade: string, deliveryTime: number) => {
        const today = new Date().getTime()
        const dateToBuy = new Date(validade).getTime() - 7 * deliveryTime * 86400000
        return today > dateToBuy
    }

    useEffect(() => {
        const itemsToBuy: AlertList[] = []

        const productsList = products
            .filter(pro => pro.delivery_time && pro.subproducts!.length > 0)
            .map(pro => (
                {
                    ...pro,
                    subproducts: pro.subproducts!.filter(sub => sub.validade).sort(function (a, b) {
                        return new Date(b.validade!).getTime() - new Date(a.validade!).getTime()
                    })[0]
                }
            ))

        productsList.forEach(pro => {
            if (!pro!.subproducts!.validade) return

            if (isTimeToBuy(pro!.subproducts!.validade!.slice(0, 10), pro.delivery_time!)) {
                itemsToBuy.push({ ...pro.subproducts, product: pro.name })
            }
        })

        if (itemsToBuy.length > 0) {
            setAlertItems(itemsToBuy)

            setMessage({
                title: 'Atenção',
                message: ``
            })
        }
    }, [products])

    return (
        <>
            {message &&
                <Mensagem width='650px' onClick={() => setMessage(null)} message={message} >
                    <div style={{ fontSize: '14px', overflowY: 'auto', maxHeight: '60vh' }}>
                        <p style={{ marginLeft: '2px' }}>
                            {`Você possui ${alertItems.length === 1 ? '1 produto ' : `${alertItems.length} produtos`} para comprar antes do vencimento:`}
                        </p>
                        {alertItems.map(i => (
                            <ValidityInfoItem bColor="#5fb4ff" product={i.product} />
                        ))}
                    </div>
                </Mensagem>
            }
        </>
    )

}
