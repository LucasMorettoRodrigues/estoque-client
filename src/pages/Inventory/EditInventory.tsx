import { useState, FormEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import Button from "../../components/UI/Button"
import Title from "../../components/UI/Title"
import Form from "../../components/UI/Form"
import { editInventory, getAllInventories } from "../../features/inventory/inventorySlice"
import Select from "../../components/UI/Select"

const InputContainer = styled.div`
    margin-bottom: 20px;
`
const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`

export default function EditInventory() {

    const { id, product_id, subProduct_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const inventories = useAppSelector(state => state.inventory.inventories)
    const inventory = id ? inventories.find(i => i.id === parseInt(id)) : null
    const product = product_id ? inventory!.inventory.find(product => product.id === parseInt(product_id)) : null
    const subProduct = subProduct_id ? product!.subproducts.find(subProduct => subProduct.id === parseInt(subProduct_id)) : null
    const [reason, setReason] = useState(subProduct?.reason)

    if (!inventory || !product || !subProduct || !product_id || !subProduct_id) {
        console.log(inventory, product, subProduct, product_id)
        return <></>
    }

    const reasons = [
        'Entrada/saída incorretos',
        'Erro de digitação',
        'Erro não identificado',
        'Bug do sistema',
        'Local de armazenamento incorreto',
        'Contagem inventário incorreta'
    ]

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload = {
            inventory: inventory.inventory.map(product =>
                product.id === parseInt(product_id)
                    ? {
                        ...product, subproducts: product.subproducts.map(subProduct => (
                            subProduct.id === parseInt(subProduct_id)
                                ? { ...subProduct, reason }
                                : subProduct
                        ))
                    }
                    : product
            )
        }

        await dispatch(editInventory({ id: inventory.id, payload })).unwrap()
        await dispatch(getAllInventories()).unwrap()

        navigate(`/inventarios/${id}`)
    }

    return (
        <>
            <Title title='Editar Inventário' />
            <Form onSubmit={handleOnSubmit}>
                <InputContainer>
                    <Select
                        label="Motivo"
                        name="reason"
                        display="flex"
                        onChange={(e) => setReason(e.target.value)}
                        value={reason}
                    >
                        <>
                            {reasons.map((item) =>
                                <option key={item}>{item}</option>
                            )}
                        </>
                    </Select>
                </InputContainer>
                <ButtonContainer>
                    <Button text={'Concluir'} />
                </ButtonContainer>
            </Form>
        </>
    )
}