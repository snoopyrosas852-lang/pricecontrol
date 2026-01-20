
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown, Plus, Calculator, AlertCircle, Trash2, Edit3, RotateCcw, Lock } from 'lucide-react';
import { Rule } from '../types';

const PRICE_VARIABLES = ['项目外链价', '固定清单价', '平台外链价', '咸亨官网价', '项目协议价', '调拨价'];
const OPERATORS = ['+', '-', '*', '/', '(', ')', '>', '<', '>=', '<='];
const COMPARISON_OPERATORS = ['>', '<', '>=', '<='];

const TYPE_TO_VARIABLES: Record<string, string[]> = {
  '固定价比较检查': ['固定清单价', '项目协议价'],
  '项目外链比较检查': ['项目外链价', '项目协议价'],
  '外部链接比较检查': ['平台外链价', '项目协议价'],
  '咸亨官网价比较检查': ['咸亨官网价', '项目协议价'],
  '通用检查': PRICE_VARIABLES,
};

const INITIAL_RULES: Rule[] = [
  { 
    id: '1', 
    name: '固定价', 
    type: '固定价比较检查', 
    createdAt: '2026-01-19', 
    formula: '[项目协议价] > [固定清单价]',
    isSystem: true
  },
  { 
    id: '2', 
    name: '项目外链', 
    type: '项目外链比较检查', 
    createdAt: '2025-12-05', 
    formula: '[项目外链价] < [项目协议价]',
    isSystem: true
  },
  { 
    id: '3', 
    name: '外链', 
    type: '外部链接比较检查', 
    createdAt: '2025-12-05', 
    formula: '[平台外链价] < [项目协议价]',
    isSystem: true
  },
  { 
    id: '4', 
    name: '官网价', 
    type: '咸亨官网价比较检查', 
    createdAt: '2025-12-05', 
    formula: '[咸亨官网价] < [项目协议价]',
    isSystem: true
  },
  { 
    id: '5', 
    name: '毛利率预警', 
    type: '通用检查', 
    createdAt: '2025-11-20', 
    formula: '( [项目协议价] - [调拨价] ) / [项目协议价]',
    thresholdUp: '10%',
    thresholdDown: '0%',
    isSystem: false
  },
];

const RuleLibrary: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [nameSearch, setNameSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState<Partial<Rule>>({});

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesName = rule.name.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesType = typeSearch === '' || rule.type === typeSearch;
      return matchesName && matchesType;
    });
  }, [rules, nameSearch, typeSearch]);

  const hasComparison = useMemo(() => {
    const formula = formData.formula || '';
    return COMPARISON_OPERATORS.some(op => formula.includes(op));
  }, [formData.formula]);

  const availableVariables = useMemo(() => {
    if (!formData.type) return [];
    return TYPE_TO_VARIABLES[formData.type] || PRICE_VARIABLES;
  }, [formData.type]);

  const handleDelete = (rule: Rule) => {
    if (rule.isSystem) return;
    if (window.confirm('确定要删除这条规则吗？')) {
      setRules(prev => prev.filter(r => r.id !== rule.id));
    }
  };

  const handleOpenModal = (rule?: Rule) => {
    if (rule) {
      if (rule.isSystem) return;
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({ name: '', type: '通用检查', thresholdUp: '', thresholdDown: '', formula: '' });
    }
    setIsModalOpen(true);
  };

  const handleReset = () => {
    setNameSearch('');
    setTypeSearch('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      thresholdUp: hasComparison ? undefined : formData.thresholdUp,
      thresholdDown: hasComparison ? undefined : formData.thresholdDown
    };

    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...finalData } as Rule : r));
    } else {
      const newRule: Rule = {
        id: Math.random().toString(36).substr(2, 9),
        name: finalData.name || '未命名规则',
        type: finalData.type || '通用检查',
        createdAt: new Date().toISOString().split('T')[0],
        thresholdUp: finalData.thresholdUp,
        thresholdDown: finalData.thresholdDown,
        formula: finalData.formula || '',
        isSystem: false,
      };
      setRules(prev => [newRule, ...prev]);
    }
    setIsModalOpen(false);
  };

  const addToFormula = (token: string) => {
    const currentFormula = formData.formula || '';
    const spacing = (currentFormula.length > 0 && !currentFormula.endsWith(' ')) ? ' ' : '';
    setFormData({ ...formData, formula: currentFormula + spacing + token });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-3">规则库管理</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-all shadow-md hover:shadow-lg flex items-center font-medium"
        >
          <Plus size={16} className="mr-1.5" />
          新增规则
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">规则名称</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="请输入名称进行模糊搜索" 
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-md pl-3 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">规则类型</label>
            <select 
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
            >
              <option value="">全部类型</option>
              {Object.keys(TYPE_TO_VARIABLES).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              查询
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <RotateCcw size={14} className="mr-1.5" />
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">规则名称</th>
                <th className="px-6 py-4">规则类型</th>
                <th className="px-6 py-4">计算公式 / 逻辑</th>
                <th className="px-6 py-4 text-center">浮动阈值 (上下)</th>
                <th className="px-6 py-4">创建日期</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRules.map((rule) => {
                const ruleHasComparison = COMPARISON_OPERATORS.some(op => rule.formula?.includes(op));
                return (
                  <tr key={rule.id} className={`transition-colors group ${rule.isSystem ? 'bg-gray-50/30' : 'hover:bg-blue-50/30'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{rule.name}</span>
                        {rule.isSystem && (
                          <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">系统</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {rule.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calculator size={14} className={`${rule.isSystem ? 'text-gray-400' : 'text-blue-500'}`} />
                        <code className={`text-[12px] px-2 py-1 rounded font-mono border ${rule.isSystem ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {rule.formula || '--'}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        {ruleHasComparison ? (
                          <span className="text-[11px] text-gray-400 italic bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            逻辑判定模式
                          </span>
                        ) : (
                          <>
                            <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-100">
                              <ArrowUp size={10} className="mr-1" />
                              {rule.thresholdUp || '0%'}
                            </div>
                            <div className="flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs border border-rose-100">
                              <ArrowDown size={10} className="mr-1" />
                              {rule.thresholdDown || '0%'}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {rule.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {rule.isSystem ? (
                          <div className="p-1.5 text-gray-400 flex items-center">
                            <Lock size={16} className="opacity-60" />
                          </div>
                        ) : (
                          <>
                            <button onClick={() => handleOpenModal(rule)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(rule)} className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md transition-colors"><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white w-full max-w-[640px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fafafa]">
              <h3 className="text-[15px] font-bold text-[#333]">编辑规则详情</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Name and Type */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#333]">
                    规则名称 <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
                    placeholder="请输入"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#333]">
                    规则类型 <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <select 
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-[#d9d9d9] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white transition-all"
                  >
                    {Object.keys(TYPE_TO_VARIABLES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Formula Section */}
              <div className="bg-[#f8fbff] p-5 rounded-xl border border-[#e6f1ff] space-y-4">
                <div className="flex items-center space-x-2 text-[13px] font-bold text-[#333]">
                  <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                    <Calculator size={14} />
                  </div>
                  <span>公式配置 (基准价格)</span>
                </div>
                
                <textarea 
                  required
                  rows={2}
                  value={formData.formula}
                  onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  className="w-full border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm font-mono outline-none focus:border-blue-500 bg-white resize-none shadow-sm"
                  placeholder="请输入公式"
                />
                
                {/* Available Variables */}
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-[#999]">可用价格变量</p>
                  <div className="flex flex-wrap gap-2">
                    {availableVariables.map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => addToFormula(`[${v}]`)}
                        className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-500 rounded-md border border-blue-200 text-[12px] transition-all"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operators */}
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-[#999]">逻辑运算符</p>
                  <div className="flex flex-wrap gap-2">
                    {OPERATORS.map(op => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => addToFormula(op)}
                        className="w-10 h-8 bg-white hover:bg-gray-50 text-[#666] rounded-md border border-[#d9d9d9] text-[13px] font-medium transition-all flex items-center justify-center"
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Threshold Section */}
              <div className={`p-5 rounded-xl border transition-all duration-300 ${hasComparison ? 'bg-gray-50 border-gray-200' : 'bg-[#f6ffed]/40 border-[#b7eb8f]'}`}>
                <div className="flex items-center justify-between mb-4">
                   <label className="text-[13px] font-bold text-[#333]">
                     浮动阈值设置
                   </label>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={`text-[12px] font-bold flex items-center ${hasComparison ? 'text-gray-400' : 'text-[#52c41a]'}`}>
                      <ArrowUp size={14} className="mr-1" />
                      上浮阈值 (%)
                    </label>
                    <input 
                      disabled={hasComparison}
                      type="text"
                      value={hasComparison ? '' : formData.thresholdUp}
                      onChange={(e) => setFormData({ ...formData, thresholdUp: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${hasComparison ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-[#b7eb8f] focus:border-[#52c41a] focus:ring-4 focus:ring-[#52c41a]/10'}`}
                      placeholder="如: 10%"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[12px] font-bold flex items-center ${hasComparison ? 'text-gray-400' : 'text-[#ff4d4f]'}`}>
                      <ArrowDown size={14} className="mr-1 rotate-0" />
                      下浮阈值 (%)
                    </label>
                    <input 
                      disabled={hasComparison}
                      type="text"
                      value={hasComparison ? '' : formData.thresholdDown}
                      onChange={(e) => setFormData({ ...formData, thresholdDown: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${hasComparison ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-[#ffa39e] focus:border-[#ff4d4f] focus:ring-4 focus:ring-[#ff4d4f]/10'}`}
                      placeholder="如: 0%"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-[#d9d9d9] rounded-lg text-sm font-medium text-[#666] hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleLibrary;
