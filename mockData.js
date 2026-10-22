// ========================================================
// MOCK DATA ENGINE (No Emojis - Vector Icon Keys Only)
// ========================================================

const initialEmployee = {
  id: "EMP-0842",
  name: "กานต์ธิดา สุขเกษม",
  nickname: "เนย",
  position: "Senior UI/UX Designer",
  department: "Design & Product",
  initials: "กธ",
  points: 1450,
  streakDays: 5,
  checkInStatus: "not_checked_in", // "checked_in", "checked_out", "not_checked_in"
  todayCheckInTime: null,
  todayCheckOutTime: null,
  inOfficeArea: true
};

// Daily Attendance Records for Dashboard Table
const initialAttendanceRecords = [
  {
    id: "ATT-101",
    empId: "EMP-0842",
    empName: "กานต์ธิดา สุขเกษม",
    position: "Senior UI/UX Designer",
    department: "Design",
    date: "2026-10-22",
    checkIn: "08:45 น.",
    checkOut: "-",
    status: "ontime", // ontime, late, absent, leave
    location: "ม.บูรพา บางแสน (อาคารเฉลิมพระเกียรติ)",
    pointsEarned: 20,
    initials: "กธ"
  },
  {
    id: "ATT-102",
    empId: "EMP-0120",
    empName: "ธนกฤต มั่งมีทรัพย์",
    position: "Frontend Lead",
    department: "Engineering",
    date: "2026-10-22",
    checkIn: "08:30 น.",
    checkOut: "-",
    status: "ontime",
    location: "ม.บูรพา บางแสน (อาคารเฉลิมพระเกียรติ)",
    pointsEarned: 20,
    initials: "ธม"
  },
  {
    id: "ATT-103",
    empId: "EMP-0315",
    empName: "พิมพ์ชนก วัฒนาศิลป์",
    position: "Product Manager",
    department: "Product",
    date: "2026-10-22",
    checkIn: "09:18 น.",
    checkOut: "-",
    status: "late",
    location: "สำนักงานใหญ่ (ชั้น 12)",
    pointsEarned: 5,
    initials: "พว"
  },
  {
    id: "ATT-104",
    empId: "EMP-0418",
    empName: "วรเมธ ศิริโภคา",
    position: "Backend Developer",
    department: "Engineering",
    date: "2026-10-22",
    checkIn: "08:50 น.",
    checkOut: "-",
    status: "ontime",
    location: "WFH (Approved)",
    pointsEarned: 15,
    initials: "วศ"
  },
  {
    id: "ATT-105",
    empId: "EMP-0552",
    empName: "นลินทิพย์ พิสุทธิ์สุข",
    position: "HR Specialist",
    department: "People & HR",
    date: "2026-10-22",
    checkIn: "08:20 น.",
    checkOut: "-",
    status: "ontime",
    location: "สำนักงานใหญ่ (ชั้น 10)",
    pointsEarned: 20,
    initials: "นพ"
  },
  {
    id: "ATT-106",
    empId: "EMP-0610",
    empName: "ชัชวาล เลิศปรีชา",
    position: "Marketing Lead",
    department: "Marketing",
    date: "2026-10-22",
    checkIn: "-",
    checkOut: "-",
    status: "leave",
    location: "ลาป่วย (มีใบรับรองแพทย์)",
    pointsEarned: 0,
    initials: "ชล"
  },
  {
    id: "ATT-107",
    empId: "EMP-0722",
    empName: "อภิสิทธิ์ จิตอารี",
    position: "DevOps Engineer",
    department: "Engineering",
    date: "2026-10-22",
    checkIn: "09:35 น.",
    checkOut: "-",
    status: "late",
    location: "สำนักงานใหญ่ (ชั้น 14)",
    pointsEarned: 5,
    initials: "อจ"
  },
  {
    id: "ATT-108",
    empId: "EMP-0889",
    empName: "สุดาพร แก้วอำไพ",
    position: "Content Creator",
    department: "Marketing",
    date: "2026-10-22",
    checkIn: "-",
    checkOut: "-",
    status: "absent",
    location: "ยังไม่ลงเวลา",
    pointsEarned: 0,
    initials: "สก"
  }
];

// Full Employee Directory for Admin "รายชื่อพนักงาน" Page
const initialEmployeeDirectory = [
  { id: "EMP-0842", name: "กานต์ธิดา สุขเกษม", nickname: "เนย", department: "Design", position: "Senior UI/UX Designer", points: 1450, streak: 5, punctualityRate: 98, status: "active", initials: "กธ" },
  { id: "EMP-0120", name: "ธนกฤต มั่งมีทรัพย์", nickname: "กฤต", department: "Engineering", position: "Frontend Lead", points: 2100, streak: 12, punctualityRate: 99, status: "active", initials: "ธม" },
  { id: "EMP-0315", name: "พิมพ์ชนก วัฒนาศิลป์", nickname: "พิมพ์", department: "Product", position: "Product Manager", points: 880, streak: 1, punctualityRate: 88, status: "active", initials: "พว" },
  { id: "EMP-0418", name: "วรเมธ ศิริโภคา", nickname: "เมธ", department: "Engineering", position: "Backend Developer", points: 1320, streak: 7, punctualityRate: 94, status: "active", initials: "วศ" },
  { id: "EMP-0552", name: "นลินทิพย์ พิสุทธิ์สุข", nickname: "ฟ้า", department: "People & HR", position: "HR Specialist", points: 1950, streak: 15, punctualityRate: 100, status: "active", initials: "นพ" },
  { id: "EMP-0610", name: "ชัชวาล เลิศปรีชา", nickname: "บอล", department: "Marketing", position: "Marketing Lead", points: 720, streak: 0, punctualityRate: 85, status: "on_leave", initials: "ชล" },
  { id: "EMP-0722", name: "อภิสิทธิ์ จิตอารี", nickname: "อาร์ม", department: "Engineering", position: "DevOps Engineer", points: 1150, streak: 2, punctualityRate: 89, status: "active", initials: "อจ" },
  { id: "EMP-0889", name: "สุดาพร แก้วอำไพ", nickname: "กิ๊ฟ", department: "Marketing", position: "Content Creator", points: 640, streak: 0, punctualityRate: 80, status: "active", initials: "สก" },
  { id: "EMP-0912", name: "ธีรเดช เจริญผล", nickname: "โอ๊ค", department: "Engineering", position: "Mobile Developer", points: 1680, streak: 9, punctualityRate: 95, status: "active", initials: "ธจ" },
  { id: "EMP-0933", name: "วรรณิศา รุ่งโรจน์", nickname: "จอย", department: "Design", position: "Graphic Designer", points: 1240, streak: 6, punctualityRate: 92, status: "active", initials: "วร" }
];

// Rewards Catalog for "จัดการของรางวัล"
const initialRewards = [
  {
    id: "REW-01",
    title: "Starbucks E-Voucher 150B",
    category: "Food & Drinks",
    cost: 450,
    iconKey: "coffee",
    color: "#E2F6EA",
    accent: "#5CD8A6",
    stock: 12,
    claimedCount: 28,
    active: true,
    description: "คูปองเครื่องดื่มสตาร์บัคส์ ใช้ได้ทุกสาขาทั่วประเทศ"
  },
  {
    id: "REW-02",
    title: "วันลาพักร้อนพิเศษ 0.5 วัน",
    category: "Leave Privilege",
    cost: 1200,
    iconKey: "sun",
    color: "#EBF3FF",
    accent: "#6EB6FF",
    stock: 5,
    claimedCount: 14,
    active: true,
    description: "สิทธิ์ลางานเพิ่มพิเศษโดยไม่ถูกหักโควตาวันลาประจำปี"
  },
  {
    id: "REW-03",
    title: "GrabFood E-Coupon 200B",
    category: "Food & Drinks",
    cost: 600,
    iconKey: "utensils",
    color: "#FFF0E8",
    accent: "#FF9F7D",
    stock: 8,
    claimedCount: 42,
    active: true,
    description: "โค้ดส่วนลดสั่งอาหารมื้อเที่ยง GrabFood จัดส่งฟรี"
  },
  {
    id: "REW-04",
    title: "แก้วเก็บความเย็น 3D Pastel",
    category: "Merchandise",
    cost: 950,
    iconKey: "package",
    color: "#F6ECFF",
    accent: "#B39DDB",
    stock: 4,
    claimedCount: 19,
    active: true,
    description: "แก้ว Tumbler สแตนเลสเก็บความเย็น 12 ชั่วโมง ดีไซน์พิเศษ"
  },
  {
    id: "REW-05",
    title: "เบาะรองหลัง Office Syndrome",
    category: "Wellness",
    cost: 1500,
    iconKey: "heartPulse",
    color: "#FFF9E6",
    accent: "#FFD166",
    stock: 3,
    claimedCount: 8,
    active: true,
    description: "เบาะเมมโมรี่โฟมรองหลังเพื่อสรีระการทำงานที่ถูกสุขลักษณะ"
  }
];

// Work Rules & Shift Config for "กติกาและเกณฑ์คะแนน"
const initialWorkRules = {
  shiftStart: "08:30",
  shiftEnd: "17:30",
  graceMinutes: 15, // buffer late until 08:45
  cutoffAbsent: "10:00",
  pointsOnTime: 20,
  pointsWfh: 15,
  pointsLate: 5,
  pointsStreak5: 50,
  pointsStreak20: 300,
  requireGps: true,
  allowWfh: true,
  gpsRadiusMeters: 150
};

// Employee 7-Day History
const initialEmployeeHistory = [
  { date: "21 ต.ค. 2026", in: "08:42 น.", out: "18:05 น.", status: "ontime", points: "+20 PTS" },
  { date: "20 ต.ค. 2026", in: "08:48 น.", out: "18:12 น.", status: "ontime", points: "+20 PTS" },
  { date: "19 ต.ค. 2026", in: "08:35 น.", out: "18:00 น.", status: "ontime", points: "+20 PTS" },
  { date: "16 ต.ค. 2026", in: "09:12 น.", out: "18:30 น.", status: "late", points: "+5 PTS" },
  { date: "15 ต.ค. 2026", in: "08:40 น.", out: "17:55 น.", status: "ontime", points: "+20 PTS" }
];
