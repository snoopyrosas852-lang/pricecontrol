
export interface Rule {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  thresholdUp?: string;
  thresholdDown?: string;
  formula?: string; // Replaced basePrice with formula
}

export enum SidebarItem {
  BudgetCenter = '预算中心',
  PriceDataPool = '价格数据池',
  RuleLibrary = '规则库',
  CustomerManagement = '客户管理'
}
