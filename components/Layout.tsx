
import React from 'react';
import { 
  Bell, 
  CheckSquare, 
  LayoutGrid, 
  Target, 
  Brush, 
  User, 
  ChevronDown,
  ChevronRight,
  Flame,
  Settings,
  Database,
  Users,
  ShieldCheck
} from 'lucide-react';
import { SidebarItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeSidebar: SidebarItem;
  setActiveSidebar: (item: SidebarItem) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSidebar, setActiveSidebar }) => {
  const getIcon = (item: SidebarItem) => {
    switch (item) {
      case SidebarItem.BudgetCenter: return <Settings size={14} />;
      case SidebarItem.PriceDataPool: return <Database size={14} />;
      case SidebarItem.RuleLibrary: return <ShieldCheck size={14} />;
      case SidebarItem.CustomerManagement: return <Users size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
      {/* Top Header */}
      <header className="bg-[#1890ff] text-white h-12 flex items-center justify-between px-6 text-xs font-medium shrink-0 shadow-md z-10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-[#1890ff] font-black text-base italic">XH</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">咸亨国际</span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest leading-none">Master Data Platform</span>
            </div>
          </div>
          <button className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-full transition-all shadow-sm">
            <Flame size={12} fill="currentColor" />
            <span className="font-bold">业务系统切换</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-4 pr-4 border-r border-white/20">
            <button className="relative p-1 hover:bg-white/10 rounded-full transition-colors" title="消息通知">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border-2 border-[#1890ff] rounded-full"></span>
            </button>
            <button className="relative p-1 hover:bg-white/10 rounded-full transition-colors" title="价格审核">
              <CheckSquare size={18} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded-full transition-colors" title="清洗任务">
              <Brush size={18} />
            </button>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold">
              管
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] opacity-70">当前用户</span>
              <span className="text-xs font-bold">系统管理员</span>
            </div>
            <ChevronDown size={14} className="opacity-50" />
          </div>
        </div>
      </header>

      {/* Breadcrumbs / Sub Header */}
      <div className="bg-white h-10 flex items-center px-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center text-xs space-x-2">
          <LayoutGrid size={14} className="text-blue-600" />
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">价格监管中心</span>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-bold">{activeSidebar}</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-6 shrink-0 shadow-sm">
          <div className="px-6 mb-4 flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">业务导航</span>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {[
              SidebarItem.BudgetCenter,
              SidebarItem.PriceDataPool,
              SidebarItem.RuleLibrary,
              SidebarItem.CustomerManagement
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveSidebar(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all ${
                  activeSidebar === item 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 font-bold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`${activeSidebar === item ? 'text-white' : 'text-blue-500'}`}>
                  {getIcon(item)}
                </span>
                <span>{item}</span>
                {activeSidebar === item && <ChevronRight size={14} className="ml-auto opacity-70" />}
              </button>
            ))}
          </nav>
          
          <div className="px-6 pt-6 mt-auto border-t border-gray-100">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">系统状态</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-emerald-700">服务正常运行</span>
                </div>
             </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
