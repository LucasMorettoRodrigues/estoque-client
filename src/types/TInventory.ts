import { IProductInventory } from "./TProduct"

export type TInventory = {
    id: number,
    inventory: IProductInventory[],
    category: string,
    createdAt: string,
    user: {
        name: string
    }
}