import { InputHTMLAttributes } from "react"
import styled from "styled-components"

const Label = styled.label<{ display?: string }>`
    display: block;
    margin-left: 2px;
    margin-right: ${props => props.display === 'flex' ? '8px' : 0};
    margin-bottom: ${props => props.display === 'flex' ? 0 : '4px'};
    color: #666;
    font-size: 15px;
`
const SInput = styled.input`
    display: block;
    width: 100%;
    padding-top: 13px;
    padding-bottom: 11px;
    padding-left: 12px;
    padding-right: 12px;
    outline-color: #8383ff;
    border: 1px solid #c2c2c2;
    border-radius: 5px;    

    &::placeholder {
        font-size: 16px;
        color: #666;
    }
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string,
    label?: string,
    display?: string,
}

export default function Input({ name, label, display, ...rest }: InputProps) {
    return (
        <>
            <Label htmlFor={name} display={display}>{label}</Label>
            <SInput id={name} name={name} {...rest}>
            </SInput>
        </>
    )
}
