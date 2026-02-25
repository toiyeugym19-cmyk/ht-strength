import { useState } from 'react';
import { toast } from 'sonner';

// --- SHARED COMPONENTS ---
interface ToolContainerProps {
    title: string;
    children: React.ReactNode;
    color?: string;
}

const ToolContainer = ({ title, children, color = "bg-primary" }: ToolContainerProps) => (
    <div className="space-y-4 h-full flex flex-col">
        <h3 className={`text-xl font-black uppercase italic ${color} bg-clip-text text-transparent shrink-0`}>{title}</h3>
        <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">{children}</div>
    </div>
);

interface ResultBoxProps {
    label: string;
    value: string | number;
    sub?: string;
    large?: boolean;
}

const ResultBox = ({ label, value, sub, large = false }: ResultBoxProps) => (
    <div className={`bg-white/5 p-3 rounded-lg text-center border border-white/10 ${large ? 'col-span-full' : ''}`}>
        <div className={`${large ? 'text-3xl' : 'text-2xl'} font-black text-white`}>{value}</div>
        <div className="text-[10px] font-bold text-text-muted uppercase">{label}</div>
        {sub && <div className="text-[10px] text-text-muted">{sub}</div>}
    </div>
);

// --- CATEGORY 1: STRENGTH & POWER ---

// 1. Sinclair Coefficient (Weightlifting)
export function SinclairCalc() {
    const [sex, setSex] = useState<'m' | 'f'>('m');
    const [bw, setBw] = useState(0);
    const [total, setTotal] = useState(0);

    const calculate = () => {
        if (!bw || !total) return 0;
        // 2017-2020 Cycle approx constants
        const A = sex === 'm' ? 0.751945030 : 0.783497476;
        const B = sex === 'm' ? 175.508 : 153.655;
        if (bw >= B) return total.toFixed(1);
        const X = Math.log10(bw / B);
        const coeff = Math.pow(10, A * X * X);
        return (total * coeff).toFixed(1);
    }

    return (
        <ToolContainer title="Điểm Sinclair" color="from-yellow-400 to-orange-500">
            <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                <button onClick={() => setSex('m')} className={`flex-1 py-1 rounded ${sex === 'm' ? 'bg-primary text-white' : 'text-text-muted'}`}>Nam</button>
                <button onClick={() => setSex('f')} className={`flex-1 py-1 rounded ${sex === 'f' ? 'bg-primary text-white' : 'text-text-muted'}`}>Nữ</button>
            </div>
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setBw(Number(e.target.value))} />
            <input type="number" placeholder="Tổng tạ (Snatch + C&J)" className="input" onChange={e => setTotal(Number(e.target.value))} />
            {Number(calculate()) > 0 && <ResultBox label="Điểm Sinclair" value={calculate()} large />}
        </ToolContainer>
    )
}

// 2. FFMI Calculator (Natural Potential)
export function FFMICalc() {
    const [height, setHeight] = useState(0); // cm
    const [weight, setWeight] = useState(0); // kg
    const [bf, setBf] = useState(15); // %

    const calculate = () => {
        if (!height || !weight) return { ffmi: 0, normalized: 0 };
        const hMeter = height / 100;
        const leanMass = weight * (1 - (bf / 100));
        const ffmi = leanMass / (hMeter * hMeter);
        const normalized = ffmi + (6.1 * (1.8 - hMeter));
        return { ffmi: ffmi.toFixed(1), normalized: normalized.toFixed(1) };
    }

    const { ffmi, normalized } = calculate();

    return (
        <ToolContainer title="Chỉ Số FFMI" color="from-red-500 to-pink-600">
            <input type="number" placeholder="Chiều cao (cm)" className="input" onChange={e => setHeight(Number(e.target.value))} />
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setWeight(Number(e.target.value))} />
            <div className="space-y-1">
                <label className="text-xs text-text-muted">Tỉ lệ mỡ: {bf}%</label>
                <input type="range" min="3" max="50" value={bf} onChange={e => setBf(Number(e.target.value))} className="w-full" />
            </div>
            {Number(ffmi) > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    <ResultBox label="FFMI" value={ffmi} />
                    <ResultBox label="Normalized" value={normalized} sub="Điều chỉnh chiều cao" />
                </div>
            )}
            {Number(normalized) > 25 && <div className="text-xs text-yellow-400 text-center font-bold">Vượt ngưỡng tự nhiên phổ biến!</div>}
        </ToolContainer>
    )
}

// 3. Bench Press Pyramid Generator
export function BenchPyramid() {
    const [oneRM, setOneRM] = useState(0);

    return (
        <ToolContainer title="Tháp Bench Press" color="from-blue-400 to-indigo-500">
            <input type="number" placeholder="1RM Bench Press (kg)" className="input" onChange={e => setOneRM(Number(e.target.value))} />
            {oneRM > 0 && (
                <div className="space-y-1 text-xs font-mono">
                    {[50, 60, 70, 80, 75, 65, 55].map((pct, i) => (
                        <div key={i} className="flex justify-between p-2 bg-white/5 rounded">
                            <span>Set {i + 1} ({pct}%)</span>
                            <span>{Math.round(oneRM * (pct / 100))}kg x {Math.max(1, Math.floor(12 - (pct / 10)))}</span>
                        </div>
                    ))}
                </div>
            )}
        </ToolContainer>
    )
}

// --- CATEGORY 2: NUTRITION & HEALTH ---

// 4. Creatine Loading Calculator
export function CreatineCalc() {
    const [weight, setWeight] = useState(0);
    return (
        <ToolContainer title="Tính Creatine" color="from-green-400 to-emerald-500">
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setWeight(Number(e.target.value))} />
            {weight > 0 && (
                <div className="space-y-2">
                    <ResultBox label="Nạp Nhanh (5-7 ngày)" value={`${(weight * 0.3).toFixed(0)}g`} sub="Chia 4 lần/ngày" />
                    <ResultBox label="Duy Trì" value={`${(weight * 0.03).toFixed(1)}g`} sub="Mỗi ngày" />
                </div>
            )}
        </ToolContainer>
    )
}

// 5. Carb Cycling Planner
export function CarbCycling() {
    const [tdee, setTdee] = useState(0);
    return (
        <ToolContainer title="Xoay Vòng Carb" color="from-orange-400 to-amber-500">
            <input type="number" placeholder="TDEE (Calories)" className="input" onChange={e => setTdee(Number(e.target.value))} />
            {tdee > 0 && (
                <div className="space-y-1 text-xs">
                    <div className="p-2 bg-red-500/20 rounded">
                        <div className="font-bold text-red-300">Ngày High Carb (Tập nặng)</div>
                        <div>{(tdee * 1.15).toFixed(0)} cal (Nhiều cơm/phở)</div>
                    </div>
                    <div className="p-2 bg-yellow-500/20 rounded">
                        <div className="font-bold text-yellow-300">Ngày Moderate (Tập thường)</div>
                        <div>{tdee} cal</div>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded">
                        <div className="font-bold text-green-300">Ngày Low Carb (Nghỉ/Cardio)</div>
                        <div>{(tdee * 0.85).toFixed(0)} cal (Tăng rau/thịt)</div>
                    </div>
                </div>
            )}
        </ToolContainer>
    )
}

// 6. Caffeine Half-Life
export function CaffeineLog() {
    const [amount, setAmount] = useState(200); // 200mg default
    const [hours, setHours] = useState(0);

    // Caffeine half-life is approx 5-6 hours
    const remaining = Math.round(amount * Math.pow(0.5, hours / 5.7));

    return (
        <ToolContainer title="Tính Caffeine" color="from-slate-400 to-slate-200 text-black">
            <div className="flex justify-between text-xs mb-2">
                <span>Uống: {amount}mg</span>
                <span>Sau: {hours}h</span>
            </div>
            <input type="range" min="50" max="500" step="10" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mb-2 accent-white" />
            <input type="range" min="0" max="12" value={hours} onChange={e => setHours(Number(e.target.value))} className="w-full mb-2 accent-white" />

            <ResultBox label={`Lượng còn lại trong máu`} value={`${remaining}mg`} />
            {remaining > 50 && hours >= 8 && <div className="text-xs text-red-400 mt-2 text-center">Có thể gây mất ngủ!</div>}
        </ToolContainer>
    )
}

// --- CATEGORY 3: CARDIO & ENDURANCE ---

// 7. Race Pace Calculator
export function RacePace() {
    const [dist, setDist] = useState(5); // km
    const [time, setTime] = useState(30); // min

    const paceDec = time / dist;
    const paceMin = Math.floor(paceDec);
    const paceSec = Math.round((paceDec - paceMin) * 60);
    const speed = (60 / paceDec).toFixed(1);

    return (
        <ToolContainer title="Tính Pace Chạy" color="from-cyan-400 to-blue-600">
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="text-xs text-text-muted">Km</label>
                    <input type="number" value={dist} onChange={e => setDist(Number(e.target.value))} className="input" />
                </div>
                <div className="flex-1">
                    <label className="text-xs text-text-muted">Phút</label>
                    <input type="number" value={time} onChange={e => setTime(Number(e.target.value))} className="input" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                <ResultBox label="Pace (min/km)" value={`${paceMin}:${paceSec.toString().padStart(2, '0')}`} />
                <ResultBox label="Tốc độ (km/h)" value={speed} />
            </div>
        </ToolContainer>
    )
}

// 8. VO2 Max Estimator (Cooper Test)
export function Vo2MaxCalc() {
    const [distance, setDistance] = useState(0); // meters in 12 min
    const vo2 = distance > 0 ? ((distance - 504.9) / 44.73).toFixed(1) : 0;

    return (
        <ToolContainer title="Ước tính VO2 Max" color="from-purple-500 to-indigo-600">
            <label className="text-xs text-text-muted mb-2 block">Chạy được bao nhiêu mét trong 12 phút?</label>
            <input type="number" placeholder="VD: 2400" className="input" onChange={e => setDistance(Number(e.target.value))} />
            {Number(vo2) > 0 && <ResultBox label="VO2 Max" value={vo2} sub="ml/kg/min" large />}
        </ToolContainer>
    )
}

// --- CATEGORY 4: TIMERS & UTILITIES ---

import { useEffect } from 'react';

// 9. Tabata Timer
export function TabataTimer() {
    const [isActive, setIsActive] = useState(false);
    const [round, setRound] = useState(1);
    const [phase, setPhase] = useState<'work' | 'rest'>('work');
    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && round <= 8) {
            interval = setInterval(() => {
                setTimeLeft((t) => {
                    if (t === 1) {
                        // Switch phase or round
                        if (phase === 'work') {
                            setPhase('rest');
                            return 10;
                        } else {
                            setPhase('work');
                            setRound(r => r + 1);
                            return 20;
                        }
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, phase, round]);

    useEffect(() => {
        if (round > 8) {
            setIsActive(false);
            setRound(1);
            setPhase('work');
            toast.success("Hoàn thành Tabata!");
        }
    }, [round]);

    return (
        <ToolContainer title="Đồng Hồ Tabata" color={phase === 'work' ? "from-red-500 to-orange-500" : "from-green-500 to-teal-500"}>
            <div className="text-center flex-1 flex flex-col justify-center">
                <div className="text-6xl font-black text-white font-mono">{timeLeft}s</div>
                <div className="text-xl uppercase font-bold text-text-muted mb-4">{phase === 'work' ? 'TẬP NGAY!' : 'NGHỈ NGƠI'}</div>
                <div className="flex gap-2 justify-center text-sm font-bold text-text-muted mb-4">
                    Vòng {round}/8
                </div>
                <button
                    className={`btn w-full ${isActive ? 'bg-red-500' : 'bg-green-500'} text-black font-bold`}
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? 'DỪNG' : 'BẮT ĐẦU (4 PHÚT)'}
                </button>
            </div>
        </ToolContainer>
    )
}

// 10. EMOM Timer
export function EmomTimer() {
    const [minutes, setMinutes] = useState(10);
    const [currentMin, setCurrentMin] = useState(0);
    const [sec, setSec] = useState(60);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (active && currentMin < minutes) {
            interval = setInterval(() => {
                setSec(s => {
                    if (s === 1) {
                        setCurrentMin(m => m + 1);
                        return 60;
                    }
                    return s - 1;
                })
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [active, currentMin, minutes]);

    return (
        <ToolContainer title="Đồng Hồ EMOM" color="from-pink-500 to-rose-600">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs">Tổng phút:</span>
                <input type="number" value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="w-16 bg-black/20 text-center rounded" />
            </div>

            <div className="text-center">
                <div className="text-5xl font-mono font-black text-white">{sec === 60 ? '00' : sec}</div>
                <div className="text-sm text-text-muted mt-1 uppercase font-bold">Phút thứ {currentMin + 1}</div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <button className="btn w-full bg-primary text-white" onClick={() => setActive(!active)}>
                    {active ? 'TẠM DỪNG' : 'BẮT ĐẦU EMOM'}
                </button>
            </div>
        </ToolContainer>
    )
}

// 11. Stopwatch
export function Stopwatch() {
    const [time, setTime] = useState(0);
    const [run, setRun] = useState(false);

    useEffect(() => {
        let int: ReturnType<typeof setInterval> | null = null;
        if (run) int = setInterval(() => setTime(t => t + 10), 10);
        return () => {
            if (int) clearInterval(int);
        };
    }, [run]);

    return (
        <ToolContainer title="Bấm Giờ" color="from-gray-300 to-white text-black">
            <div className="text-5xl font-mono text-center my-4 font-black">
                {new Date(time).toISOString().slice(14, 22)}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button className="btn bg-green-500 text-black font-bold" onClick={() => setRun(!run)}>{run ? 'Dừng' : 'Bắt đầu'}</button>
                <button className="btn bg-white/10" onClick={() => setTime(0)}>Đặt lại</button>
            </div>
        </ToolContainer>
    )
}

// 13. Wilks Calculator
export function WilksCalc() {
    const [sex, setSex] = useState<'m' | 'f'>('m');
    const [bw, setBw] = useState(0);
    const [total, setTotal] = useState(0);

    const calculate = () => {
        if (!bw || !total) return 0;
        const w = bw;
        let score = 0;
        if (sex === 'm') {
            const a = -216.0475144, b = 16.23006362, c = -0.132588139, d = 0.000637213, e = -0.000001429, f = 0.000000001;
            score = total * 500 / (a + b * w + c * w ** 2 + d * w ** 3 + e * w ** 4 + f * w ** 5);
        } else {
            const a = 594.3174777, b = -27.23842537, c = 0.821122269, d = -0.009307339, e = 0.000047316, f = -0.000000091;
            score = total * 500 / (a + b * w + c * w ** 2 + d * w ** 3 + e * w ** 4 + f * w ** 5);
        }
        return score.toFixed(1);
    }

    return (
        <ToolContainer title="Điểm Wilks" color="from-amber-400 to-red-500">
            <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                <button onClick={() => setSex('m')} className={`flex-1 py-1 rounded ${sex === 'm' ? 'bg-primary text-white' : 'text-text-muted'}`}>Nam</button>
                <button onClick={() => setSex('f')} className={`flex-1 py-1 rounded ${sex === 'f' ? 'bg-primary text-white' : 'text-text-muted'}`}>Nữ</button>
            </div>
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setBw(Number(e.target.value))} />
            <input type="number" placeholder="Tổng tạ (S+B+D)" className="input" onChange={e => setTotal(Number(e.target.value))} />
            {Number(calculate()) > 0 && <ResultBox label="Điểm Wilks" value={calculate()} large />}
        </ToolContainer>
    );
}

// 14. Plate Calculator
export function PlateCalc() {
    const [target, setTarget] = useState(0);
    const barWeight = 20;

    const calculatePlates = () => {
        if (target <= barWeight) return [];
        let weightPerSide = (target - barWeight) / 2;
        const result = [];
        const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
        for (const p of plates) {
            while (weightPerSide >= p) {
                result.push(p);
                weightPerSide -= p;
            }
        }
        return result;
    }

    return (
        <ToolContainer title="Tính Bánh Tạ" color="from-zinc-400 to-zinc-600">
            <input type="number" placeholder="Mục tiêu (kg)" className="input" onChange={e => setTarget(Number(e.target.value))} />
            {target > barWeight && (
                <div className="space-y-2">
                    <p className="text-[10px] text-text-muted uppercase font-bold text-center">Bánh tạ mỗi bên:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {calculatePlates().map((p, i) => (
                            <span key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${p >= 20 ? 'bg-red-500 border-red-700' : p >= 15 ? 'bg-yellow-500 border-yellow-700' : 'bg-blue-500 border-blue-700'}`}>
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </ToolContainer>
    );
}

// 15. Ideal Body Measurement (Golden Ratio)
export function IdealBody() {
    const [wrist, setWrist] = useState(0);

    return (
        <ToolContainer title="Tỉ Lệ Vàng" color="from-yellow-400 to-yellow-200 text-black">
            <input type="number" placeholder="Cổ tay (cm)" className="input" onChange={e => setWrist(Number(e.target.value))} />
            {wrist > 0 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white/5 rounded">Ngực: {(wrist * 6.5).toFixed(1)}cm</div>
                    <div className="p-2 bg-white/5 rounded">Hông: {(wrist * 5.5).toFixed(1)}cm</div>
                    <div className="p-2 bg-white/5 rounded">Eo: {(wrist * 4.5).toFixed(1)}cm</div>
                    <div className="p-2 bg-white/5 rounded">Bắp tay: {(wrist * 2.3).toFixed(1)}cm</div>
                </div>
            )}
        </ToolContainer>
    );
}

// 16. Rest Timer
export function RestTimer() {
    const [time, setTime] = useState(60);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        if (active && time > 0) {
            timer = setInterval(() => setTime(t => t - 1), 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [active, time]);

    useEffect(() => {
        if (time === 0) {
            setActive(false);
            toast.success("Hết thời gian nghỉ!");
            setTime(60);
        }
    }, [time]);

    return (
        <ToolContainer title="Nghỉ Ngơi" color="from-emerald-400 to-teal-500">
            <div className="text-5xl font-mono text-center mb-4">{time}s</div>
            <div className="grid grid-cols-2 gap-2">
                <button className="btn bg-primary text-white" onClick={() => setActive(!active)}>{active ? 'Tạm Dừng' : 'Bắt Đầu'}</button>
                <button className="btn bg-white/10" onClick={() => { setTime(60); setActive(false) }}>Đặt lại</button>
            </div>
            <div className="flex gap-1 mt-2">
                {[30, 60, 90, 120].map(s => (
                    <button key={s} className="flex-1 py-1 bg-white/5 rounded text-[10px]" onClick={() => setTime(s)}>{s}s</button>
                ))}
            </div>
        </ToolContainer>
    );
}

// 17. Strength Standards (Bench/Squat/Deadlift levels)
export function StrengthStandards() {
    const [lift, setLift] = useState(100);
    const [weight, setWeight] = useState(70);

    const ratio = lift / weight;
    const getLevel = () => {
        if (ratio < 1) return 'Mới Tập';
        if (ratio < 1.5) return 'Trung Bình';
        if (ratio < 2) return 'Thành Thạo';
        return 'Chuyên Nghiệp';
    }

    return (
        <ToolContainer title="Đẳng Cấp" color="from-blue-500 to-cyan-400">
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setWeight(Number(e.target.value))} />
            <input type="number" placeholder="Mức tạ 1RM (kg)" className="input" onChange={e => setLift(Number(e.target.value))} />
            <ResultBox label="Trình độ" value={getLevel()} />
        </ToolContainer>
    );
}

// 18. Hydration Goal
export function HydrationLog() {
    const [weight, setWeight] = useState(0);
    return (
        <ToolContainer title="Mục Tiêu Nước" color="from-blue-400 to-blue-600">
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setWeight(Number(e.target.value))} />
            {weight > 0 && <ResultBox label="Nước cần uống" value={`${(weight * 0.033).toFixed(1)} L`} sub="+0.5L mỗi giờ tập" large />}
        </ToolContainer>
    );
}

// 19. HR Zones
export function HRZones() {
    const [age, setAge] = useState(25);
    const mhr = 220 - age;
    return (
        <ToolContainer title="Vùng Nhịp Tim" color="from-red-400 to-red-600">
            <input type="number" placeholder="Tuổi" className="input" value={age} onChange={e => setAge(Number(e.target.value))} />
            <div className="space-y-1 text-[10px]">
                <div className="flex justify-between p-1 bg-green-500/20 rounded"><span>Zone 1 (Phục hồi)</span><span>{Math.round(mhr * 0.5)} - {Math.round(mhr * 0.6)} bpm</span></div>
                <div className="flex justify-between p-1 bg-yellow-500/20 rounded"><span>Zone 2 (Đốt mỡ)</span><span>{Math.round(mhr * 0.6)} - {Math.round(mhr * 0.7)} bpm</span></div>
                <div className="flex justify-between p-1 bg-orange-500/20 rounded"><span>Zone 3 (Cardio)</span><span>{Math.round(mhr * 0.7)} - {Math.round(mhr * 0.8)} bpm</span></div>
                <div className="flex justify-between p-1 bg-red-500/20 rounded"><span>Zone 4 (Cao độ)</span><span>{Math.round(mhr * 0.8)} - {Math.round(mhr * 0.9)} bpm</span></div>
            </div>
        </ToolContainer>
    );
}

// 20. BMI Advanced
export function BMICalc() {
    const [h, setH] = useState(0);
    const [w, setW] = useState(0);
    const bmi = w / ((h / 100) ** 2);
    const getCat = () => {
        if (bmi < 18.5) return 'Gầy';
        if (bmi < 25) return 'Bình thường';
        if (bmi < 30) return 'Quá cân';
        return 'Béo phì';
    }
    return (
        <ToolContainer title="Chỉ Số BMI" color="from-green-400 to-blue-500">
            <input type="number" placeholder="Chiều cao (cm)" className="input" onChange={e => setH(Number(e.target.value))} />
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setW(Number(e.target.value))} />
            {h > 0 && w > 0 && <ResultBox label={getCat()} value={bmi.toFixed(1)} large />}
        </ToolContainer>
    );
}

// 21. DOTS Score
export function DotsCalc() {
    const [sex, setSex] = useState<'m' | 'f'>('m');
    const [bw, setBw] = useState(0);
    const [total, setTotal] = useState(0);

    const calculate = () => {
        if (!bw || !total) return 0;
        let a, b, c, d, e;
        if (sex === 'm') {
            a = -0.000001093, b = 0.000739129, c = -0.191875922, d = 24.0900756, e = -307.75076;
        } else {
            a = -0.0000010706, b = 0.0005158568, c = -0.1126876122, d = 13.6175032, e = -5.733612;
        }
        const w = bw;
        const coeff = 500 / (a * w ** 4 + b * w ** 3 + c * w ** 2 + d * w + e);
        return (total * coeff).toFixed(1);
    }

    return (
        <ToolContainer title="Thang DOTS" color="from-indigo-600 to-purple-500">
            <div className="flex gap-2 mb-2">
                <button onClick={() => setSex('m')} className={`flex-1 py-1 rounded text-xs ${sex === 'm' ? 'bg-primary' : 'bg-white/5'}`}>Nam</button>
                <button onClick={() => setSex('f')} className={`flex-1 py-1 rounded text-xs ${sex === 'f' ? 'bg-primary' : 'bg-white/5'}`}>Nữ</button>
            </div>
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setBw(Number(e.target.value))} />
            <input type="number" placeholder="Tổng tạ (kg)" className="input" onChange={e => setTotal(Number(e.target.value))} />
            {Number(calculate()) > 0 && <ResultBox label="Điểm DOTS" value={calculate()} large />}
        </ToolContainer>
    );
}

// 22. One Rep Max - Epley vs Brzycki
export function OneRMAvg() {
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);

    const orm = weight * (1 + reps / 30);
    return (
        <ToolContainer title="Ước tính 1RM" color="from-orange-600 to-red-600">
            <input type="number" placeholder="Tạ (kg)" className="input" onChange={e => setWeight(Number(e.target.value))} />
            <input type="number" placeholder="Số lần (reps)" className="input" onChange={e => setReps(Number(e.target.value))} />
            {weight > 0 && reps > 0 && <ResultBox label="Bình quân 1RM" value={`${orm.toFixed(1)}kg`} large />}
        </ToolContainer>
    );
}

// 23. Vertical Jump Estimate (Sargent)
export function JumpCalc() {
    const [reach, setReach] = useState(0);
    const [jump, setJump] = useState(0);
    return (
        <ToolContainer title="Sức Bật" color="from-orange-400 to-yellow-600">
            <input type="number" placeholder="Tầm tay đứng (cm)" className="input" onChange={e => setReach(Number(e.target.value))} />
            <input type="number" placeholder="Tầm tay nhảy (cm)" className="input" onChange={e => setJump(Number(e.target.value))} />
            {jump > reach && <ResultBox label="Sức bật" value={`${jump - reach} cm`} large />}
        </ToolContainer>
    );
}

// 24. Wilks 2.0 (IPF Formula)
export function IpfPoints() {
    const [sex, setSex] = useState<'m' | 'f'>('m');
    const [bw, setBw] = useState(0);
    const [total, setTotal] = useState(0);

    const calculate = () => {
        if (!bw || !total) return 0;
        // Simplified IPF GL formula constants
        const c = sex === 'm' ?
            [1199.72839, 1025.18162, 0.00921] :
            [610.32796, 1045.5282, 0.03448];
        const score = total * 100 / (c[0] - c[1] * Math.exp(-c[2] * bw));
        return score.toFixed(2);
    }

    return (
        <ToolContainer title="Điểm IPF Mới" color="from-zinc-100 to-zinc-400 text-black">
            <div className="flex gap-2 mb-2">
                <button onClick={() => setSex('m')} className={`flex-1 py-1 rounded text-xs ${sex === 'm' ? 'bg-primary text-white' : 'bg-white/5'}`}>Nam</button>
                <button onClick={() => setSex('f')} className={`flex-1 py-1 rounded text-xs ${sex === 'f' ? 'bg-primary text-white' : 'bg-white/5'}`}>Nữ</button>
            </div>
            <input type="number" placeholder="Cân nặng (kg)" className="input" onChange={e => setBw(Number(e.target.value))} />
            <input type="number" placeholder="Tổng tạ (kg)" className="input" onChange={e => setTotal(Number(e.target.value))} />
            {Number(calculate()) > 0 && <ResultBox label="Điểm IPF" value={calculate()} large />}
            <div className="text-[10px] text-center italic mt-2">Dùng chuẩn 2020 của IPF</div>
        </ToolContainer>
    );
}

// 25. Mental Toughness Checklist (Restored)
export function MentalChecklist() {
    return (
        <ToolContainer title="Tinh Thần Thép" color="from-indigo-400 to-blue-500 text-white">
            <div className="space-y-2">
                {['Dậy sớm trước 5AM', 'Tắm nước lạnh', 'Không đường/Fastfood', 'Đọc 10 trang sách', 'Tập luyện 45 phút'].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded hover:bg-white/10 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-primary rounded" />
                        <span className="text-sm font-medium">{item}</span>
                    </label>
                ))}
            </div>
        </ToolContainer>
    )
}
