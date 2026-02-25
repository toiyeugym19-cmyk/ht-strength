// Chat Screen
import { MessageSquare, FileText, Clock, BrainCircuit } from 'lucide-react';
import { AppHeader, SubMenuGrid, NavFunction, Screen } from '../ui';

export const ChatScreen = ({ nav }: { nav: NavFunction }) => {
    const chatSubFeatures = [
        { icon: MessageSquare, label: 'Broadcast', desc: 'Gửi tin nhắn hàng loạt', screen: 'chat_broadcast' as Screen, color: 'bg-blue-600' },
        { icon: FileText, label: 'Templates', desc: 'Mẫu tin nhắn', screen: 'chat_templates' as Screen, color: 'bg-purple-600' },
        { icon: Clock, label: 'Lịch sử', desc: 'Tin nhắn đã gửi', screen: 'chat_history' as Screen, color: 'bg-yellow-600' },
        { icon: BrainCircuit, label: 'Auto Bot', desc: 'Tin nhắn tự động', screen: 'chat_bots' as Screen, color: 'bg-green-600' },
    ];

    return (
        <div className="p-6 pt-12 h-screen bg-[#030014] flex flex-col pb-32">
            <AppHeader nav={nav} showLogo={true} />

            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Messaging Center</h3>
            <SubMenuGrid items={chatSubFeatures} nav={nav} />

            {/* Placeholder */}
            <div className="flex-1 flex items-center justify-center mt-8">
                <div className="text-center">
                    <MessageSquare size={48} className="text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-600 text-xs font-bold uppercase">Chọn chức năng để bắt đầu</p>
                </div>
            </div>
        </div>
    );
};
