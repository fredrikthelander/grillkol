export interface Setting {
    id: string
    name: string
    type: number // 0=String, 1=Numeric, 2=Boolean
    stringValue: string
    numericValue: number
    booleanValue: boolean
}
