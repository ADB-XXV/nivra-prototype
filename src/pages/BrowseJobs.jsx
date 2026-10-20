import React, { useState } from 'react';
import { 
  Search, MapPin, ChevronDown, Bookmark, Eye, ArrowLeft, 
  CheckCircle, Briefcase, User, FileText, LayoutDashboard, 
  LogOut, BookmarkCheck 
} from 'lucide-react';

export default function NivraApp() {
  const [currentSlide, setCurrentSlide] = useState(3); // 3 for Browse Jobs, 4 for Job Details

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3D2C2E] font-sans antialiased">
      {/* Top Prototype Metadata Bar */}
      <div className="bg-[#3D2C2E] text-[#D4C5C0] text-xs px-4 py-1 flex justify-between items-center">
        <span>Nivra · {currentSlide === 3 ? '03 / 16 · Browse jobs' : '04 / 16 · Job details and apply'}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentSlide(3)}
            className={`px-2 py-0.5 rounded ${currentSlide === 3 ? 'bg-[#5C4548] text-white font-medium' : 'hover:bg-[#4D3A3C]'}`}
          >
            Slide 3 (Browse)
          </button>
          <button 
            onClick={() => setCurrentSlide(4)}
            className={`px-2 py-0.5 rounded ${currentSlide === 4 ? 'bg-[#5C4548] text-white font-medium' : 'hover:bg-[#4D3A3C]'}`}
          >
            Slide 4 (Details)
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white border-b border-[#EFECE6] px-8 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-10">
          <div className="flex items-center text-xl font-bold tracking-tight text-[#3D2C2E]">
            Nivra<span className="text-[#E07A5F] text-2xl leading-none">.</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B5B5D]">
            <button 
              onClick={() => setCurrentSlide(3)}
              className={`pb-1 transition-colors ${currentSlide === 3 ? 'text-[#3D2C2E] border-b-2 border-[#3D2C2E] font-semibold' : 'hover:text-[#3D2C2E]'}`}
            >
              Browse jobs
            </button>
            <a href="#saved" className="hover:text-[#3D2C2E]">Saved</a>
            <a href="#applications" className="hover:text-[#3D2C2E]">My applications</a>
            <a href="#dashboard" className="hover:text-[#3D2C2E]">Dashboard</a>
            <a href="#profile" className="hover:text-[#3D2C2E]">Profile</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-[#E2ECE9] text-[#2D5A4C] text-xs font-semibold px-3 py-1 rounded-full">
            Student
          </span>
          <button className="text-sm font-medium text-[#6B5B5D] hover:text-[#3D2C2E]">
            Log out
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentSlide === 3 ? <BrowseJobsView onViewDetails={() => setCurrentSlide(4)} /> : <JobDetailsView onBack={() => setCurrentSlide(3)} />}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-[#8C7A7C] border-t border-[#EFECE6] mt-12">
        <span className="font-medium">Nivra</span> · Find work for a day. Build experience for tomorrow. Prototype with sample data; employers, jobs and students are fictional.
      </footer>
    </div>
  );
}

/* ==========================================================
   SLIDE 3: BROWSE JOBS VIEW
   ================================================---------- */
function BrowseJobsView({ onViewDetails }) {
  const jobs = [
    { title: "Event Assistant", company: "Malabar Events", location: "Kozhikode", pay: "₹800/day", date: "Sat, 24 Oct · 9:00 am – 5:00 pm · One day", saved: true },
    { title: "Catering Helper", company: "Spice Route Caterers", location: "Kochi", pay: "₹700/day", date: "Sun, 25 Oct · 11:00 am – 4:00 pm · One day", saved: false },
    { title: "Retail Promoter", company: "Urban Cart Stores", location: "Thrissur", pay: "₹900/day", date: "Fri, 23 – Sun, 25 Oct · 10:00 am – 6:00 pm · Short term", saved: true, isRetail: true },
    { title: "Campus Event Crew", company: "Aarambh Fest Team", location: "Kozhikode", pay: "₹600/day", date: "Mon, 26 Oct · 8:00 am – 6:00 pm · One day", saved: false },
    { title: "Maths Tutor, Class 10", company: "BrightPath Tuitions", location: "Malappuram", pay: "₹500/day", date: "Wed, 28 Oct · 5:00 pm – 7:00 pm · One day", saved: false },
    { title: "Delivery Partner", company: "QuickBasket", location: "Bengaluru", pay: "₹850/day", date: "Sat, 31 Oct · 10:00 am – 6:00 pm · One day", saved: true },
    { title: "Banquet Server", company: "Hotel Lakeview", location: "Kochi", pay: "₹650/day", date: "Sat, 31 Oct · 6:00 pm – 11:00 pm · Short term", saved: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3D2C2E] mb-6">Browse jobs</h1>

      {/* Search Filter Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#EBE6DD] shadow-xs flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[240px] relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Job title or keyword" 
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm focus:outline-none focus:border-[#3D2C2E]"
          />
        </div>
        <div className="flex-1 min-w-[200px] relative flex items-center">
          <MapPin className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Location" 
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm focus:outline-none focus:border-[#3D2C2E]"
          />
        </div>
        <div className="w-48 relative flex items-center">
          <select className="w-full px-3 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm focus:outline-none focus:border-[#3D2C2E] appearance-none">
            <option>Sort: Soonest</option>
            <option>Sort: Highest Pay</option>
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-[#EBE6DD] shadow-xs h-fit space-y-5">
          <h2 className="font-semibold text-base text-[#3D2C2E]">Filters</h2>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B5D] mb-1.5">Category</label>
            <div className="relative">
              <select className="w-full px-3 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm appearance-none focus:outline-none">
                <option>All</option>
                <option>Retail</option>
                <option>Events</option>
                <option>Tutoring</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B5D] mb-1.5">Date</label>
            <div className="relative">
              <select className="w-full px-3 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm appearance-none focus:outline-none">
                <option>Any date</option>
                <option>Today</option>
                <option>This weekend</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B5D] mb-1.5">Minimum pay</label>
            <div className="relative">
              <select className="w-full px-3 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm appearance-none focus:outline-none">
                <option>Any</option>
                <option>₹500/day</option>
                <option>₹700/day</option>
                <option>₹900/day</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B5D] mb-1.5">Job type</label>
            <div className="relative">
              <select className="w-full px-3 py-2 bg-white border border-[#DDD5CC] rounded-lg text-sm appearance-none focus:outline-none">
                <option>All</option>
                <option>One day</option>
                <option>Short term</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Job Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-sm font-semibold text-[#3D2C2E] px-1">
            <span>7 jobs</span>
          </div>

          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-5 rounded-xl border border-[#EBE6DD] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#D0C5BC] transition-all">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#3D2C2E]">{job.title}</h3>
                <p className="text-sm text-[#6B5B5D]">
                  <span className="font-medium text-[#4D3D3F]">{job.company}</span> · {job.location}
                </p>
                <p className="text-xs text-[#8C7A7C] pt-1">{job.date}</p>
              </div>

              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-3">
                <div className="text-right">
                  <span className="text-lg font-bold text-[#3D2C2E]">{job.pay.split('/')[0]}</span>
                  <span className="text-xs text-[#6B5B5D]">/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-[#DDD5CC] hover:bg-gray-50 text-xs font-medium rounded-lg flex items-center gap-1.5 text-[#5C4D4F]">
                    {job.saved ? <BookmarkCheck className="w-3.5 h-3.5 fill-current text-gray-700" /> : <Bookmark className="w-3.5 h-3.5" />}
                    {job.saved ? 'Saved' : 'Save'}
                  </button>
                  <button 
                    onClick={job.isRetail ? onViewDetails : undefined}
                    className="px-4 py-1.5 bg-[#4D3D3F] hover:bg-[#3D2C2E] text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   SLIDE 4: JOB DETAILS & APPLY VIEW
   ================================================---------- */
function JobDetailsView({ onBack }) {
  return (
    <div>
      {/* Back button & Header Info */}
      <button 
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-[#6B5B5D] hover:text-[#3D2C2E] mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to jobs
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#3D2C2E] tracking-tight">Retail Promoter</h1>
        <p className="text-sm text-[#6B5B5D] mt-1">
          Urban Cart Stores <span className="mx-1">·</span> Thrissur <span className="mx-1">·</span> Retail
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Details */}
        <div className="lg:col-span-2 bg-white p-7 rounded-xl border border-[#EBE6DD] shadow-xs space-y-6">
          <div>
            <h2 className="font-bold text-base text-[#3D2C2E] mb-2">About the job</h2>
            <p className="text-sm text-[#5C4D4F] leading-relaxed">
              Help the team run the day smoothly. You will be briefed on arrival and work alongside an on-site supervisor.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base text-[#3D2C2E] mb-2">Responsibilities</h2>
            <ul className="list-disc list-inside text-sm text-[#5C4D4F] space-y-1.5">
              <li>Welcome and guide people on site</li>
              <li>Help with setup and pack-down</li>
              <li>Follow the supervisor's instructions</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-base text-[#3D2C2E] mb-2">Skills</h2>
            <p className="text-sm text-[#5C4D4F] leading-relaxed">
              Clear communication, punctuality, comfort standing for long hours. Malayalam and English preferred.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base text-[#3D2C2E] mb-2">Eligibility</h2>
            <p className="text-sm text-[#5C4D4F] leading-relaxed">
              18 or older. College ID required. No experience needed.
            </p>
          </div>
        </div>

        {/* Right Section: Action Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pay & Status Card */}
          <div className="bg-white p-6 rounded-xl border border-[#EBE6DD] shadow-xs space-y-4">
            <div>
              <span className="text-2xl font-black text-[#3D2C2E]">₹900</span>
              <span className="text-sm text-[#6B5B5D]">/day</span>
            </div>
            <div className="text-xs text-[#6B5B5D] space-y-1">
              <p className="font-medium text-[#3D2C2E]">Fri, 23 – Sun, 25 Oct</p>
              <p>10:00 am – 6:00 pm</p>
              <p className="pt-1 font-medium text-[#5C4D4F]">5 workers needed</p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <span className="bg-[#EAE4DC] text-[#4D3D3F] text-xs font-bold px-3 py-1.5 rounded-md">
                Applied
              </span>
              <button className="px-3 py-1.5 border border-[#DDD5CC] hover:bg-gray-50 text-xs font-medium rounded-lg flex items-center gap-1.5 text-[#5C4D4F]">
                <BookmarkCheck className="w-3.5 h-3.5 fill-current text-gray-700" /> Saved
              </button>
            </div>
          </div>

          {/* Employer Box */}
          <div className="bg-white p-6 rounded-xl border border-[#EBE6DD] shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-[#3D2C2E]">Urban Cart Stores</h3>
            <p className="text-xs text-[#6B5B5D] leading-relaxed">
              Local business in Thrissur. Sample employer, not verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}