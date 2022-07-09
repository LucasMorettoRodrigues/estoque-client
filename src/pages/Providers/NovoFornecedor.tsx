import { useState, FormEvent, ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch } from "../../app/hooks"
import Button from "../../components/UI/Button"
import Form from "../../components/UI/Form"
import Input from "../../components/UI/Input"
import Title from "../../components/UI/Title"
import { createProvider } from "../../features/provider/providerSlice"

const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`
const InputContainer = styled.div`
    margin-bottom: 20px;
`

export default function NovoFornecedor() {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(createProvider({ name: name }))
        navigate('/fornecedores')
    }

    return (
        <>

            <Title title='Novo Fornecedor' />
            <Form onSubmit={handleOnSubmit}>
                <InputContainer>
                    <Input
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        name={'name'}
                        label={'Name'}
                        required
                    />
                </InputContainer>
                <ButtonContainer>
                    <Button text={'Cadastrar Fornecedor'} />
                </ButtonContainer>
            </Form>
        </>
    )
}
