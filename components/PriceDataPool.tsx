
import React, { useState } from 'react';
import { Search, ChevronDown, Download, ExternalLink, X } from 'lucide-react';

interface PriceData {
  id: string;
  code: string;
  brand: string;
  name: string;
  model: string;
  description: string;
}

interface PriceDetail {
  type: string;
  price: string;
  platform: string;
  shop: string;
  link: string;
  modifiedAt: string;
  createdAt: string;
}

const MOCK_DATA: PriceData[] = [
  { id: '1', code: 'A3206000071', brand: '贝特设备/BE-TE', name: '热像1', model: 'H121', description: '1支/盒22111111111' },
  { id: '2', code: 'B0301005395', brand: '品牌测试1234/PINPAI1212', name: 'wymasa00001', model: '21421dsa', description: '' },
  { id: '3', code: 'B0301005397', brand: '品牌测试1234/PINPAI1212', name: 'wymag00005', model: '21421dsa', description: '' },
  { id: '4', code: 'B0301005376', brand: '品牌测试1234/PINPAI1212', name: 'wymzjn00008', model: '21421dsa', description: '' },
  { id: '5', code: 'B1201000016', brand: '品牌测试1234/PINPAI1212', name: '圆迈导入提报729a', model: '无', description: '【不含检测费】【不含安装费】' },
  { id: '6', code: 'B0301005296', brand: '00011/00011', name: '对接测试新增887', model: 'kdl544', description: '这是描述11123213' },
  { id: '7', code: 'B0301005297', brand: '00011/00011', name: '提报测试0730', model: 'kdl544', description: '这是描述11123213' },
  { id: '8', code: 'B0301005298', brand: '00011/00011', name: '对接测试新增4533', model: '21421dsa', description: '【不含检测费】这是描述11123213' },
  { id: '9', code: 'B0301005299', brand: '00011/00011', name: '提报测试07305', model: 'kdl544', description: '这是描述11123213' },
  { id: '10', code: 'B1502000020', brand: '02440/11001', name: '提报731A', model: '88', description: '' },
];

const DETAIL_DATA: PriceDetail[] = [
  {
    type: '咸亨官网价',
    price: '29.99',
    platform: '',
    shop: '',
    link: 'https://www.xhgjmall.com/Product/A3206000071',
    modifiedAt: '2025-08-25 11:26:06',
    createdAt: '2024-03-04 14:34:02'
  }
];

const PriceDataPool: React.FC = () => {
  const [project, setProject] = useState('中粮E采2.0');
  const [productCodes, setProductCodes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PriceData | null>(null);

  const handleSearch = () => {
    console.log('Searching for:', { project, productCodes });
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const openDetails = (product: PriceData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 min-h-full flex flex-col p-6 space-y-4 relative">
      {/* Title */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-base font-bold text-[#333] tracking-tight">价格数据池</h2>
        
        {/* Batch Export Button */}
        <div>
          <button 
            onClick={handleExport}
            className="bg-[#1890ff] hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors flex items-center space-x-1"
          >
            <span>批量导出</span>
          </button>
        </div>
      </div>

      {/* Search Panel */}
      <div className="bg-white border border-[#f0f0f0] p-4 rounded flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-800">所属项目:</span>
          <div className="relative">
            <select 
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="appearance-none border border-gray-300 rounded px-3 py-1.5 text-sm w-48 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
            >
              <option>中粮E采2.0</option>
              <option>国网一级</option>
              <option>中国大唐</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1 min-w-[300px]">
          <span className="text-sm text-gray-800">商品编码:</span>
          <input
            type="text"
            placeholder="请输入:多个编码英文逗号..."
            value={productCodes}
            onChange={(e) => setProductCodes(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 placeholder:text-gray-300"
          />
        </div>

        <button 
          onClick={handleSearch}
          className="bg-[#1890ff] hover:bg-blue-600 text-white px-5 py-1.5 rounded text-sm transition-colors shadow-sm"
        >
          查询
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-[#f0f0f0] rounded">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#fafafa] text-[#262626] font-medium border-b border-[#f0f0f0]">
            <tr>
              <th className="px-4 py-3 font-normal">操作</th>
              <th className="px-4 py-3 font-normal">商品编码</th>
              <th className="px-4 py-3 font-normal">品牌</th>
              <th className="px-4 py-3 font-normal">名称</th>
              <th className="px-4 py-3 font-normal">型号</th>
              <th className="px-4 py-3 font-normal">描述</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {MOCK_DATA.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4">
                  <button 
                    onClick={() => openDetails(row)}
                    className="text-[#1890ff] hover:text-blue-700 transition-colors whitespace-nowrap"
                  >
                    查看详情
                  </button>
                </td>
                <td className="px-4 py-4 text-gray-600 font-mono text-[13px]">{row.code}</td>
                <td className="px-4 py-4 text-gray-600">{row.brand}</td>
                <td className="px-4 py-4 text-gray-600">{row.name}</td>
                <td className="px-4 py-4 text-gray-600">{row.model}</td>
                <td className="px-4 py-4 text-gray-600 max-w-xs truncate" title={row.description}>
                  {row.description || ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Hint */}
      <div className="text-[12px] text-gray-400 pt-2 italic">
        * 以上数据仅供展示参考，实际数据请以业务系统实时查询结果为准。
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="text-[15px] font-bold text-gray-800 flex items-center">
                <span>{selectedProduct.code}</span>
                <span className="mx-2">:</span>
                <span className="text-gray-600 font-normal">
                  {selectedProduct.brand}-{selectedProduct.name}-{selectedProduct.model}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="overflow-hidden border border-gray-100 rounded">
                <table className="w-full text-[13px] text-left border-collapse">
                  <thead className="bg-[#fafafa] text-gray-700 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-4 font-normal w-[120px]">价格类型</th>
                      <th className="px-4 py-4 font-normal w-[100px]">链接价格</th>
                      <th className="px-4 py-4 font-normal w-[100px]">平台类型</th>
                      <th className="px-4 py-4 font-normal w-[100px]">店铺类型</th>
                      <th className="px-4 py-4 font-normal">链接</th>
                      <th className="px-4 py-4 font-normal w-[180px]">修改时间</th>
                      <th className="px-4 py-4 font-normal w-[180px]">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DETAIL_DATA.map((detail, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="px-4 py-5 align-top text-gray-800 leading-relaxed whitespace-pre-line">
                          {detail.type}
                        </td>
                        <td className="px-4 py-5 align-top text-gray-600">
                          {detail.price}
                        </td>
                        <td className="px-4 py-5 align-top text-gray-600">
                          {detail.platform}
                        </td>
                        <td className="px-4 py-5 align-top text-gray-600">
                          {detail.shop}
                        </td>
                        <td className="px-4 py-5 align-top">
                          <a 
                            href={detail.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-500 break-all transition-colors underline decoration-gray-300 hover:decoration-blue-500"
                          >
                            {detail.link}
                          </a>
                        </td>
                        <td className="px-4 py-5 align-top text-gray-600 leading-tight">
                          <div className="font-mono text-[12px]">{detail.modifiedAt.split(' ')[0]}</div>
                          <div className="font-mono text-[12px] mt-1">{detail.modifiedAt.split(' ')[1]}</div>
                        </td>
                        <td className="px-4 py-5 align-top text-gray-600 leading-tight">
                          <div className="font-mono text-[12px]">{detail.createdAt.split(' ')[0]}</div>
                          <div className="font-mono text-[12px] mt-1">{detail.createdAt.split(' ')[1]}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDataPool;
