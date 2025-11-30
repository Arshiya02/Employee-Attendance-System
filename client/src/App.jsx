import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Calendar, Users, LogOut, CheckCircle, 
  XCircle, Clock, FileText, UserCircle, Briefcase, Check, X, Building2, Timer, Download, Search, BarChart3 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api'; // CHANGE TO YOUR RENDER/RAILWAY LINK FOR PRODUCTION

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('attendify_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('attendify_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('attendify_user');
    setUser(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-xl z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-indigo-600 p-2 rounded-lg text-white"><CheckCircle size={24} /></div>
          <span className="text-xl font-bold tracking-tight">Attendify</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          {user.role === 'employee' ? (
            <>
              <NavItem icon={Calendar} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
              <NavItem icon={Briefcase} label="Leaves" active={activeTab === 'leaves'} onClick={() => setActiveTab('leaves')} />
              <NavItem icon={UserCircle} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </>
          ) : (
            <>
              <NavItem icon={Users} label="All Attendance" active={activeTab === 'all-attendance'} onClick={() => setActiveTab('all-attendance')} />
              <NavItem icon={FileText} label="Manage Leaves" active={activeTab === 'leaves'} onClick={() => setActiveTab('leaves')} />
            </>
          )}
        </nav>
        <div className="p-4 border-t"><button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"><LogOut size={18}/> Sign Out</button></div>
      </aside>

      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <header className="mb-8 flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div><h1 className="text-2xl font-bold capitalize text-gray-800">{activeTab.replace('-', ' ')}</h1><p className="text-gray-500 text-sm">Overview & Stats</p></div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block"><p className="font-bold text-gray-800">{user.name}</p><span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full capitalize">{user.department} • {user.role}</span></div>
             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">{user.name.charAt(0)}</div>
          </div>
        </header>

        {activeTab === 'dashboard' && (user.role === 'employee' ? <EmployeeDashboard user={user} /> : <ManagerDashboard />)}
        {activeTab === 'leaves' && <LeaveSection user={user} />}
        {activeTab === 'history' && <HistoryPage user={user} />}
        {activeTab === 'all-attendance' && <ManagerAllRecords />} 
        {activeTab === 'profile' && <ProfilePage user={user} />}
      </main>
    </div>
  );
};

// --- AUTH COMPONENT ---
const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department: 'IT' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, form);
      onLogin(res.data);
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2301')" }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><CheckCircle className="text-white w-10 h-10"/></div>
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        </div>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center"><XCircle className="w-4 h-4 mr-2"/>{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          {!isLogin && <><input className="input-field" placeholder="Full Name" onChange={e=>setForm({...form, name: e.target.value})} required/><select className="input-field" onChange={e=>setForm({...form, department: e.target.value})}><option value="IT">IT</option><option value="HR">HR</option><option value="Sales">Sales</option></select></>}
          <input className="input-field" type="email" placeholder="Email" onChange={e=>setForm({...form, email: e.target.value})} required/>
          <input className="input-field" type="password" placeholder="Password" onChange={e=>setForm({...form, password: e.target.value})} required/>
          {!isLogin && <select className="input-field" onChange={e=>setForm({...form, role: e.target.value})}><option value="employee">Employee</option><option value="manager">Manager</option></select>}
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg">{isLogin ? 'Sign In' : 'Register'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600"><button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline">{isLogin ? 'Create Account' : 'Back to Login'}</button></p>
      </div>
    </div>
  );
};

// --- EMPLOYEE DASHBOARD (UPDATED: Weekly & Monthly Stats) ---
const EmployeeDashboard = ({ user }) => {
  const [today, setToday] = useState(null);
  const [view, setView] = useState('month'); // 'week' or 'month'
  const [stats, setStats] = useState({ 
    month: { present: 0, absent: 0, late: 0 }, 
    week: { present: 0, absent: 0, late: 0 } 
  });

  useEffect(() => {
    axios.get(`${API_URL}/attendance/${user._id}`).then(r => {
      // 1. Find Today's Record
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localDate = new Date(now - offset).toISOString().split('T')[0];
      setToday(r.data.find(d => d.date === localDate));

      // 2. Calculate Stats
      const monthStats = { present: 0, absent: 0, late: 0 };
      const weekStats = { present: 0, absent: 0, late: 0 };

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Get Start of Week (Monday)
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      const startOfWeek = new Date(now.setDate(diff));
      startOfWeek.setHours(0,0,0,0);

      r.data.forEach(d => {
        const recordDate = new Date(d.date);
        
        // Monthly Check
        if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
          monthStats[d.status] = (monthStats[d.status] || 0) + 1;
        }

        // Weekly Check
        if (recordDate >= startOfWeek) {
          weekStats[d.status] = (weekStats[d.status] || 0) + 1;
        }
      });

      setStats({ month: monthStats, week: weekStats });
    });
  }, []);

  const checkIn = async () => {
    try {
      const res = await axios.post(`${API_URL}/attendance/checkin`, { userId: user._id });
      setToday(res.data);
      window.location.reload(); // Refresh to update stats
    } catch (err) { alert(err.response?.data?.message); }
  };

  // Select stats based on toggle
  const currentStats = view === 'week' ? stats.week : stats.month;

  return (
    <div className="space-y-6">
      {/* Check In Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Today's Activity</h2>
          <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        {today ? (
          <div className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-bold flex items-center gap-2 border border-green-200">
            <CheckCircle /> Checked In at {new Date(today.checkInTime).toLocaleTimeString()}
          </div>
        ) : (
          <button onClick={checkIn} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
            <Clock /> MARK ATTENDANCE
          </button>
        )}
      </div>

      {/* Stats Section with Toggle */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600"/> 
            {view === 'week' ? 'This Week' : 'This Month'} Statistics
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
            <button 
              onClick={() => setView('week')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'week' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setView('month')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'month' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label={view === 'week' ? "Present (Week)" : "Present (Month)"} val={currentStats.present} icon={CheckCircle} color="text-green-600" bg="bg-green-50"/>
          <StatCard label="Late Arrivals" val={currentStats.late} icon={Clock} color="text-yellow-600" bg="bg-yellow-50"/>
          <StatCard label="Absences" val={currentStats.absent} icon={XCircle} color="text-red-600" bg="bg-red-50"/>
        </div>
      </div>
    </div>
  );
};

// --- MANAGER: DASHBOARD (Stats & Summary) ---
const ManagerDashboard = () => {
  const [stats, setStats] = useState({ total: 0, present: 0, onTime: 0, late: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await axios.get(`${API_URL}/users`);
      const attendanceRes = await axios.get(`${API_URL}/attendance/all`);
      
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const today = new Date(now - offset).toISOString().split('T')[0];

      const presentToday = attendanceRes.data.filter(r => r.date === today && (r.status === 'present' || r.status === 'late'));
      
      setStats({
        total: usersRes.data.length,
        present: presentToday.length,
        onTime: presentToday.filter(r => r.status === 'present').length,
        late: presentToday.filter(r => r.status === 'late').length
      });
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="Present Today" val={stats.present} icon={CheckCircle} color="text-green-600" bg="bg-green-50"/>
      <StatCard label="On Time" val={stats.onTime} icon={Timer} color="text-blue-600" bg="bg-blue-50"/>
      <StatCard label="Late Arrivals" val={stats.late} icon={Clock} color="text-yellow-600" bg="bg-yellow-50"/>
      <StatCard label="Total Workforce" val={stats.total} icon={Users} color="text-gray-600" bg="bg-gray-50"/>
    </div>
  );
};

// --- MANAGER: ALL RECORDS ---
const ManagerAllRecords = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { axios.get(`${API_URL}/attendance/all`).then(r => setRecords(r.data)); }, []);

  const filteredRecords = records.filter(r => 
    r.userId?.name.toLowerCase().includes(filter.toLowerCase()) ||
    r.userId?.department.toLowerCase().includes(filter.toLowerCase()) ||
    r.status.toLowerCase().includes(filter.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["Employee,Department,Date,Time,Status"];
    const rows = filteredRecords.map(r => `${r.userId?.name},${r.userId?.department},${r.date},${new Date(r.checkInTime).toLocaleTimeString()},${r.status}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "attendance_report.csv";
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 w-96">
          <Search size={18} className="text-gray-400"/>
          <input className="bg-transparent outline-none w-full" placeholder="Filter by Name, Dept, or Status..." onChange={e => setFilter(e.target.value)} />
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"><Download size={18}/> Export CSV</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase"><tr><th className="p-4">Employee</th><th className="p-4">Dept</th><th className="p-4">Date</th><th className="p-4">Time</th><th className="p-4">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRecords.map(r => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{r.userId?.name}</td>
                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{r.userId?.department}</span></td>
                <td className="p-4 text-gray-600">{r.date}</td>
                <td className="p-4 font-mono text-sm">{new Date(r.checkInTime).toLocaleTimeString()}</td>
                <td className="p-4"><Badge status={r.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SHARED COMPONENTS ---
const LeaveSection = ({ user }) => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ type: 'Sick Leave', start: '', end: '', reason: '' });
  const fetchLeaves = async () => { const res = await axios.get(`${API_URL}/leaves?role=${user.role}&userId=${user._id}`); setLeaves(res.data); };
  useEffect(() => { fetchLeaves(); }, []);
  const submitLeave = async (e) => { e.preventDefault(); await axios.post(`${API_URL}/leaves`, { userId: user._id, leaveType: form.type, startDate: form.start, endDate: form.end, reason: form.reason }); fetchLeaves(); alert("Submitted!"); };
  const handleAction = async (id, status) => { await axios.put(`${API_URL}/leaves/${id}`, { status }); fetchLeaves(); };
  return (
    <div className="space-y-6">
      {user.role === 'employee' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Briefcase size={20}/> New Leave Request</h3>
          <form onSubmit={submitLeave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="input-field" onChange={e=>setForm({...form, type:e.target.value})}><option>Sick Leave</option><option>Casual Leave</option></select>
            <input className="input-field" placeholder="Reason" onChange={e=>setForm({...form, reason:e.target.value})}/>
            <input type="date" className="input-field" onChange={e=>setForm({...form, start:e.target.value})}/>
            <input type="date" className="input-field" onChange={e=>setForm({...form, end:e.target.value})}/>
            <button className="md:col-span-2 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700">Submit</button>
          </form>
        </div>
      )}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-4 bg-gray-50 font-bold border-b">Leave Requests</div>
        <table className="w-full text-left">
          <thead className="bg-white text-gray-500 text-sm"><tr><th className="p-4">Type</th>{user.role === 'manager' && <th className="p-4">Employee</th>}<th className="p-4">Status</th>{user.role === 'manager' && <th className="p-4">Action</th>}</tr></thead>
          <tbody>{leaves.map(l => (<tr key={l._id} className="border-b hover:bg-gray-50"><td className="p-4">{l.leaveType}</td>{user.role === 'manager' && <td className="p-4"><div className="font-bold">{l.userId?.name}</div></td>}<td className="p-4"><Badge status={l.status}/></td>{user.role === 'manager' && l.status === 'Pending' && <td className="p-4 flex gap-2"><button onClick={()=>handleAction(l._id, 'Approved')} className="text-green-600"><Check/></button><button onClick={()=>handleAction(l._id, 'Rejected')} className="text-red-600"><X/></button></td>}</tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};

const HistoryPage = ({ user }) => {
  const [list, setList] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/attendance/${user._id}`).then(r => setList(r.data)) }, []);
  return <div className="bg-white rounded-2xl border overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50"><tr><th className="p-4">Date</th><th className="p-4">Status</th></tr></thead><tbody>{list.map(r=><tr key={r._id} className="border-b"><td className="p-4">{r.date}</td><td className="p-4"><Badge status={r.status}/></td></tr>)}</tbody></table></div>
};

// --- UTILS ---
const ProfilePage = ({ user }) => (<div className="bg-white p-8 rounded-2xl border max-w-lg"><div className="flex gap-4 items-center mb-6"><div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">{user.name.charAt(0)}</div><div><h2 className="text-xl font-bold">{user.name}</h2><p className="text-gray-500 capitalize">{user.role}</p></div></div><div className="space-y-3"><p><strong>Email:</strong> {user.email}</p><p><strong>Dept:</strong> {user.department}</p></div></div>);
const NavItem = ({ icon: I, label, active, onClick }) => (<button onClick={onClick} className={`w-full flex gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}><I size={20}/> {label}</button>);
const StatCard = ({ label, val, icon: I, color, bg }) => (<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"><div className={`p-4 rounded-xl ${bg} ${color}`}><I size={24}/></div><div><p className="text-gray-500 text-sm font-medium">{label}</p><h3 className="text-2xl font-bold">{val}</h3></div></div>);
const Badge = ({ status }) => { const c = { pending: 'bg-orange-100 text-orange-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700' }; return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${c[status.toLowerCase()] || 'bg-gray-100'}`}>{status}</span> };
const style = document.createElement('style'); style.innerHTML = `.input-field { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 0.75rem; outline: none; transition: all; } .input-field:focus { border-color: #4f46e5; ring: 2px; }`; document.head.appendChild(style);

export default App;
