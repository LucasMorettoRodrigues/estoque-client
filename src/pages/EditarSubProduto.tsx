import { useState, FormEvent, ChangeEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch } from "../app/hooks"
import Button from "../components/Button"
import Input from "../components/Input"
import { editSubProduct } from "../features/produtos/produtoSlice"
import { TSubProduct } from "../types/TSubProduct"

const Title = styled.h1`
    color: #222;
    margin: 30px 0;
`

export default function EditarSubProduto() {

    const location = useLocation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const subProduct = location.state as TSubProduct;

    const [lote, setLote] = useState(subProduct.lote)
    const [validade, setValidade] = useState(subProduct.validade.slice(0, 10))
    const [quantity, setQuantity] = useState(`${subProduct.quantity}`)

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(editSubProduct({ id: subProduct.id, lote, validade, quantity: parseInt(quantity) }))
        navigate('/produtos/detalhes')
    }

    return (
        <>
            <Title>Editar Produto</Title>
            <form onSubmit={handleOnSubmit}>
                <Input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLote(e.target.value)}
                    name={'lote'}
                    label={'Lote'}
                    value={lote}
                    required
                />
                <Input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setValidade(e.target.value)}
                    name={'validade'}
                    label={'Validade'}
                    type='date'
                    value={validade}
                    required
                />
                <Input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                    name={'quantity'}
                    label={'Quantidade'}
                    type='number'
                    min={0}
                    value={quantity}
                    required
                />
                <Button text={'Editar Produto'} />
            </form>
        </>
    )
}
