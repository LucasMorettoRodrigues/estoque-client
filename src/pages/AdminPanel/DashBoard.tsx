import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import styled from 'styled-components'
import { useAppSelector } from '../../app/hooks'
import { inventoriesSelector } from '../../app/selectors'
import AdminPanelHeader from '../../components/AdminPanel/AdminPanelHeader'
import ChartPie from '../../components/Charts/PieChart'
import { TNotification } from '../../types/TNotification'
import { IProductInventory } from '../../types/TProduct'

const ChartsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 40px 0;
    border: 2px solid lightgray;
    border-radius: 10px;
`

interface IInventory extends TNotification {
    data: IProductInventory[]
}

export default function DashBoard() {

    const inventories: IInventory[] = useAppSelector(inventoriesSelector)

    const data: any = []
    let test: any = []
    const pieChartData: any = []
    let rightProductsSum = 0
    let divergentProductsSum = 0
    const colors = ['#00B7FF', '#67c7ff', '#0033c0', '#2a9cff', '#0073FF', '#001986', '#005CFF']

    inventories.forEach(inv => {
        const allProducts = inv.data.map(i => i.subproducts!.length).reduce((sum, i) => sum + i, 0)
        const divergentProducts = inv.data.map(i => i.subproducts!.filter(j => j.reason).length).reduce((sum, i) => sum + i, 0)
        const rigthProducts = inv.data.map(i => i.subproducts!.filter(j => !j.reason).length).reduce((sum, i) => sum + i, 0)

        rightProductsSum += rigthProducts
        divergentProductsSum += divergentProducts

        const ratio = ((divergentProducts / allProducts) * 100).toFixed(0)

        data.unshift({ "date": inv.createdAt!.slice(0, 10), "ratio": Number(ratio) })

        inv.data.forEach((item) => item.subproducts?.forEach(j => {
            if (j.reason) {
                test.find((i: any) => i.name === j.reason)
                    ? test = test.map((k: any) => k.name === j.reason
                        ? { ...k, value: k.value + 1 }
                        : k
                    )
                    : test.push({ name: j.reason, value: 1 })
            }
        }))
    })

    test = test.map((item: any, index: number) => ({ ...item, color: colors[index] }))

    pieChartData.push(
        { name: 'Items em acordo', value: rightProductsSum, color: '#37bb1c' },
        { name: 'Items em desacordo', value: divergentProductsSum, color: '#e41f1f' }
    )

    return (
        <>
            <AdminPanelHeader title='DashBoard' active='DashBoard' />
            <ChartsContainer>
                {data.length > 0 &&
                    <>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Evolução da razão de itens em desacordo</h3>
                        <AreaChart width={730} height={250} data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5fb4ff" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#5fb4ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="ratio" stroke="#5fb4ff" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </>
                }
                <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Ocorrência de Motivos</h3>
                <ChartPie data={test} radius={100} />
            </ChartsContainer>
        </>
    )
}
