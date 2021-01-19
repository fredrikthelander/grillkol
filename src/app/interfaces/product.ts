export interface Product {
    id: string
    idCategory: string
    idVat: string
    sku: string
    name: string
    description1: string
    description2: string
    image: string
    stockLevel: number
    priceIncl: number
    resellerPriceIncl: number
    volume: number
    fortnoxProducts: FortnoxProduct[]
    sortorder: number
    active: boolean
}

export interface FortnoxProduct {
    id: string
    sku: string
    quantity: number
}
