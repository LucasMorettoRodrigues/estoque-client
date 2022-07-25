import { ButtonHTMLAttributes } from "react"
import styled from "styled-components"

const SButton = styled.button<{ bg?: string }>`
    background-color: ${props => props.bg === 'red' ? '#ff3232' : (props.bg === 'blue' ? '#3d69c7' : '#3dc73d')};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
        opacity: 0.95;
    }
`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string,
    onClick?: () => void,
    bg?: string
}

export default function Button({ text, onClick, bg, ...rest }: Props) {

    return (
        <SButton bg={bg} {...rest} onClick={onClick}>{text}</SButton>
    )
}
