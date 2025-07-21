import React from 'react';
import { Test } from '../types/Test';
import { Brain } from 'lucide-react';

interface TestDetailModalProps {
  test: Test;
  onClose: () => void;
}

const TestDetailModal: React.FC<TestDetailModalProps> = ({ test, onClose }) => {
  return (
    <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4 animate-slideUp border border-blue-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 flex justify-between items-center border-b border-blue-300">
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-5rem)] space-y-8 bg-gradient-to-br from-blue-50 to-white">
          {/* Questions Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </span>
              Câu hỏi ({test.questions?.length || 0})
            </h3>
            <div className="space-y-6">
              {test.questions && test.questions.length > 0 ? (
                test.questions.map((question, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-gray-800 font-medium mb-4">
                    {index + 1}. {question.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options && question.options.length > 0 ? (
                      question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-gray-700 hover:bg-blue-100 transition-colors"
                        >
                          {option}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4">
                        <span className="text-gray-500 text-sm">Chưa có lựa chọn nào</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm text-blue-600">
                      Trọng số: {question.weight}
                    </span>
                    <span className="text-sm text-blue-600">
                      Danh mục: {question.category}
                    </span>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có câu hỏi nào cho bài test này</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </span>
              Kết quả có thể ({test.results?.length || 0})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {test.results && test.results.length > 0 ? (
                test.results.map((result, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-100 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{result.type}</h4>
                  <p className="text-gray-700 mb-4">{result.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-blue-700 mb-2">Ngành học phù hợp:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendedMajors && result.recommendedMajors.length > 0 ? (
                          result.recommendedMajors.map((major, majorIndex) => (
                            <span
                              key={majorIndex}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-200"
                            >
                              {major}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Chưa có thông tin</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-blue-700 mb-2">Ngành học FPT phù hợp:</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendedFPTMajors && result.recommendedFPTMajors.length > 0 ? (
                          result.recommendedFPTMajors.map((major, majorIndex) => (
                            <span
                              key={majorIndex}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200"
                            >
                              {major}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">Chưa có thông tin</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có kết quả nào cho bài test này</p>
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