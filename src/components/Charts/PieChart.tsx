import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts';

type Props = {
    data: {
        name: string,
        value: number,
        color: string
    }[],
    radius: number
}

export default function ChartPie({ data, radius }: Props) {

    const total = data.reduce((sum, curr) => sum + curr.value, 0)

    data = data.map(item => ({ ...item, ratio: `${(item.value / total * 100).toFixed(1)} %` }))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart height={300}>
                <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={radius}
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index
                    }) => {
                        const RADIAN = Math.PI / 180;
                        // eslint-disable-next-line
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        // eslint-disable-next-line
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        // eslint-disable-next-line
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                                x={x}
                                y={y}
                                fill={data[index].color}
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                            >
                                {data[index].name} ({value})
                            </text>
                        );
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={data[index].color} />
                    ))}
                    <LabelList dataKey="ratio" position="top" />
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}
