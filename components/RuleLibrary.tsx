
import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X, ArrowUp, ArrowDown, Plus, Calculator, AlertCircle, Trash2, Edit3, RotateCcw, Lock } from 'lucide-react';
import { Rule } from '../types';

const PRICE_VARIABLES = ['项目外链价', '固定清单价', '平台外链价', '咸亨官网价', '项目协议价', '调拨价'];
const OPERATORS = ['+', '-', '*', '/', '(', ')', '>', '<', '>=', '<='];
const COMPARISON_OPERATORS = ['>', '<', '>=', '<='];

// 规则类型与变量的强相关映射
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
    name: '利润率预警', 
    type: '通用检查', 
    createdAt: '2025-11-20', 
    formula: '[项目协议价] / [固定清单价]',
    thresholdUp: '15%',
    thresholdDown: '5%',
    isSystem: false
  },
];

const RuleLibrary: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [nameSearch, setNameSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState<Partial<Rule>>({});

  // Filtering Logic
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

  // 根据当前选择的类型获取可用变量
  const availableVariables = useMemo(() => {
    if (!formData.type) return [];
    return TYPE_TO_VARIABLES[formData.type] || PRICE_VARIABLES;
  }, [formData.type]);

  const handleDelete = (rule: Rule) => {
    if (rule.isSystem) {
      alert('系统内置核心规则不可删除');
      return;
    }
    if (window.confirm('确定要删除这条规则吗？')) {
      setRules(prev => prev.filter(r => r.id !== rule.id));
    }
  };

  const handleOpenModal = (rule?: Rule) => {
    if (rule) {
      if (rule.isSystem) {
        // System rules cannot be opened for editing
        return;
      }
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({ name: '', type: '', thresholdUp: '', thresholdDown: '', formula: '' });
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
    const spacing = (currentFormula.length > 0 && !currentFormula.endsWith(' ') && !OPERATORS.includes(token)) ? ' ' : '';
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

      {/* Search Panel */}
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

      {/* Table Section */}
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
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => {
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
                      <td className="px-6 py-4">
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
                            <div className="p-1.5 text-gray-400 flex items-center" title="系统核心规则，不可修改">
                              <Lock size={16} className="opacity-60" />
                              <span className="text-[10px] ml-1 font-bold">锁定</span>
                            </div>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleOpenModal(rule)}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                title="编辑"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(rule)}
                                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md transition-colors"
                                title="删除"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 text-gray-400">
                      <Search size={48} strokeWidth={1} />
                      <p className="text-base">没有找到匹配的规则</p>
                      <button 
                        onClick={handleReset}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        清除所有过滤器
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Mock */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
          <div>共 {filteredRules.length} 条数据</div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
            <button className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded shadow-sm">1</button>
            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start space-x-3">
        <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <p className="font-bold mb-1">规则配置说明：</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>系统内置规则</strong>：标有“系统”字样的规则（固定价、项目外链等）为平台核心逻辑，<strong>不支持任何修改或删除</strong>操作。</li>
            <li><strong>相关性限制</strong>：公式可用变量将根据您选择的“规则类型”自动过滤，以确保逻辑准确性。</li>
            <li><strong>直接判定模式</strong>：计算公式中使用 <code className="bg-blue-100 px-1 rounded font-bold">{">, <, >=, <="}</code> 时，将不再支持浮动阈值设置。</li>
          </ul>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-800">
                {editingRule ? '编辑规则详情' : '创建新监管规则'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">规则名称 <span className="text-rose-500">*</span></label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="例如：物料差价监管"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">规则类型 <span className="text-rose-500">*</span></label>
                  <select 
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
                  >
                    <option value="">请选择类型</option>
                    {Object.keys(TYPE_TO_VARIABLES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center justify-between">
                  <span className="flex items-center">
                    <Calculator size={14} className="mr-1.5 text-blue-500" />
                    公式配置 (基准价格)
                  </span>
                  {!formData.type && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center animate-pulse">
                      <AlertCircle size={10} className="mr-1" /> 请先选择规则类型
                    </span>
                  )}
                </label>
                <textarea 
                  required
                  rows={2}
                  value={formData.formula}
                  onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-none"
                  placeholder="例: [项目协议价] * 1.1"
                />
                
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">可用价格变量</p>
                  <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {availableVariables.length > 0 ? (
                      availableVariables.map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => addToFormula(`[${v}]`)}
                          className="px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-600 rounded-md border border-blue-200 text-[11px] font-medium transition-all animate-in fade-in slide-in-from-left-1"
                        >
                          {v}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 italic py-1">选择类型后显示对应变量</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">逻辑运算符</p>
                  <div className="flex flex-wrap gap-2">
                    {OPERATORS.map(op => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => addToFormula(op)}
                        className="min-w-[2.5rem] h-8 bg-white hover:bg-gray-100 text-gray-600 rounded-md border border-gray-200 text-xs font-bold flex items-center justify-center transition-all"
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all duration-300 ${hasComparison ? 'bg-gray-100/50 border-gray-200' : 'bg-emerald-50/30 border-emerald-100'}`}>
                <div className="flex items-center justify-between mb-4">
                   <label className={`text-xs font-bold uppercase ${hasComparison ? 'text-gray-400' : 'text-gray-700'}`}>
                     浮动阈值设置
                   </label>
                   {hasComparison && (
                     <div className="flex items-center text-orange-600 space-x-1.5 px-2 py-1 bg-orange-100 rounded text-[10px] font-bold">
                       <AlertCircle size={12} />
                       <span>逻辑判定模式已启用，无法设置阈值</span>
                     </div>
                   )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-medium flex items-center ${hasComparison ? 'text-gray-400' : 'text-emerald-700'}`}>
                      <ArrowUp size={12} className="mr-1" />
                      上浮阈值 (%)
                    </label>
                    <input 
                      disabled={hasComparison}
                      type="text"
                      value={hasComparison ? '' : formData.thresholdUp}
                      onChange={(e) => setFormData({ ...formData, thresholdUp: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${hasComparison ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                      placeholder="如: 10%"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[11px] font-medium flex items-center ${hasComparison ? 'text-gray-400' : 'text-rose-700'}`}>
                      <ArrowDown size={12} className="mr-1" />
                      下浮阈值 (%)
                    </label>
                    <input 
                      disabled={hasComparison}
                      type="text"
                      value={hasComparison ? '' : formData.thresholdDown}
                      onChange={(e) => setFormData({ ...formData, thresholdDown: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${hasComparison ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-rose-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'}`}
                      placeholder="如: 5%"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
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
