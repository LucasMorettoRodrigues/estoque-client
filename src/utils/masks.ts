import { ChangeEvent } from "react";

export const currencyMask = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = parseFloat(value.replace(/(.*){1}/, '0$1').replace(/[^\d]/g, '').replace(/(\d\d?)$/, '.$1')).toFixed(2)
    e.target.value = value
    return e
}