import { SelectHTMLAttributes } from "react"
import styled from "styled-components"

const Label = styled.label<{ display?: string }>`
    display: block;
    margin-left: 2px;
    margin-right: ${props => props.display === 'flex' ? '8px' : 0};
    margin-bottom: ${props => props.display === 'flex' ? 0 : '4px'};
    color: #666;
    font-size: 15px;
`
const CSelect = styled.select`
    display: block;
    width: 100%;
    padding: 10px;
    outline-color: lightblue;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 5px;
    min-width: 180px;
    cursor: pointer;
`

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    name: string,
    label?: string,
    display?: string,
}

export default function Select({ name, label, display, ...rest }: SelectProps) {
    return (
        <>
            {label &&
                <Label htmlFor={name} display={display}>{label}</Label>
            }
            <CSelect id={name} name={name} {...rest}></CSelect>
        </>
    )
}
