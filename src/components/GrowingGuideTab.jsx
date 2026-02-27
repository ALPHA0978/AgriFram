import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Droplets, Sprout, Zap } from 'lucide-react';

const GrowingGuideTab = ({ recommendations, loading }) => {
  if (loading || !recommendations) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Generating personalized growing recommendations...</p>
      </div>
    );
  }

  return (
    <motion.div
      key="guide"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Soil Health Status */}
      <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-4">Soil Health Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{recommendations.soilHealth?.score || 75}%</div>
            <div className="text-sm text-gray-300">{recommendations.soilHealth?.status || 'Good'}</div>
          </div>
          <div className="col-span-2 space-y-2">
            {recommendations.soilHealth?.strengths?.length > 0 && (
              <div>
                <p className="text-xs text-emerald-400 font-medium mb-1">Strengths:</p>
                <div className="flex flex-wrap gap-1">
                  {recommendations.soilHealth.strengths.map((strength, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded">{strength}</span>
                  ))}
                </div>
              </div>
            )}
            {recommendations.soilHealth?.issues?.length > 0 && (
              <div>
                <p className="text-xs text-red-400 font-medium mb-1">Issues:</p>
                <div className="flex flex-wrap gap-1">
                  {recommendations.soilHealth.issues.map((issue, i) => (
                    <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 text-xs rounded">{issue}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NPK Status */}
      <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          NPK Nutrient Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
            const data = recommendations.npkStatus?.[nutrient];
            const statusColor = data?.status === 'Sufficient' ? 'emerald' : data?.status === 'Deficient' ? 'red' : 'yellow';
            return (
              <div key={nutrient} className={`p-4 bg-${statusColor}-500/10 border border-${statusColor}-500/20 rounded-xl`}>
                <h4 className="text-sm font-bold text-white capitalize mb-2">{nutrient}</h4>
                <div className="space-y-1 text-xs">
                  <p className="text-gray-300">Current: <span className="font-medium text-white">{data?.current || 'N/A'}</span></p>
                  <p className="text-gray-300">Required: <span className="font-medium text-white">{data?.required || 'N/A'}</span></p>
                  <p className={`text-${statusColor}-400 font-medium`}>{data?.status || 'Unknown'}</p>
                  <p className="text-gray-400 mt-2">{data?.action || 'Monitor regularly'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Actions */}
      {recommendations.immediateActions?.length > 0 && (
        <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Immediate Actions Required
          </h3>
          <div className="space-y-3">
            {recommendations.immediateActions.map((action, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                action.priority === 'High' ? 'bg-red-500/10 border-red-500/30' :
                action.priority === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    action.priority === 'High' ? 'bg-red-500 text-white' :
                    action.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                    'bg-blue-500 text-white'
                  }`}>{action.priority}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{action.action}</p>
                    <p className="text-sm text-gray-400">{action.reason}</p>
                    <p className="text-xs text-emerald-400 mt-1">Timeline: {action.timeline}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fertilizer Recommendations */}
      {recommendations.fertilizers?.length > 0 && (
        <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Fertilizer Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.fertilizers.map((fert, i) => (
              <div key={i} className="p-4 bg-gray-800/50 rounded-xl border border-emerald-500/20">
                <h4 className="text-lg font-bold text-emerald-400 mb-2">{fert.name}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">Dosage: <span className="text-white font-medium">{fert.dosage}</span></p>
                  <p className="text-gray-300">Timing: <span className="text-white font-medium">{fert.timing}</span></p>
                  <p className="text-gray-400 text-xs mt-2">{fert.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Irrigation Plan */}
      {recommendations.irrigationPlan && (
        <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            Irrigation Plan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">Frequency</p>
              <p className="text-sm font-bold text-white">{recommendations.irrigationPlan.frequency}</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">Amount</p>
              <p className="text-sm font-bold text-white">{recommendations.irrigationPlan.amount}</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">Method</p>
              <p className="text-sm font-bold text-white">{recommendations.irrigationPlan.method}</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300 mb-1">Schedule</p>
              <p className="text-sm font-bold text-white">{recommendations.irrigationPlan.schedule}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pest Management */}
      {recommendations.pestManagement && (
        <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Pest Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-bold text-red-400 mb-2">Common Pests</h4>
              <ul className="space-y-1">
                {recommendations.pestManagement.commonPests?.map((pest, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                    {pest}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-yellow-400 mb-2">Prevention</h4>
              <ul className="space-y-1">
                {recommendations.pestManagement.prevention?.map((prev, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-yellow-400" />
                    {prev}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400 mb-2">Organic Solutions</h4>
              <ul className="space-y-1">
                {recommendations.pestManagement.organicSolutions?.map((sol, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <Sprout className="w-3 h-3 text-emerald-400" />
                    {sol}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Harvest Guidelines */}
      {recommendations.harvestGuidelines && (
        <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Harvest Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-xs text-emerald-300 mb-2">Expected Date</p>
              <p className="text-lg font-bold text-white">{recommendations.harvestGuidelines.expectedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Readiness Indicators</p>
              <ul className="space-y-1">
                {recommendations.harvestGuidelines.indicators?.map((ind, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {ind}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Best Practices</p>
              <ul className="space-y-1">
                {recommendations.harvestGuidelines.bestPractices?.map((practice, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {practice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors & Success Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.riskFactors?.length > 0 && (
          <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-red-400 mb-4">Risk Factors</h3>
            <ul className="space-y-2">
              {recommendations.riskFactors.map((risk, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
        {recommendations.successTips?.length > 0 && (
          <div className="bg-[#0b1219] p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-emerald-400 mb-4">Success Tips</h3>
            <ul className="space-y-2">
              {recommendations.successTips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GrowingGuideTab;
