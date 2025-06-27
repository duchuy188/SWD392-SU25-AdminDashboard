import React from 'react';
import { Test } from '../types/Test';
import { Brain } from 'lucide-react';

interface TestDetailModalProps {
  test: Test;
  onClose: () => void;
}

const TestDetailModal: React.FC<TestDetailModalProps> = ({ test, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="glass rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4 animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 glass-dark px-8 py-6 flex justify-between items-center border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{test.name}</h2>
              <p className="text-white/80">{test.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Đóng modal"
            className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 p-2 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-5rem)] space-y-8">
          {/* Questions Section */}
          <div className="glass-dark rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-300">Q</span>
              </span>
              Câu hỏi ({test.questions?.length || 0})
            </h3>
            <div className="space-y-6">
              {test.questions && test.questions.length > 0 ? (
                test.questions.map((question, index) => (
                <div key={index} className="glass p-6 rounded-xl border border-white/10">
                  <p className="text-white font-medium mb-4">
                    {index + 1}. {question.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options && question.options.length > 0 ? (
                      question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="glass-dark p-4 rounded-lg border border-white/10 text-white/80"
                        >
                          {option}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4">
                        <span className="text-white/50 text-sm">Chưa có lựa chọn nào</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-white/60">
                      Trọng số: {question.weight}
                    </span>
                    <span className="text-sm text-white/60">
                      Danh mục: {question.category}
                    </span>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">Chưa có câu hỏi nào cho bài test này</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="glass-dark rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-300">R</span>
              </span>
              Kết quả có thể ({test.results?.length || 0})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {test.results && test.results.length > 0 ? (
                test.results.map((result, index) => (
                <div key={index} className="glass p-6 rounded-xl border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2">{result.type}</h4>
                  <p className="text-white/80 mb-4">{result.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-white/60 mb-2">Ngành học phù hợp:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendedMajors && result.recommendedMajors.length > 0 ? (
                          result.recommendedMajors.map((major, majorIndex) => (
                            <span
                              key={majorIndex}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                            >
                              {major}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/50 text-sm">Chưa có thông tin</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-white/60 mb-2">Ngành học FPT phù hợp:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendedFPTMajors && result.recommendedFPTMajors.length > 0 ? (
                          result.recommendedFPTMajors.map((major, majorIndex) => (
                            <span
                              key={majorIndex}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                            >
                              {major}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/50 text-sm">Chưa có thông tin</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">Chưa có kết quả nào cho bài test này</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailModal; 