import { Product } from './product'
import { Project } from './project'
import { SalesPerson } from './sales-person'

export interface Order {
    id: string
    orderid: number
    project: Project
    fnamn: string
    enamn: string
    phone: string
    email: string
    adr1: string
    adr2: string
    items: OrderItem[]
    ts: string
    totalIncl: number
    totalExcl: number
    totalVat: number
    termsAccepted: boolean
    salesPerson: SalesPerson
}

export interface OrderItem {
    id: string
    product: Product
    quantity: number
    total: number
    totalExcl: number
    vatAmount: number
    vatPercent: number
}