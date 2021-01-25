export interface Project {
    id: string
    name: string
    persons: number
    contactName: string
    email: string
    phone: string
    catalogs: boolean
    catalogAdr1: string
    catalogAdr2: string
    catalogZipCode: string
    catalogCity: string
    deliveryAdr1: string
    deliveryAdr2: string
    deliveryZipCode: string
    deliveryCity: string
    deliveryPhone: string
    deliveryDate: string
    newsletter: boolean
    code: string
    password: string
    infotext: string
    bankinfo: string
    serviceRate: number
    idCategories: string[]
    ts: string
    active: boolean
}
