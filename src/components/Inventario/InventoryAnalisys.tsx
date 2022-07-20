import styled from "styled-components"
import { IProductInventory } from "../../types/TProduct"
import ChartPie from "../Charts/PieChart"

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    padding: 20px 0;
    border: 2px solid lightgray;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`
const ChartContainer = styled.div`
    flex: 1;
    height: 300px;
`
const SubTitle = styled.h3`
    text-align: center;
`

type Props = {
    products: IProductInventory[]
}

export default function InventoryAnalisys({ products }: Props) {

    const divergentProducts = products.map(i => i.subproducts!.filter(j => j.reason).length).reduce((sum, i) => sum + i, 0)
    const rigthProducts = products.map(i => i.subproducts!.filter(j => !j.reason).length).reduce((sum, i) => sum + i, 0)

    const colors = ['#00B7FF', '#67c7ff', '#0033c0', '#2a9cff', '#0073FF', '#001986', '#005CFF']

    let test: any = []
    products.forEach((item, index) => item.subproducts?.forEach(j => {
        if (j.reason) {
            test.find((i: any) => i.name === j.reason)
                ? test = test.map((k: any) => k.name === j.reason
                    ? { ...k, value: k.value + 1 }
                    : k
                )
                : test.push({ name: j.reason, value: 1 })
        }
    }))

    test = test.map((item: any, index: number) => ({ ...item, color: colors[index] }))

    const data = [
        { name: 'Items em acordo', value: rigthProducts, color: '#37bb1c' },
        { name: 'Items em desacordo', value: divergentProducts, color: '#e41f1f' },
    ]

    return (
        <InfoWrapper>
            <ChartContainer style={{ flex: 1, height: '300px' }}>
                <SubTitle style={{ textAlign: 'center' }}>Resultado do inventário </SubTitle>
                <ChartPie data={data} radius={90} />
            </ChartContainer>
            {
                divergentProducts > 0 &&
                <ChartContainer style={{ flex: 1, height: '300px' }}>
                    <SubTitle style={{ textAlign: 'center' }}>Motivos da divergência</SubTitle>
                    <ChartPie data={test} radius={90} />
                </ChartContainer>
            }
        </InfoWrapper>
    )
}
