import React from 'react';
import { Clock } from 'lucide-react';

export interface ResponseTimesOverviewProps {
  responseTimes: {
    min: number;
    max: number;
    percentiles: Record<string, number>;
  };
}

const ResponseTimesOverview: React.FC<ResponseTimesOverviewProps> = ({ responseTimes }) => {
  return (
    <div className="p-3 mt-4 border rounded-lg bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <div className="flex items-start gap-3">
        <Clock className="flex-shrink-0 w-4 h-4 mt-1 text-blue-400" />
        <div className="grid flex-1 grid-cols-3 gap-2 text-center sm:grid-cols-4 lg:grid-cols-7">
          <div>
            <div className="mb-1 text-xs text-slate-400">Min</div>
            <div className="text-base font-bold text-slate-300">
              {responseTimes.min}<span className="ml-1 text-xs">ms</span>
            </div>
          </div>
          {Object.entries(responseTimes.percentiles)
            .filter(([percentile]) => parseFloat(percentile) !== 100)
            .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
            .map(([percentile, value]) => (
              <div key={percentile}>
                <div className="mb-1 text-xs text-slate-400">P{parseFloat(percentile)}</div>
                <div className="text-base font-bold text-slate-300">
                  {value}<span className="ml-1 text-xs">ms</span>
                </div>
              </div>
            ))}
          <div>
            <div className="mb-1 text-xs text-slate-400">Max</div>
            <div className="text-base font-bold text-slate-300">
              {responseTimes.max}<span className="ml-1 text-xs">ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimesOverview;
