
import React, { useState } from 'react';
import Layout from './components/Layout';
import RuleLibrary from './components/RuleLibrary';
import { SidebarItem } from './types';

const App: React.FC = () => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarItem>(SidebarItem.RuleLibrary);

  const renderContent = () => {
    switch (activeSidebar) {
      case SidebarItem.RuleLibrary:
        return <RuleLibrary />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
            <div className="text-lg font-medium">{activeSidebar} 模块开发中...</div>
            <p className="text-sm">请点击侧边栏的“规则库”查看演示页面。</p>
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
