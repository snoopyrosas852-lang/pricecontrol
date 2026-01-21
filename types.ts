
export interface Rule {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  thresholdUp?: string;
  thresholdDown?: string;
  isThresholdEnabled?: boolean; // New field for toggle
  formula?: string;
  isSystem?: boolean;
}

export interface Customer {
  id: string;
  projectName: string;
}

export enum SidebarItem {
  WarningCenter = '预警中心',
  PriceDataPool = '价格数据池',
  RuleLibrary = '规则库',
  CustomerManagement = '客户管理'
}
