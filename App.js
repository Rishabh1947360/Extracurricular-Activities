import React, { useState } from 'react';
import './App.css'; // Import your new CSS file

// --- NEW "COOL" ICONS (as React components) ---
const Icon = ({ children, className }) => (
    <svg className={`icon ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

const RocketIcon = (props) => ( // Replaces AwardIcon
    <Icon {...props}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.1S5.66 15.61 4.5 16.5z" />
        <path d="M12 12c3 3 5 5 5 5s3-2 3-5-2-5-5-5-5 2-5 5z" />
        <path d="M12 12c-3-3-5-5-5-5s-2 3-5 3 5 2 5 5 2-5 5-5z" />
        <path d="M12 12L22 2" />
        <path d="M2 22l10-10" />
    </Icon>
);
const UsersIcon = (props) => ( // Replaces UserCheckIcon
    <Icon {...props}>
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </Icon>
);
const SparklesIcon = (props) => ( // Replaces ShieldCheckIcon
    <Icon {...props}>
        <path d="M12 3a6 6 0 00-6 6v12h12V9A6 6 0 0012 3z" />
        <path d="M18.5 7.5h.01" />
        <path d="M12 17.5h.01" />
        <path d="M5.5 7.5h.01" />
    </Icon>
);
const LogOutIcon = (props) => (
    <Icon {...props}>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </Icon>
);
const TrophyIcon = (props) => (
    <Icon {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </Icon>
);


// --- MOCK DATA (Updated for College Theme) ---
const initialStudents = [
    {
        id: '101',
        name: 'Priya Sharma',
        class: 'B.Tech CSE, 2nd Year',
        achievements: [
            { id: 1, title: 'Winner, Inter-College Hackathon', category: 'Academics', date: '2024-05-15' },
            { id: 2, title: 'Elected Head of Student Council', category: 'Leadership', date: '2024-03-10' },
            { id: 3, title: 'Captain, University Basketball Team', category: 'Sports', date: '2024-04-22' },
            { id: 4, title: 'Published Paper on AI Ethics', category: 'Academics', date: '2024-10-01' },
            { id: 5, title: 'Organized a Campus Clean-up Drive', category: 'Volunteering', date: '2024-09-22' },
        ],
    },
    {
        id: '102',
        name: 'Rohan Mehta',
        class: 'M.A. Economics, 1st Year',
        achievements: [
            { id: 1, title: 'Published Paper in University Journal', category: 'Academics', date: '2025-09-01' },
            { id: 2, title: 'Coordinator for Annual Tech Fest', category: 'Volunteering', date: '2025-05-20' },
            { id: 3, title: 'Lead Role in Annual Theatre Production', category: 'Arts', date: '2025-01-15' },
        ],
    },
];

// --- MAIN APP COMPONENT ---
function App() {
    const [page, setPage] = useState('home'); // 'home', 'student', 'admin'
    const [students, setStudents] = useState(initialStudents);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleNavigate = (newPage) => {
        setPage(newPage);
        setIsLoginOpen(false);
    };

    const handleStudentLogin = (studentId) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            setCurrentUser(student);
            handleNavigate('student');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        handleNavigate('home');
    };

    const addStudentAchievement = (studentData) => {
        setStudents(prevStudents => {
            const existingStudent = prevStudents.find(s => s.name.toLowerCase() === studentData.name.toLowerCase());
            if (existingStudent) {
                return prevStudents.map(s =>
                    s.id === existingStudent.id
                    ? { ...s, achievements: [{id: Date.now(), ...studentData.achievement}, ...s.achievements] }
                    : s
                );
            } else {
                const newStudent = {
                    id: `stu-${Date.now()}`,
                    name: studentData.name,
                    class: studentData.class,
                    achievements: [{id: Date.now(), ...studentData.achievement}],
                };
                return [...prevStudents, newStudent];
            }
        });
    };

    const renderPage = () => {
        switch (page) {
            case 'student':
                return (
                    <>
                        <Header onLogout={handleLogout} page={page} />
                        <StudentPage student={currentUser} />
                    </>
                );
            case 'admin':
                return (
                    <>
                        <Header onLogout={handleLogout} page={page} />
                        <AdminPage students={students} onAddAchievement={addStudentAchievement} />
                    </>
                );
            default:
                return <HomePage onLoginClick={() => setIsLoginOpen(true)} />;
        }
    };

    return (
        <div>
            {renderPage()}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onAdminLogin={() => handleNavigate('admin')}
                onStudentLogin={handleStudentLogin}
                students={students}
            />
        </div>
    );
}

// --- PAGES & COMPONENTS ---

function HomePage({ onLoginClick }) {
    return (
        <div className="home-page">
            <header className="home-header">
                <h1>AchieveTrack</h1>
                <p>
                    A professional platform for managing and showcasing university-level extracurricular achievements.
                </p>
            </header>

            <main className="benefits-grid">
                <BenefitCard
                    icon={<RocketIcon />}
                    title="Launch Your Profile"
                    description="A verified, central portfolio for awards, projects, and leadership roles."
                />
                <BenefitCard
                    icon={<UsersIcon />}
                    title="Empower Students"
                    description="Build a comprehensive profile for internships, placements, and further studies."
                />
                <BenefitCard
                    icon={<SparklesIcon />}
                    title="Showcase Your Best"
                    description="Effortlessly validate, manage, and report on student accomplishments."
                />
            </main>

            <footer>
                <button onClick={onLoginClick} className="home-get-started-btn">
                    Login / Get Started
                </button>
            </footer>
        </div>
    );
}

function BenefitCard({ icon, title, description }) {
    return (
        <div className="benefit-card">
            <div className="benefit-card-icon">
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function AdminPage({ students, onAddAchievement }) {
    const [studentName, setStudentName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [achievementTitle, setAchievementTitle] = useState('');
    const [achievementCategory, setAchievementCategory] = useState('Academics');
    const [achievementDate, setAchievementDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!studentName || !studentClass || !achievementTitle) {
            alert('Please fill all required fields.');
            return;
        }
        onAddAchievement({
            name: studentName,
            class: studentClass,
            achievement: {
                title: achievementTitle,
                category: achievementCategory,
                date: achievementDate,
            }
        });
        // Reset form after submission
        setStudentName('');
        setStudentClass('');
        setAchievementTitle('');
        setAchievementCategory('Academics');
        setAchievementDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="container">
            <div className="admin-page-grid">
                <div className="form-container">
                    <h2>Add New Achievement</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Student Name</label>
                            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g., Priya Sharma" />
                        </div>
                        <div className="form-group">
                            <label>Course / Year</label>
                            <input type="text" value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder="e.g., B.Tech CSE, 2nd Year"/>
                        </div>
                        <div className="form-group">
                            <label>Achievement Title</label>
                            <input type="text" value={achievementTitle} onChange={e => setAchievementTitle(e.target.value)} placeholder="e.g., Winner, Inter-College Hackathon" />
                        </div>
                         <div className="form-group">
                            <label>Category</label>
                            <select value={achievementCategory} onChange={e => setAchievementCategory(e.target.value)}>
                                <option>Academics</option>
                                <option>Sports</option>
                                <option>Arts</option>
                                <option>Leadership</option>
                                <option>Volunteering</option>
                            </select>
                        </div>
                         <div className="form-group">
                            <label>Date of Achievement</label>
                            <input type="date" value={achievementDate} onChange={e => setAchievementDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-submit">
                            Save Achievement
                        </button>
                    </form>
                </div>
                <div className="records-container">
                     <h2>All Student Records</h2>
                     <div>
                        {students.map(student => (
                            <div key={student.id} className="student-record">
                                <h3>{student.name} <span>- {student.class}</span></h3>
                                <ul>
                                    {student.achievements.map(ach => (
                                        <li key={ach.id}>{ach.title} ({ach.category}) - <span style={{fontSize: '0.8rem'}}>{ach.date}</span></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
}

function StudentPage({ student }) {
    if (!student) {
        return (
            <div className="container">
                <p>Error: No student selected. Please go back to the home page.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="student-page-header">
                <h1>{student.name}</h1>
                <p>{student.class}</p>
            </div>

            <div className="achievements-list-container">
                <div className="achievements-grid">
                    {student.achievements.sort((a, b) => new Date(b.date) - new Date(a.date)).map(ach => (
                        <div key={ach.id} className="achievement-card">
                            <div className="achievement-header">
                                <div className="achievement-icon">
                                    <TrophyIcon />
                                </div>
                                <div className="achievement-details">
                                    <p>{ach.title}</p>
                                    <p>{new Date(ach.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                             <div className="achievement-footer">
                                <span className={`achievement-category category-${ach.category}`}>
                                    {ach.category}
                                </span>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LoginModal({ isOpen, onClose, onAdminLogin, onStudentLogin, students }) {
    const [selectedStudent, setSelectedStudent] = useState(students.length > 0 ? students[0].id : '');

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h2>Login As</h2>

                <div>
                    <button onClick={onAdminLogin} className="modal-btn btn-admin">
                        Administrator
                    </button>
                    <div className="modal-divider"></div>
                    <div className="form-group">
                        <label>Select Your Profile to View Dashboard</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => onStudentLogin(selectedStudent)}
                        disabled={!selectedStudent}
                        className="modal-btn btn-student"
                    >
                        Login as Student
                    </button>
                </div>
            </div>
        </div>
    );
}

function Header({ onLogout, page }) {
    return (
        <header className="header">
            <div className="header-title">
                <TrophyIcon style={{color: '#6d28d9'}} />
                <h1>AchieveTrack</h1>
            </div>
            {page !== 'home' && (
                 <button onClick={onLogout} className="header-logout">
                    <LogOutIcon style={{width: '16px', height: '16px'}} />
                    Logout
                </button>
            )}
        </header>
    );
}

export default App;