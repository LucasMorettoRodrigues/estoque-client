export type TSubProduct = {
    id?: number,
    product_id?: number,
    lote: string,
    validade: string | null,
    quantity: number
}

export interface TSubProductInventory extends TSubProduct {
    inventory: number,
    justification: string,
    reason: string,
    adjusted: boolean
}