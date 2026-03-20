import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export function GymTrafficAnalysis() {
    // Sample data simulating hourly gym traffic
    const data = [
        { name: '06h', visitors: 12 },
        { name: '08h', visitors: 25 },
        { name: '10h', visitors: 15 },
        { name: '12h', visitors: 10 },
        { name: '14h', visitors: 18 },
        { name: '16h', visitors: 35 },
        { name: '17h', visitors: 42 },
        { name: '18h', visitors: 48 }, // Peak
        { name: '19h', visitors: 40 },
        { name: '20h', visitors: 30 },
        { name: '22h', visitors: 8 },
    ];

    return (
        <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-white text-lg">Phân Tích Khung Giờ Tập</h3>
                    <p className="text-xs text-neutral-500">Giờ cao điểm & thấp điểm trung bình</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                        <XAxis
                            dataKey="name"
                            stroke="#525252"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a1c',
                                border: '1px solid #262626',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            labelStyle={{ color: '#aaa', fontSize: '10px', marginBottom: '4px' }}
                        />
                        <Bar dataKey="visitors" radius={[4, 4, 0, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.visitors > 40 ? '#ef4444' : entry.visitors > 20 ? '#3b82f6' : '#262626'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-800" />
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Thấp điểm</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Bình thường</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Cao điểm</span>
                </div>
            </div>
        </div>
    );
}
