import { ChangeEvent } from "react"
import styled from "styled-components"
import Input from "./Input"
import Select from "./Select"

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #00000084;
    z-index: 100;
`
const Title = styled.h2`
    color: black;
    margin-bottom: 15px;
`
const Wrapper = styled.div`
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
`
const Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    justify-content: center;
    border-radius: 15px;
    background-color: white;
    padding: 20px;
`
const ErrorsContainer = styled.div`
    margin-bottom: 10px;
    >p {
        font-size: 14px;
    }
`
const Button = styled.button<{ bg: string }>`
    background-color: ${props => props.bg};
    color: white;
    border: none;
    margin: 0 10px;
    padding: 10px 30px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        opacity: 0.95;
    }
`
const ButtonContainer = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
`

type Props = {
    message: {
        title: string,
        message: string
    },
    placeholder?: string,
    onConfirm: () => void,
    onClose?: () => void,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
    onSelectChange?: (e: ChangeEvent<HTMLSelectElement>) => void,
    options?: { value: string, text: string }[]
}

export default function ModalInput({ message, placeholder, onConfirm, onClose, onChange, options, onSelectChange }: Props) {
    return (
        <Container>
            <Wrapper>
                <Box>
                    <Title>{message.title}</Title>
                    <ErrorsContainer>
                        <p>{message.message}</p>
                    </ErrorsContainer>
                    {options && options.length > 0
                        ? <Select onChange={onSelectChange} required name='input'>
                            <option></option>
                            {options.map((option, index) => (
                                <option value={option.value} key={index}>{option.text}</option>
                            ))}
                        </Select>
                        : <Input onChange={onChange} required name='input' placeholder={placeholder}></Input>

                    }
                    <ButtonContainer>
                        <Button bg={'#ff3232'} onClick={onClose}>Cancelar</Button>
                        <Button bg={'#3dc73d'} onClick={onConfirm}>Confirmar</Button>
                    </ButtonContainer>
                </Box>
            </Wrapper>
        </Container>
    )
}
