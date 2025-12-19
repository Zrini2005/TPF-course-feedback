import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_COURSES, MOCK_REVIEWS } from './constants';
import { FilterState, Course, Review } from './types';
import FilterBar from './components/FilterBar';
import CourseCard from './components/CourseCard';
import CourseDetail from './components/CourseDetail';
import LandingPage from './components/LandingPage';
import VotingPage from './components/VotingPage';
import { fetchLiveReviews } from './services/dataLoader';

const FORM_URL = "https://forms.gle/zd6nTbFLMtp8dofd7";

const App: React.FC = () => {
  // Check if accessing the secret voting page
  if (window.location.pathname === '/vote-secret-2k9x') {
    return <VotingPage />;
  }

  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState("rating_desc");
  const [view, setView] = useState<'landing' | 'app'>('landing');

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: ""
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveReviews();
      if (data.courses.length > 0) {
        setCourses(data.courses);
        setReviews(data.reviews);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to refresh data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = () => {
    window.open(FORM_URL, '_blank');
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      department: ""
    });
    setSortBy("rating_desc");
  };

  const handleExplore = () => {
    setView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get dynamic unique values for filters from the actual data returned by the loader
  const uniqueDepts = useMemo(() => {
    const depts = courses
      .map(c => c.department)
      .filter(d => d && d !== "General");
    return Array.from(new Set(depts)).sort();
  }, [courses]);

  const processedCourses = useMemo(() => {
    // 1. Filtering
    let filtered = courses.filter(course => {
      const matchesSearch = 
        course.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesDept = filters.department === "" || course.department === filters.department;

      return matchesSearch && matchesDept;
    });

    // 2. Sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating_desc":
          return b.averageRating - a.averageRating;
        case "difficulty_asc":
          return a.difficulty - b.difficulty;
        case "difficulty_desc":
          return b.difficulty - a.difficulty;
        case "dept_asc":
          return a.department.localeCompare(b.department);
        case "name_asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filters, courses, sortBy]);

  const activeReviews = useMemo(() => {
    if (!selectedCourse) return [];
    return reviews.filter(r => r.courseId === selectedCourse.id);
  }, [selectedCourse, reviews]);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={handleLogoClick}>
              <div className="bg-indigo-600 h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                Course<span className="text-indigo-600">Pilot</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              {view === 'app' && (
                <div className="hidden md:flex items-center space-x-6 mr-6 border-r border-slate-100 pr-6">
                  <div className="flex items-center space-x-2">
                    {isLoading ? (
                      <i className="fa-solid fa-sync fa-spin text-indigo-500"></i>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {lastUpdated ? `Sync: ${lastUpdated.toLocaleTimeString()}` : 'Live Database'}
                    </span>
                  </div>
                  <button 
                    onClick={loadData}
                    className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              )}
              
              <button 
                onClick={handleSubmitReview}
                className="hidden sm:flex bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all items-center space-x-2"
              >
                <span>Post Review</span>
                <i className="fa-solid fa-plus text-[10px] opacity-60"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {view === 'landing' ? (
        <LandingPage onExplore={handleExplore} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-20">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Student Feedback Hub</h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Aggregated, real-time insights from across the NIT Trichy student community. Choose your academic path with confidence.
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-3 text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-2xl border border-indigo-100 animate-pulse">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span className="text-sm font-bold">Syncing Records...</span>
              </div>
            )}
          </div>

          <FilterBar 
            filters={filters} 
            onChange={setFilters} 
            availableDepartments={uniqueDepts}
          />

          <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              Available Courses
              <span className="ml-2 text-sm font-medium text-slate-400">({processedCourses.length})</span>
            </h2>
            <div className="flex items-center space-x-3 text-sm text-slate-500 font-medium bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
              <i className="fa-solid fa-sort text-indigo-400"></i>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-slate-900 font-bold cursor-pointer"
              >
                <option value="rating_desc">Highest Easiness</option>
                <option value="difficulty_asc">Lowest Difficulty</option>
                <option value="difficulty_desc">Highest Difficulty</option>
                <option value="dept_asc">By Department</option>
                <option value="name_asc">A - Z</option>
              </select>
            </div>
          </div>

          {processedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {processedCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onClick={setSelectedCourse}
                />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-search text-slate-300 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">No courses found</h3>
              <p className="text-slate-400 mt-3 max-w-sm mx-auto text-lg">Try adjusting your filters or search terms to find what you're looking for.</p>
              <button 
                onClick={resetFilters}
                className="mt-10 bg-indigo-50 text-indigo-600 px-10 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      )}

      {selectedCourse && (
        <CourseDetail 
          course={selectedCourse} 
          reviews={activeReviews} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}

      <button 
        onClick={handleSubmitReview}
        className="fixed bottom-8 right-8 h-16 w-16 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-40"
      >
        <i className="fa-solid fa-pen-nib text-2xl"></i>
        <span className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Share Your Experience
        </span>
      </button>
    </div>
  );
};

export default App;