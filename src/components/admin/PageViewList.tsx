import React from 'react';
import { PageView } from '../AdminPage'; // Assuming PageView interface is exported or moved later

interface PageViewListProps {
  pageViews: PageView[];
}

const PageViewList: React.FC<PageViewListProps> = ({ pageViews }) => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
      <h3 className="text-lg font-light mb-4 tracking-tight">Recent Page Views</h3>
      <div className="space-y-4">
        {pageViews.slice(0, 10).map((view) => (
          <div key={view.id} className="flex flex-col gap-2 p-4 bg-black/20 rounded">
            <div className="flex justify-between items-center">
              <span className="text-[#0CF2A0]">{view.page}</span>
              <span className="text-sm text-gray-500">
                {new Date(view.timestamp).toLocaleString()}
              </span>
            </div>
            {view.referrer && (
              <div className="text-sm text-gray-400">
                Referrer: {view.referrer}
              </div>
            )}
            {view.user_agent && (
              <div className="text-sm text-gray-400">
                Browser: {view.user_agent}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageViewList; 