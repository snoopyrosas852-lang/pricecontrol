
import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, CheckCircle, Download } from 'lucide-react';

interface WarningItem {
  id: string;
  code: string;
  ruleType: string;
  status: '待处理' | '已处理';
  brand: string;
  name: string;
  model: string;
  description: string;
  supplier: string;
  warningInfo: string;
  warningTime: string;
  selected?: boolean;
}

const MOCK_WARNINGS: WarningItem[] = [
  {
    id: '3',
    code: 'B1201000016',
    ruleType: '毛利率预警',
    status: '待处理',
    brand: '品牌测试1234/PINPAI1212',
    name: '物料A',
    model: 'M-100',
    description: '毛利率低于预定阈值',
    supplier: '咸亨国际供应商',
    warningInfo: '当前毛利率 (4.00 - 3.80) / 4.00 = 5% < 预警阈值 10%',
    warningTime: '2026-01-20 09:12:05'
  },
  {
    id: '1',
    code: 'B0301005364',
    ruleType: '外部链接比较检查',
    status: '待处理',
    brand: '品牌测试1234/PINPAI1212',
    name: 'wymgw20001',
    model: '21421dsa',
    description: 'askdljaslkdjlasjkdlkas',
    supplier: '哈尔滨理工大学',
    warningInfo: '0.3300 × 1.11 = 0.366300 元 < 协议价 4.00 元',
    warningTime: '2026-01-19 15:06:46'
  },
  {
    id: '2',
    code: 'B0301005364',
    ruleType: '项目外链价比较检查',
    status: '待处理',
    brand: '品牌测试1234/PINPAI1212',
    name: 'wymgw20001',
    model: '21421dsa',
    description: 'askdljaslkdjlasjkdlkas',
    supplier: '哈尔滨理工大学',
    warningInfo: '0.3300 × 2.1 = 0.69300 元 < 协议价 4.00 元',
    warningTime: '2026-01-19 15:04:31'
  }
];

const WarningCenter: React.FC = () => {
  const [warnings, setWarnings] = useState<WarningItem[]>(MOCK_WARNINGS);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setWarnings(warnings.map(w => ({ ...w, selected: newVal })));
  };

  const toggleItem = (id: string) => {
    setWarnings(warnings.map(w => 
      w.id === id ? { ...w, selected: !w.selected } : w
    ));
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 min-h-full flex flex-col p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-[#333]">预警中心</h2>
      </div>

      <div className="bg-white border border-[#f0f0f0] p-5 rounded space-y-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">所属项目:</span>
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 text-sm w-44 pr-8 outline-none focus:border-blue-500 bg-white">
                <option>管网新系统</option>
                <option>中粮E采</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">规则类型:</span>
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 text-sm w-44 pr-8 outline-none focus:border-blue-500 bg-white">
                <option>请选择</option>
                <option>毛利率预警</option>
                <option>外部链接比较检查</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">处理状态:</span>
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 text-sm w-44 pr-8 outline-none focus:border-blue-500 bg-white">
                <option>请选择</option>
                <option>待处理</option>
                <option>已处理</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">预警日期:</span>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <input type="text" placeholder="开始日期" className="px-3 py-1.5 text-sm w-32 outline-none" />
              <span className="text-gray-400 px-1">→</span>
              <input type="text" placeholder="结束日期" className="px-3 py-1.5 text-sm w-32 outline-none" />
              <div className="px-2 py-1.5 border-l border-gray-300 bg-gray-50">
                <Calendar size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
          <button className="bg-[#1890ff] hover:bg-blue-600 text-white px-6 py-1.5 rounded text-sm transition-colors shadow-sm">
            查询
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={selectAll}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
          />
          <span className="text-sm text-gray-700">全选</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-[#1890ff] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition-colors flex items-center">
            标记已读
          </button>
          <button className="bg-[#1890ff] hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm transition-colors flex items-center">
            批量导出
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border-t border-gray-100 pt-4 space-y-4">
        {warnings.map(item => (
          <div key={item.id} className="border border-gray-200 rounded p-5 relative bg-white hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <input 
                  type="checkbox" 
                  checked={item.selected || false}
                  onChange={() => toggleItem(item.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="text-sm font-medium text-gray-800">{item.code}</span>
                <div className="flex items-center space-x-1 ml-4 text-sm">
                  <span className="text-gray-500">规则类型:</span>
                  <span className={`text-gray-700 font-medium ${item.ruleType === '毛利率预警' ? 'text-blue-600' : ''}`}>{item.ruleType}</span>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 text-orange-500 text-xs px-2 py-0.5 rounded">
                {item.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs text-gray-500 mb-3">
              <div className="space-x-1">
                <span>商品品牌:</span>
                <span className="text-gray-700">{item.brand}</span>
              </div>
              <div className="space-x-1">
                <span>商品名称:</span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="space-x-1">
                <span>商品型号:</span>
                <span className="text-gray-700">{item.model}</span>
              </div>
              <div className="space-x-1">
                <span>商品描述:</span>
                <span className="text-gray-700 truncate inline-block max-w-[120px]" title={item.description}>{item.description}</span>
              </div>
              <div className="space-x-1">
                <span>所属供应商:</span>
                <span className="text-gray-700">{item.supplier}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
               <div className="flex items-start space-x-1 text-xs">
                <span className="text-gray-500 whitespace-nowrap">预警信息:</span>
                <span className={`font-medium ${item.ruleType === '毛利率预警' ? 'text-rose-600' : 'text-gray-700'}`}>{item.warningInfo}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-500">预警时间:</span>
                <span className="text-gray-700 font-mono">{item.warningTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarningCenter;
