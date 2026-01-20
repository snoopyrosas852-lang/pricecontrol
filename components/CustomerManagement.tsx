
import React, { useState, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, X, UploadCloud } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: '1', projectName: '国网一级' },
  { id: '2', projectName: '中核电商' },
  { id: '3', projectName: '昆明地铁' },
  { id: '4', projectName: '中国电建' },
  { id: '5', projectName: '乔司一号通' },
  { id: '6', projectName: '省管电力' },
  { id: '7', projectName: '中国林业' },
  { id: '8', projectName: '乐筑' },
  { id: '9', projectName: '第三监狱' },
  { id: '10', projectName: '中国交建' },
];

const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenImport = (projectName: string) => {
    setSelectedProject(projectName);
    setIsImportModalOpen(true);
    setFileName(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 min-h-full flex flex-col">
      {/* Title */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">客户管理</h2>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Search Bar */}
        <div className="bg-white border border-gray-100 p-4 rounded-sm flex items-center space-x-3">
          <span className="text-sm text-gray-600">项目名称:</span>
          <input
            type="text"
            placeholder="请输入"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm w-64 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          <button className="bg-[#1890ff] hover:bg-blue-600 text-white px-5 py-1 rounded text-sm transition-colors shadow-sm">
            查询
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#fafafa] text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-normal text-gray-800 w-1/4">项目名称</th>
                <th className="px-4 py-3 font-normal text-gray-800">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-gray-600">{customer.projectName}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-6">
                      <button className="text-[#1890ff] hover:underline">规则配置</button>
                      <button className="text-[#1890ff] hover:underline">外链导入</button>
                      <button className="text-[#1890ff] hover:underline">外链折扣导入</button>
                      <button 
                        onClick={() => handleOpenImport(customer.projectName)}
                        className="text-[#1890ff] hover:underline"
                      >
                        临时调拨价导入
                      </button>
                      <button className="text-[#1890ff] hover:underline">钉钉通知配置</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end pt-4 space-x-2 text-sm text-gray-600">
          <button className="p-1 hover:bg-gray-100 rounded disabled:text-gray-300" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-[#1890ff] text-[#1890ff] rounded transition-colors">1</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#1890ff] hover:text-[#1890ff] rounded transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#1890ff] hover:text-[#1890ff] rounded transition-colors">3</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#1890ff] hover:text-[#1890ff] rounded transition-colors">4</button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#1890ff] hover:text-[#1890ff] rounded transition-colors">5</button>
          <span className="px-2">...</span>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#1890ff] hover:text-[#1890ff] rounded transition-colors">19</button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={16} />
          </button>
          <div className="relative inline-flex items-center px-3 py-1.5 border border-gray-200 rounded cursor-pointer hover:border-gray-300 ml-4 group">
            <span className="mr-1">10 条/页</span>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white w-[600px] rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-[16px] font-normal text-gray-800">临时调拨价导入-{selectedProject}</h3>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 space-y-8">
              {/* Upload Box */}
              <div 
                onClick={triggerUpload}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".xlsx,.xls"
                />
                <UploadCloud size={48} className="text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
                <div className="text-base text-gray-600">
                  {fileName ? (
                    <span className="text-blue-600 font-medium">{fileName}</span>
                  ) : (
                    <>
                      文件拖放到此处，或<span className="text-orange-400">点击上传</span>
                    </>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">仅支持Excel2010及以上版本的Excel文件（xlsx/xls格式）</p>
                <p className="text-sm text-gray-500">
                  下载最新导入模板，请点击<span className="text-orange-400 cursor-pointer hover:underline">下载导入模板</span>
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-center space-x-6 pt-4">
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  className="w-32 py-2 bg-[#2f54eb] text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (fileName) {
                      alert('文件保存成功！');
                      setIsImportModalOpen(false);
                    } else {
                      alert('请先选择文件');
                    }
                  }}
                  className="w-32 py-2 bg-[#2f54eb] text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
