import React, { useState, useEffect } from 'react';
import { Course, Review } from '../types';
import { getCourseSummary, askAboutCourse } from '../services/geminiService';

interface CourseDetailProps {
  course: Course;
  reviews: Review[];
  onClose: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, reviews, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  // Helper to strip markdown symbols if the AI still sends them
  const cleanText = (text: string | null) => {
    if (!text) return null;
    return text.replace(/[*#]/g, '');
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const result = await getCourseSummary(course, reviews);
      setSummary(result);
      setLoadingSummary(false);
    };
    fetchSummary();
  }, [course, reviews]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoadingAnswer(true);
    const result = await askAboutCourse(question, course, reviews);
    setAiAnswer(result);
    setLoadingAnswer(false);
  };

  const hasValidDept = course.department && course.department !== "General";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full z-10"
        >
          <i className="fa-solid fa-times text-xl"></i>
        </button>

        <div className="p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{course.name}</h1>
            <div className="flex flex-wrap gap-2">
              {hasValidDept && (
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {course.department}
                </span>
              )}
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {reviews.length} Responses
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-80">Easiness Score</h4>
                  <i className="fa-solid fa-check-to-slot text-amber-300"></i>
                </div>
                <div className="text-4xl font-black mb-1">{course.averageRating.toFixed(1)} <span className="text-lg font-normal opacity-60">/ 5</span></div>
                <p className="text-xs opacity-80 leading-tight">Calculated from student responses</p>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">AI Smart Summary</h4>
                {loadingSummary ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-2 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-800 rounded w-full"></div>
                    <div className="h-2 bg-slate-800 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                    {cleanText(summary)}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Full Student Responses</h3>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-500">YEAR: {review.yearOfStudy || 'N/A'}</span>
                        {review.section && <span className="text-xs font-bold text-slate-500">SECTION: {review.section}</span>}
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${review.rating >= 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        EASINESS: {review.rating}/5
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">Method of teaching</p>
                          <p className="text-sm text-slate-700">{review.teachingMethod || 'Not mentioned'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">Exam structure</p>
                          <p className="text-sm text-slate-700">{review.examStructure || 'Not mentioned'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">Leniency of course</p>
                          <p className="text-sm text-slate-700">{review.leniency || 'Not mentioned'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">Extra Classes?</p>
                          <p className="text-sm text-slate-700">{review.extraClasses || 'Not mentioned'}</p>
                        </div>
                      </div>

                      {review.gradingComments && (
                        <div className="mb-4 p-4 bg-slate-50 rounded-lg border-l-4 border-indigo-400">
                          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Grading & Paper Pattern Details</p>
                          <p className="text-sm text-slate-700 leading-relaxed italic">"{review.gradingComments}"</p>
                        </div>
                      )}

                      {review.comment && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">General Feedback</p>
                          <p className="text-sm text-slate-800 leading-relaxed">"{review.comment}"</p>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-right">
                        Recorded on: {review.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
