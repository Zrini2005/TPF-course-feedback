import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-600';
    if (rating >= 3.5) return 'text-amber-600';
    return 'text-rose-600';
  };

  const hasValidDept = course.department && course.department !== "General";

  return (
    <div 
      onClick={() => onClick(course)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mt-2 group-hover:text-indigo-700 transition-colors">
            {course.name}
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-xl font-bold ${getRatingColor(course.averageRating)}`}>
            {course.averageRating.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 5</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Avg. Rating</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-slate-600">
          <i className="fa-solid fa-user-tie w-5 text-indigo-400"></i>
          <span>{course.instructor || "Various"}</span>
        </div>
        
        {hasValidDept && (
          <div className="flex items-center text-sm text-slate-600">
            <i className="fa-solid fa-building w-5 text-indigo-400"></i>
            <span>{course.department}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Difficulty:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div 
                key={star} 
                className={`h-1.5 w-4 rounded-full ${star <= Math.round(course.difficulty) ? 'bg-indigo-500' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
