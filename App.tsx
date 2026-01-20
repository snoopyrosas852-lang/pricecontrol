
import React, { useState } from 'react';
import Layout from './components/Layout';
import RuleLibrary from './components/RuleLibrary';
import CustomerManagement from './components/CustomerManagement';
import PriceDataPool from './components/PriceDataPool';
import WarningCenter from './components/WarningCenter';
import { SidebarItem } from './types';

const App: React.FC = () => {
  // Use WarningCenter as default to show the new page
  const [activeSidebar, setActiveSidebar] = useState<SidebarItem>(SidebarItem.WarningCenter);

  const renderContent = () => {
    switch (activeSidebar) {
      case SidebarItem.WarningCenter:
        return <WarningCenter />;
      case SidebarItem.PriceDataPool:
        return <PriceDataPool />;
      case SidebarItem.RuleLibrary:
        return <RuleLibrary />;
      case SidebarItem.CustomerManagement:
        return <CustomerManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
            <div className="text-lg font-medium">{activeSidebar} 模块开发中...</div>
            <p className="text-sm">功能正在积极建设中，请尝试切换至“预警中心”或“规则库”。</p>
          </div>
        );
    }
  };

  return (
    <Layout activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar}>
      {renderContent()}
    </Layout>
  );
};

export default App;
