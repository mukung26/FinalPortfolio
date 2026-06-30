import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import {
  Sun,
  Moon,
  FileText,
  ExternalLink,
  X,
  Linkedin,
  Facebook,
  Github,
  Check,
  BarChart3,
  Bot,
  TrendingUp,
  AlertCircle,
  Palette,
  MapPin,
  Mail,
  ArrowRight,
  Users,
  PieChart,
  Globe,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Laptop,
  Clock,
  Server,
  Lock,
  Unlock
} from 'lucide-react';

// --- Type Definitions ---
interface Project {
  id: string;
  title: string;
  meta: string;
  icon: React.ComponentType<{ className?: string }>;
  body: string;
  impact: string;
}

// --- Helper for CV Generation ---
function addCVExperience(
  pdf: jsPDF,
  title: string,
  subtitle: string,
  bullets: string[],
  margin: number,
  currentY: number
): number {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(11, 95, 255);
  pdf.text(title, margin, currentY);

  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  pdf.text(subtitle, 210 - margin - 10, currentY, { align: 'right' });

  let bulletY = currentY + 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8.5);
  bullets.forEach((bullet) => {
    const lines = pdf.splitTextToSize('\u2022 ' + bullet, 180);
    pdf.text(lines, margin + 2, bulletY);
    bulletY += lines.length * 4.5;
  });
  return bulletY; // Return the new Y position
}

// --- CV PDF Generator Service ---
const downloadCV = async (): Promise<void> => {
  console.log('Starting CV generation v2.9.0...');
  try {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    const maxWidth = pageWidth - 2 * margin;
    let y = margin;

    // Header - Name
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(11, 95, 255);
    pdf.text('JERWIN CRUSPERO', margin, y);
    y += 7;

    // Header - Title
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text(
      'Web Developer \u2022 Digital Marketing \u2022 Marketing Automation \u2022 Virtual Assistant',
      margin,
      y
    );
    y += 5;

    // Header - Contact Info
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const contactInfo = 'Davao City, Philippines  |  Email: jcruspero3263@gmail.com';
    pdf.text(contactInfo, margin, y);
    y += 5;

    // Portfolio Link
    const portfolioUrl = 'https://portfolio.jcruspero3263.workers.dev/';
    pdf.setTextColor(11, 95, 255);
    pdf.text('Portfolio: ' + portfolioUrl, margin, y);
    pdf.link(margin, y - 3, pdf.getTextWidth('Portfolio: ' + portfolioUrl), 4, {
      url: portfolioUrl,
    });
    y += 6;

    // Divider
    pdf.setDrawColor(11, 95, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Professional Summary
    pdf.setTextColor(11, 95, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('PROFESSIONAL SUMMARY', margin, y);
    y += 5;

    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    const summaryText =
      'Results-oriented Web Developer and Digital Marketer. I build fast, user-friendly websites with React and automate marketing tasks to save time. By combining my web development skills with my background in customer service, I help businesses grow online, create better landing pages, and track the data that matters.';
    const summaryLines = pdf.splitTextToSize(summaryText, maxWidth);
    pdf.text(summaryLines, margin, y);
    y += summaryLines.length * 4.5 + 6;

    // Core Skills
    pdf.setTextColor(11, 95, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('TECHNICAL SKILLS', margin, y);
    y += 5;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');

    const techSkills = [
      'Analytics & Reporting: Data Analysis (Excel), Power BI, Business Dashboards, Performance Tracking',
      'Marketing Automation: Workflow Automation, App Integrations, Google Apps Script',
      'Web Development: Frontend (React, Tailwind), Website Optimization, User Experience',
      'Backend & Data: API Connections, Databases (Firebase, SQL), Node.js',
      'AI & Prompt Engineering: Prompt Writing, AI Content Generation, AI Model Testing',
      'Data Entry & Admin: Data Entry (90 WPM), Document Formatting, Administrative Support',
    ];

    techSkills.forEach((line) => {
      pdf.text('\u2022 ' + line, margin + 2, y);
      y += 4.5;
    });
    y += 4;

    // Soft Skills
    pdf.setTextColor(11, 95, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('SOFT SKILLS', margin, y);
    y += 5;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');

    const softSkillsPdf = [
      'Problem Solving & Analysis',
      'Team Collaboration',
      'Time Management',
      'Adaptability & Learning',
      'Attention to Detail',
      'Clear Client Communication',
    ];

    softSkillsPdf.forEach((line) => {
      pdf.text('\u2022 ' + line, margin + 2, y);
      y += 4.5;
    });
    y += 6;

    // Experience Section
    pdf.setTextColor(11, 95, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('PROFESSIONAL EXPERIENCE', margin, y);
    y += 6;

    // Experience 1
    y = addCVExperience(
      pdf,
      'Six Eleven Global Services',
      'Customer Service Representative \u2014 Davao | 03/2024 \u2013 06/2026',
      [
        'Trained new team members on how to use platforms, handle issues, and meet quality goals; recognized as a top performer.',
        'Acted as the main contact for customers, ensuring all accounts were handled quickly and professionally.',
        'Created clear spreadsheets and charts to track performance and important monthly goals.',
        'Organized invoice records and checked payments to make sure everything was accurate.',
      ],
      margin,
      y
    );
    y += 5;

    // Experience 2
    y = addCVExperience(
      pdf,
      'Tempestas ESports',
      'Administrative Support \u2014 Davao | 12/2020 \u2013 12/2022',
      [
        'Handled daily administrative tasks and kept important team spreadsheets up-to-date.',
        'Simplified reporting processes, making data tracking faster and more accurate.',
        'Helped customers through chat and email, providing quick and polite solutions.',
      ],
      margin,
      y
    );
    y += 8;

    // Education & Training
    pdf.setTextColor(11, 95, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('EDUCATION & TRAINING', margin, y);
    y += 6;

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bachelor of IT', margin + 2, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text('St. John Paul II College of Davao (2020 \u2013 2023)', margin + 27, y);
    y += 6;

    pdf.setFontSize(8.5);
    pdf.text('\u2022 Outlier AI Training: Prompt Engineering & AI Evaluation (2023 \u2013 2024)', margin + 2, y);
    y += 4.5;
    pdf.text('\u2022 Microsoft 365 Developer Fundamentals (2023 \u2013 2024)', margin + 2, y);
    y += 4.5;
    pdf.text('\u2022 WordCamp Davao Participant (2023)', margin + 2, y);

    pdf.save('Jerwin_Cruspero_CV.pdf');
  } catch (e) {
    console.error('CV Generation Error:', e);
    alert('Error generating CV. Please check the console for details.');
  }
};

// --- Contact Form Component ---
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', phone: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ENDPOINT =
      'https://script.google.com/macros/s/AKfycbww5_2U0tKAIzcRR8JIgdOC8o9HdP3TxxaHYxIgiATIdDY4P1jk5j03YtvP20UXEc1y/exec';
    const SHARED_SECRET = '1234567890qwertyuiopasdfghjkl';
    const params = new URLSearchParams();
    params.append('email', formData.email.trim());
    params.append('phone', formData.phone.trim());
    params.append('description', formData.description.trim());
    params.append('secret', SHARED_SECRET);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const data = await res.json();
      if (data.success) setIsSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div id="contact-success" className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center animate-fade-in">
        <div className="success-checkmark mb-6">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">Message Sent!</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Thank you! I'll get back to you soon.
        </p>
        <button
          onClick={() => setIsSent(false)}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <section
      id="contact"
      className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm h-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Contact</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Email (required)
          </label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+63 XXX XXX XXXX"
            className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Description (required)
          </label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell me about your project..."
            className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all resize-none shadow-sm"
          ></textarea>
        </div>
        <button
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg w-full cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </section>
  );
};

// --- Visitor Stats Helper Functions ---
const getDeviceDetails = (ua: string) => {
  if (!ua) return { icon: Laptop, text: 'Desktop' };
  const lowerUA = ua.toLowerCase();
  if (lowerUA.includes('mobile') || lowerUA.includes('iphone') || lowerUA.includes('android')) {
    return { icon: Smartphone, text: 'Mobile' };
  }
  return { icon: Laptop, text: 'Desktop' };
};

const formatRelTime = (isoString: string) => {
  try {
    const past = new Date(isoString);
    const diff = Date.now() - past.getTime();
    if (diff < 60000) return 'Just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Recently';
  }
};

const getCountryFlag = (country: string, code: string) => {
  if (!country || country === 'Unknown') return '🌐';
  const name = country.toLowerCase();
  if (name.includes('philippines')) return '🇵🇭';
  if (name.includes('united states') || name.includes('usa')) return '🇺🇸';
  if (name.includes('canada')) return '🇨🇦';
  if (name.includes('united kingdom') || name.includes('uk')) return '🇬🇧';
  if (name.includes('australia')) return '🇦🇺';
  if (name.includes('singapore')) return '🇸🇬';
  if (name.includes('germany')) return '🇩🇪';
  if (name.includes('japan')) return '🇯🇵';
  if (name.includes('india')) return '🇮🇳';
  
  if (code && code.length === 2) {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    try {
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌐';
    }
  }
  return '🌐';
};

// --- Main App Component ---
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState('summary');
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [showVisitorDetails, setShowVisitorDetails] = useState(false);
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchVisitorLogs = async () => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') return;
    setIsLoadingLogs(true);
    try {
      const q = query(collection(db, 'stats'));
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => item.type === 'visitor-log' && item.timestamp)
        .sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
      setVisitorLogs(logs);
    } catch (error) {
      console.error("Error fetching visitor logs:", error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleToggleVisitorDetails = () => {
    const nextVal = !showVisitorDetails;
    setShowVisitorDetails(nextVal);
    if (nextVal && localStorage.getItem('isAdminAuthenticated') === 'true') {
      fetchVisitorLogs();
    }
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = adminPasswordInput.trim();
    const allowedPasscodes = ["admin123", "jerwin3263", "jerwin123", "jerwin", "portfolio123"];
    
    const customPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    if (customPasscode) {
      allowedPasscodes.push(customPasscode.trim());
    }

    if (allowedPasscodes.includes(cleanPass)) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      setAuthError(null);
      
      // Fetch logs immediately
      setIsLoadingLogs(true);
      const q = query(collection(db, 'stats'));
      getDocs(q).then(querySnapshot => {
        const logs = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((item: any) => item.type === 'visitor-log' && item.timestamp)
          .sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
        setVisitorLogs(logs);
      }).catch(error => {
        console.error("Error fetching visitor logs:", error);
      }).finally(() => {
        setIsLoadingLogs(false);
      });
    } else {
      setAuthError("Incorrect admin passcode. Try again!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    setAdminPasswordInput('');
    setVisitorLogs([]);
  };

  // Track visits with privacy-preserving geolocation
  useEffect(() => {
    const maskIp = (ip: string): string => {
      if (!ip) return 'Unknown';
      if (ip.includes(':')) {
        // IPv6 masking
        const parts = ip.split(':');
        if (parts.length > 2) {
          return `${parts.slice(0, 3).join(':')}:XXXX:XXXX::`;
        }
        return 'IPv6-masked';
      } else {
        // IPv4 masking
        const parts = ip.split('.');
        if (parts.length === 4) {
          return `${parts[0]}.${parts[1]}.${parts[2]}.XXX`;
        }
        return 'IPv4-masked';
      }
    };

    const fetchIpDetails = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('ipapi.co failed');
        return await res.json();
      } catch (err) {
        try {
          // Fallback geolocator
          const resFallback = await fetch('https://api.db-ip.com/v2/free/self');
          if (resFallback.ok) {
            const data = await resFallback.json();
            return {
              ip: data.ipAddress,
              city: data.city,
              region: data.stateProv || data.region,
              country_name: data.countryName,
              country_code: data.countryCode
            };
          }
        } catch (fallbackErr) {
          console.debug("Fallback IP locator also failed", fallbackErr);
        }
        return null;
      }
    };

    const trackVisit = async () => {
      try {
        const statsRef = doc(db, 'stats', 'visitors');
        
        if (!sessionStorage.getItem('hasVisited')) {
          // Increment main counter
          await updateDoc(statsRef, {
            count: increment(1)
          }).catch(async (err) => {
            if (err.code === 'not-found') {
              await setDoc(statsRef, { count: 1 });
            }
          });

          // Session-based Geo Log with privacy protection
          const geoInfo = await fetchIpDetails();
          const maskedIp = geoInfo?.ip ? maskIp(geoInfo.ip) : 'Unknown';
          const country = geoInfo?.country_name || 'Unknown';
          const countryCode = geoInfo?.country_code || 'Unknown';
          const region = geoInfo?.region || 'Unknown';
          const city = geoInfo?.city || 'Unknown';
          const isp = geoInfo?.org || 'Unknown';

          await addDoc(collection(db, 'stats'), {
            type: 'visitor-log',
            timestamp: new Date().toISOString(),
            ip: maskedIp,
            country,
            countryCode,
            region,
            city,
            isp,
            userAgent: navigator.userAgent
          });

          sessionStorage.setItem('hasVisited', 'true');
        }
        
        let snap = await getDoc(statsRef);
        if (!snap.exists()) {
          await setDoc(statsRef, { count: 1 });
          snap = await getDoc(statsRef);
        }
        
        if (snap.exists()) {
          setVisitorCount(snap.data().count);
        }
      } catch (error) {
        console.error("Error updating visitor count", error);
      }
    };
    
    trackVisit();
  }, []);

  // Infinite Scroll & Drag Logic
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isHovering = useRef(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const scrollPos = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('app-dark-mode');
      document.body.classList.add('app-dark-mode');
    } else {
      document.documentElement.classList.remove('app-dark-mode');
      document.body.classList.remove('app-dark-mode');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // The Auto-Scroll Engine (Optimized for smoothness)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let lastTime = 0;
    const speed = 40; // Pixels per second

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!slider.children || slider.children.length === 0) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dynamic Width Calculation for perfect looping
      const cardsPerSet = projects.length; // 5
      if (slider.children.length < cardsPerSet * 2) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      const firstCard = slider.children[0] as HTMLDivElement;
      const firstCardSet2 = slider.children[cardsPerSet] as HTMLDivElement;
      // Distance from start of item 0 to start of item 5 (which is item 0 of set 2)
      const singleSetWidth = firstCardSet2.offsetLeft - firstCard.offsetLeft;

      // 1. Update ScrollPos based on mode
      if (!isDown.current && !isHovering.current) {
        scrollPos.current += speed * delta;
      } else {
        scrollPos.current = slider.scrollLeft;
      }

      // 2. Check Loop Bounds
      // We ensure scrollPos is within a safe range to prevent running out of clones
      if (scrollPos.current >= singleSetWidth * 2) {
        scrollPos.current -= singleSetWidth;
        slider.scrollLeft = scrollPos.current; // seamless jump
      } else if (scrollPos.current <= 0) {
        scrollPos.current += singleSetWidth;
        slider.scrollLeft = scrollPos.current; // seamless jump
      } else {
        // 3. Apply normal movement (only if auto-scrolling)
        if (!isDown.current && !isHovering.current) {
          slider.scrollLeft = scrollPos.current;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    // Initial positioning
    const timeoutId = setTimeout(() => {
      if (slider.children.length > projects.length) {
        const firstCard = slider.children[0] as HTMLDivElement;
        const firstCardSet2 = slider.children[projects.length] as HTMLDivElement;
        const singleSetWidth = firstCardSet2.offsetLeft - firstCard.offsetLeft;
        slider.scrollLeft = singleSetWidth;
        scrollPos.current = singleSetWidth;
      }
    }, 100);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timeoutId);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDown.current = true;
    if (sliderRef.current) {
      startX.current = e.pageX - sliderRef.current.offsetLeft;
      scrollLeft.current = sliderRef.current.scrollLeft;
      sliderRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    isHovering.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Drag speed
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const techSkillCategories = [
    {
      title: 'Analytics & Reporting',
      skills: ['Data Analysis (Excel)', 'Power BI', 'Business Dashboards', 'Performance Tracking'],
    },
    {
      title: 'Marketing Automation',
      skills: ['Workflow Automation', 'App Integrations', 'Google Apps Script'],
    },
    {
      title: 'Web Development',
      skills: ['Frontend (React, Tailwind)', 'Website Optimization', 'User Experience (UX)'],
    },
    {
      title: 'Backend & Data',
      skills: ['API Connections', 'Databases (Firebase, SQL)', 'Node.js'],
    },
    {
      title: 'AI & Prompt Engineering',
      skills: ['Prompt Writing', 'AI Content Generation', 'AI Model Testing', 'Data Annotation'],
    },
    {
      title: 'Data Entry & Admin',
      skills: ['Data Entry (90 WPM)', 'Document Formatting', 'Administrative Support'],
    },
  ];

  const softSkills = [
    'Problem Solving',
    'Team Collaboration',
    'Time Management',
    'Adaptability',
    'Attention to Detail',
    'Clear Communication',
  ];

  const projects: Project[] = [
    {
      id: 'p6',
      title: 'Sales Performance Dashboard',
      meta: 'Power BI • Data Modeling • DAX',
      icon: PieChart,
      body: 'Developed an interactive Power BI dashboard to visualize sales trends, regional performance, and key metrics. This dashboard connected multiple data sources for real-time reporting.',
      impact: 'Provided leadership with real-time data insights, cutting down reporting time and driving more informed business decisions.',
    },
    {
      id: 'p1',
      title: 'Shift Attendance Automation',
      meta: 'Google Apps Script • Sheets • Webhooks',
      icon: BarChart3,
      body: 'Built a tool that automatically tracks employee schedules using Google Apps Script and Webhooks. This makes managing large amounts of data easier and saves time on daily admin work.',
      impact: 'Removed 90% of manual data entry and fixed schedule matching errors.',
    },
    {
      id: 'p2',
      title: 'Bot UI & Webhook Dashboard',
      meta: 'React • Node.js • Cloudflare • Replit',
      icon: Bot,
      body: 'Created a simple dashboard to manage automated tasks. It organizes incoming sales leads, checks campaign data, and sends information to the CRM (Customer Relationship Management) system automatically.',
      impact: 'Sped up how fast we process new leads and made the overall workflow much smoother.',
    },
    {
      id: 'p3',
      title: 'Operational Reporting Tools',
      meta: 'Sheets • Apps Script • Pivot Tables',
      icon: TrendingUp,
      body: 'Set up an automated reporting system to track business goals. It creates regular summaries and charts, making it easy to see how marketing campaigns are performing.',
      impact: 'Made reporting 40% faster while keeping data completely accurate and easy to read.',
    },
    {
      id: 'p4',
      title: 'Alert Bot Integrations',
      meta: 'Webhooks • API Integrations • Automation',
      icon: AlertCircle,
      body: 'Designed an automated alert system that tags team members and directs issues to the right person. This helps the team communicate better and reply to customers faster.',
      impact: 'Automated the notification process, cutting the time it takes to resolve issues in half.',
    },
    {
      id: 'p5',
      title: 'Custom Portfolio Platform',
      meta: 'React • Tailwind • jsPDF',
      icon: Palette,
      body: 'Built a fast, easy-to-use personal website. It works well on all screens and downloads a clean PDF version of my resume, showing design practices that keep visitors engaged.',
      impact: 'Got a perfect 100/100 performance score, making sure the site loads instantly and looks great.',
    },
  ];

  // Quadruple projects to ensure enough buffer for seamless looping
  const infiniteProjects = [...projects, ...projects, ...projects, ...projects];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-pattern transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between">
      <div>
        <header className="fixed top-0 inset-x-0 z-50 glass">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div id="author-branding" className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/d/1A_Sxh9E2CwbL9q2tJKQ1rR_5RjvvuXJv"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                alt="JC"
              />
              <span className="font-extrabold text-lg hidden sm:inline text-slate-900 dark:text-white">
                Jerwin <span className="text-blue-600">Cruspero</span>
              </span>
            </div>
            <nav id="header-nav" className="flex items-center gap-2 sm:gap-6">
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90 mr-2 cursor-pointer"
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => scrollToSection('summary')}
                className={`text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  activeSection === 'summary'
                    ? 'text-blue-600 underline decoration-2'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className={`text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  activeSection === 'projects'
                    ? 'text-blue-600 underline decoration-2'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className={`text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  activeSection === 'experience'
                    ? 'text-blue-600 underline decoration-2'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  activeSection === 'contact'
                    ? 'text-blue-600 underline decoration-2'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                Contact
              </button>
              <button
                id="download-cv-btn"
                onClick={async () => {
                  setIsDownloading(true);
                  await downloadCV();
                  setIsDownloading(false);
                }}
                disabled={isDownloading}
                className="bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                <span>{isDownloading ? '...' : 'CV'}</span>
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 pt-32 space-y-20 flex-grow">
          {/* Summary Section */}
          <section
            id="summary"
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 opacity-40"></div>
            <div className="relative z-10 flex flex-col gap-12 items-start">
              <div className="w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                  <div>
                    <h2 className="text-blue-600 font-extrabold uppercase tracking-widest text-xs mb-2 md:mb-4">
                      Professional Summary
                    </h2>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      Jerwin Cruspero
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800 shadow-sm">
                        Web Developer
                      </span>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm">
                        Digital Marketing
                      </span>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-sm font-bold border border-amber-200 dark:border-amber-800 shadow-sm">
                        Marketing Automation
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded-full text-sm font-bold border border-purple-200 dark:border-purple-800 shadow-sm">
                        Virtual Assistant
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-4xl">
                  Results-oriented Web Developer and Digital Marketer. I build fast, user-friendly websites with React and automate marketing tasks to save time. By combining my web development skills with my background in customer service, I help businesses grow online, create better landing pages, and track the data that matters.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 w-full">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white mb-6">Technical Skills</h3>
                    <div className="space-y-6">
                      {techSkillCategories.map((category) => (
                        <div key={category.title}>
                          <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                            {category.title}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-400 shadow-sm relative overflow-hidden group hover:scale-105 transition-transform"
                              >
                                <span className="relative z-10">{skill}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white mb-6">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {softSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section - Infinite Scroll & Drag */}
          <section id="projects" className="overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Projects & Achievements
              </h2>
              <a
                href="https://github.com/mukung26?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1 group"
              >
                View more repositories{' '}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Scrolling Container */}
            <div
              className="relative w-full"
              onMouseEnter={() => (isHovering.current = true)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Fade Masks */}
              <div className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent pointer-events-none"></div>

              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto hide-scrollbar pb-10 pt-4 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ scrollBehavior: 'auto' }}
              >
                {infiniteProjects.map((p, index) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={`${p.id}-${index}`}
                      onClick={(e) => {
                        if (!sliderRef.current) return;
                        if (
                          Math.abs(e.pageX - sliderRef.current.offsetLeft - startX.current) > 10
                        ) {
                          return;
                        }
                        setSelectedProject(p);
                      }}
                      className="w-[350px] flex-shrink-0 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all cursor-pointer group shadow-sm flex flex-col h-full whitespace-normal relative top-0 hover:-top-2"
                    >
                      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white mb-2 text-xl">
                        {p.title}
                      </h3>
                      <p className="text-blue-600 font-bold text-[10px] uppercase mb-4 tracking-wider">
                        {p.meta}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {p.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section
            id="experience"
            className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-12">
              Professional Experience
            </h2>
            <div className="space-y-16">
              <div className="relative pl-12 border-l-2 border-slate-100 dark:border-slate-800">
                <div className="timeline-dot"></div>
                <div className="flex flex-col md:flex-row md:justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                      Six Eleven Global Services
                    </h3>
                    <p className="text-blue-600 font-bold">
                      Customer Service Representative — Davao | 03/2024 – 06/2026
                    </p>
                  </div>
                </div>
                <ul className="text-slate-600 dark:text-slate-400 space-y-4 text-base list-disc pl-5">
                  <li>
                    Trained new team members on how to use platforms, handle issues, and meet quality goals; recognized as a top performer.
                  </li>
                  <li>
                    Acted as the main contact for customers, ensuring all accounts were handled quickly and professionally.
                  </li>
                  <li>
                    Created clear spreadsheets and charts to track performance and important monthly goals.
                  </li>
                  <li>
                    Organized invoice records and checked payments to make sure everything was accurate.
                  </li>
                </ul>
              </div>

              <div className="relative pl-12 border-l-2 border-slate-100 dark:border-slate-800">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-950 shadow-sm"></div>
                <div className="flex flex-col md:flex-row md:justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                      Tempestas ESports
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide text-xs">
                      Administrative Support — Davao | 12/2020 – 12/2022
                    </p>
                  </div>
                </div>
                <ul className="text-slate-600 dark:text-slate-400 space-y-4 text-base list-disc pl-5">
                  <li>
                    Handled daily administrative tasks and kept important team spreadsheets up-to-date.
                  </li>
                  <li>
                    Simplified reporting processes, making data tracking faster and more accurate.
                  </li>
                  <li>
                    Helped customers through chat and email, providing quick and polite solutions.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education, Extra Info, & Contact */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="space-y-12">
              <section
                id="education"
                className="bg-blue-600 rounded-[2rem] p-10 text-white shadow-xl"
              >
                <h3 className="text-white/60 font-extrabold text-xs uppercase mb-4 tracking-widest">
                  Education
                </h3>
                <h4 className="text-2xl font-extrabold">Bachelor of IT</h4>
                <p className="text-white/80 font-bold">St. John Paul II College of Davao</p>
                <p className="text-white/60 text-sm italic">03/2020 – 11/2023</p>
              </section>

              <section
                id="training"
                className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-10 text-white border border-white/5"
              >
                <h3 className="text-white/30 font-extrabold text-xs uppercase mb-6 tracking-widest">
                  Certifications & Training
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-lg">Outlier AI Training</h4>
                    <p className="text-white/40 text-xs font-bold uppercase mb-2">
                      Prompt Engineering & AI Evaluation • 2023 – 2024
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-extrabold text-lg">Microsoft 365 Developer</h4>
                    <p className="text-white/40 text-xs font-bold uppercase mb-2">
                      Fundamentals • 2023 – 2024
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="font-extrabold text-lg text-white">WordCamp Davao</h4>
                    <p className="text-white/40 text-xs font-bold uppercase mb-2">
                      Participant • 2023
                    </p>
                  </div>
                </div>
              </section>

              <section
                id="extra"
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 shadow-sm"
              >
                <div>
                  <h3 className="text-slate-400 dark:text-white/30 font-extrabold text-xs uppercase mb-4 tracking-widest">
                    Languages
                  </h3>
                  <ul className="text-sm space-y-2 font-bold dark:text-slate-300">
                    <li>🇵🇭 Filipino</li>
                    <li>🇺🇸 English</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-slate-400 dark:text-white/30 font-extrabold text-xs uppercase mb-4 tracking-widest">
                    Interests
                  </h3>
                  <ul className="text-sm space-y-2 font-bold dark:text-slate-300">
                    <li>Gaming</li>
                    <li>Hiking</li>
                    <li>Motorcycles</li>
                    <li>Music</li>
                    <li>Movies</li>
                  </ul>
                </div>
              </section>
            </div>
            <ContactForm />
          </div>
        </main>
      </div>

      <footer className="max-w-5xl mx-auto px-4 mt-32 border-t border-slate-200 dark:border-slate-900 pt-12 pb-12 w-full">
        <div id="footer-top" className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left space-y-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-2xl">
              Jerwin Cruspero
            </h3>
            <div className="text-slate-500 dark:text-slate-400 font-medium space-y-1 text-sm">
              <p className="flex items-center gap-1.5 justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Davao City, Philippines
              </p>
              <p className="flex items-center gap-1.5 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                jcruspero3263@gmail.com
              </p>
            </div>
          </div>
          <div id="socials" className="flex gap-4">
            <a
              href="https://www.facebook.com/jerwincruspero26/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Profile"
              className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/mukung26"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-12 h-12 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/jerwin-cruspero-4a4228273"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-12 h-12 bg-[#0A66C2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 text-center text-slate-400 text-sm font-bold border-t border-slate-100 dark:border-slate-900 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p>© 2020 Jerwin Cruspero</p>
            {visitorCount !== null && (
              <button
                onClick={handleToggleVisitorDetails}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-3.5 py-1.5 rounded-full transition-all cursor-pointer select-none font-bold text-xs border border-transparent dark:border-slate-800"
                title="Click to view live traffic analytics"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <Users className="w-3.5 h-3.5 opacity-75" />
                <span>{visitorCount.toLocaleString()} {visitorCount === 1 ? 'Visitor' : 'Visitors'}</span>
                {showVisitorDetails ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
            )}
          </div>

          {showVisitorDetails && (
            <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl text-left animate-fade-in">
              {!isAdminAuthenticated ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-blue-55 dark:bg-blue-950/40 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 border border-blue-100/10 shadow-sm">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-slate-850 dark:text-white text-base">Passcode Required</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1 mb-6 max-w-sm">
                    This section is private. Enter your admin passcode to access live visitor analytics.
                  </p>
                  
                  <form onSubmit={handleAdminAuthSubmit} className="w-full max-w-xs flex flex-col gap-3">
                    <div>
                      <input
                        type="password"
                        placeholder="Enter admin passcode"
                        value={adminPasswordInput}
                        onChange={(e) => {
                          setAdminPasswordInput(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                        className="w-full px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        autoFocus
                      />
                      {authError && (
                        <p className="text-[11px] text-red-500 font-bold mt-2 text-left bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-100/10">⚠️ {authError}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Unlock Records
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>Visitor Traffic Analytics</span>
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">Real-time masked analytics from your Firestore</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={fetchVisitorLogs}
                        disabled={isLoadingLogs}
                        className="text-xs font-extrabold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isLoadingLogs ? (
                          <span className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></span>
                        ) : (
                          <span>Refresh</span>
                        )}
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {isLoadingLogs && visitorLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-3">
                      <span className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></span>
                      <p className="text-sm font-bold">Loading visitor records...</p>
                    </div>
                  ) : visitorLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <p className="text-sm font-bold">No visitor logs have been stored yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Summary Pills: Countries */}
                      <div>
                        <h5 className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Visits By Location</h5>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(
                            visitorLogs.reduce((acc, log) => {
                              const countryName = log.country || 'Unknown';
                              acc[countryName] = (acc[countryName] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          )
                            .sort((a, b) => (b[1] as number) - (a[1] as number))
                            .slice(0, 5)
                            .map(([country, count]) => (
                              <div
                                key={country}
                                className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-100/60 dark:border-slate-800"
                              >
                                <span className="text-sm">
                                  {getCountryFlag(country, visitorLogs.find(l => l.country === country)?.countryCode)}
                                </span>
                                <span>{country}</span>
                                <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">
                                  {count}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Log List */}
                      <div>
                        <h5 className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Recent Visits Log (Latest 30)</h5>
                        <div className="max-h-64 overflow-y-auto pr-1 space-y-2 border border-slate-100 dark:border-slate-850 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-950/20">
                          {visitorLogs.slice(0, 30).map((log, index) => {
                            const device = getDeviceDetails(log.userAgent);
                            const DeviceIcon = device.icon;
                            
                            return (
                              <div
                                key={log.id || index}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:shadow-sm transition-all"
                              >
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/15 flex items-center justify-center text-sm shrink-0">
                                    <span className="text-lg">
                                      {getCountryFlag(log.country, log.countryCode)}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-bold text-xs text-slate-850 dark:text-slate-200 truncate max-w-[200px]">
                                        {log.city && log.city !== 'Unknown' ? `${log.city}, ` : ''}
                                        {log.region && log.region !== 'Unknown' ? `${log.region}` : log.country || 'Unknown'}
                                      </p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate max-w-[200px]">
                                      {log.isp && log.isp !== 'Unknown' ? log.isp : 'Network Provider'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto text-[10px] sm:text-xs">
                                  <div className="text-left sm:text-right font-mono">
                                    <p className="text-slate-650 dark:text-slate-350 font-bold">{log.ip || 'Masked'}</p>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-start sm:justify-end">
                                      <DeviceIcon className="w-2.5 h-2.5 inline" />
                                      <span>{device.text}</span>
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5 font-bold font-mono text-slate-450 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{formatRelTime(log.timestamp)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div
          id="project-details-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2rem] p-10 animate-fade-in shadow-2xl relative border border-slate-100 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-2xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6">
              {React.createElement(selectedProject.icon, { className: 'w-10 h-10' })}
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              {selectedProject.title}
            </h3>
            <p className="text-blue-600 font-bold text-xs mb-6 uppercase tracking-widest">
              {selectedProject.meta}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {selectedProject.body}
            </p>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl mb-8 border border-blue-100/30">
              <p className="font-bold text-blue-700 dark:text-blue-400 uppercase text-xs mb-1">
                Impact
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{selectedProject.impact}</p>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold active:scale-95 shadow-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
