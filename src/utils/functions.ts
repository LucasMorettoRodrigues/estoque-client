import { TProduct } from "../types/TProduct"
import { TProvider } from "../types/TProvider"
import { TStockIn } from "../types/TStockIn"
import { TStockOut } from "../types/TStockOut"
import { TSubProduct } from "../types/TSubProduct"

export const getProduct = (products: TProduct[], product_id: number | undefined): TProduct | null => {
    if (!product_id) return null

    const product = products.find((item) => (item.id === product_id))

    if (!product) return null

    return product
}

export const getSubProduct = (products: TProduct[], product_id: number | undefined | null, subProduct_id: number | undefined | null): TSubProduct | null => {
    if (!product_id || !subProduct_id) return null

    const product = getProduct(products, product_id)

    if (!product) return null

    const subProduct = product.subproducts?.find(item => item.id === subProduct_id)

    if (!subProduct) return null

    return subProduct
}

export const getProvider = (providers: TProvider[], provider_id: number | undefined): TProvider | null => {
    if (!provider_id) return null

    const provider = providers.find((item) => (item.id === provider_id))

    if (!provider) return null

    return provider
}

export const getSubProductByLote = (products: TProduct[], product_id: number | undefined | null, lote: string | undefined | null): TSubProduct | undefined => {
    if (!product_id || !lote) return

    const product = getProduct(products, product_id)

    if (!product) return

    const subProduct = product.subproducts?.find(item => item.lote === lote)

    return subProduct
}

export const mergeProducts = (products: TProduct[]): TProduct[] => {
    products = products.filter(
        (product) => (product.hide === false && !product.product_child_id)
    )

    let res: TProduct[] = []

    for (let product of products) {
        if (!product.providers) {
            product = { ...product, providers: [] }
        }

        if (!res.find(i => i.name === product.name)) {
            res = [...res, product]

        } else {
            res =
                res.map(i => (
                    i.name === product.name
                        ? {
                            ...i,
                            stock: i.stock + product.stock,
                            subproducts: i.subproducts!.concat(product.subproducts!),
                            providers: Array.from(new Set(product.providers!.concat(i.providers!)))
                        }
                        : i
                )
                )
        }
    }
    console.log('sk', res)
    return res
}

export const compare = (array: TProduct[], property: string) => {
    if (property === 'category' || property === 'brand' || property === 'unit' ||
        property === 'id' || property === 'name' || property === 'providers') {
        return array.sort((a, b) => (a[property]! > b[property]!) ? 1 : ((b[property]! > a[property]!) ? -1 : 0))
    }
    return []
}

export const groupStockByDate = (stockList: (TStockIn[] | TStockOut[])) => {

    let stockByDate: { [key: string]: (TStockIn[] | TStockOut[]) } = {}

    stockList.forEach((i: any) => {
        let index = i.createdAt!.slice(0, 10) + '_' + i.description
        if (stockByDate[index]) {
            stockByDate[index].push(i)
        } else {
            stockByDate[index] = [i]
        }
    })

    return stockByDate
}