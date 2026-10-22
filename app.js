// ========================================================
// 3D PASTEL CLAYMORPHISM ENGINE (No Emojis - Vector Icons Only)
// Multi-Page & Full 5-Sidebar Views Manager
// ========================================================

// Application State
let currentEmployee = null;
let attendanceRecords = [];
let rewardsList = [];
let employeeHistory = [];
let employeeDirectory = [];
let workRules = null;
let isGpsInOffice = true;

// Search & Filter State
let currentSearchTerm = "";
let currentStatusFilter = "all";
let currentEmpSearchTerm = "";
let currentEmpDeptFilter = "all";

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadStoredOrInitialData();
  initLiveClock();

  // If on Employee page
  if (document.getElementById("empMobileName")) {
    renderMobileEmployeeProfile();
    renderMobileCheckInButton();
    renderMobileRewards();
    renderMobileHistory();
  }

  // If on Admin page
  if (document.getElementById("attendanceTableBody")) {
    renderAdminTable();
    updateAdminWidgets();
    renderAdminRewardsTable();
    renderAdminEmployeesTable();
    loadWorkRulesIntoForm();
  }

  initConfetti();
});

// Load Data from LocalStorage or mockData.js
function loadStoredOrInitialData() {
  const storedEmployee = localStorage.getItem("pastel_employee");
  const storedRecords = localStorage.getItem("pastel_attendance");
  const storedRewards = localStorage.getItem("pastel_rewards");
  const storedHistory = localStorage.getItem("pastel_history");
  const storedDirectory = localStorage.getItem("pastel_directory");
  const storedRules = localStorage.getItem("pastel_rules");

  currentEmployee = storedEmployee ? JSON.parse(storedEmployee) : { ...initialEmployee };
  attendanceRecords = storedRecords ? JSON.parse(storedRecords) : [...initialAttendanceRecords];
  rewardsList = storedRewards ? JSON.parse(storedRewards) : [...initialRewards];
  employeeHistory = storedHistory ? JSON.parse(storedHistory) : [...initialEmployeeHistory];
  employeeDirectory = storedDirectory ? JSON.parse(storedDirectory) : [...initialEmployeeDirectory];
  workRules = storedRules ? JSON.parse(storedRules) : { ...initialWorkRules };
  
  isGpsInOffice = currentEmployee.inOfficeArea ?? true;
}

function saveDataToStorage() {
  localStorage.setItem("pastel_employee", JSON.stringify(currentEmployee));
  localStorage.setItem("pastel_attendance", JSON.stringify(attendanceRecords));
  localStorage.setItem("pastel_rewards", JSON.stringify(rewardsList));
  localStorage.setItem("pastel_history", JSON.stringify(employeeHistory));
  localStorage.setItem("pastel_directory", JSON.stringify(employeeDirectory));
  localStorage.setItem("pastel_rules", JSON.stringify(workRules));
}

function resetMockData() {
  if (confirm("ต้องการรีเซ็ตข้อมูล Mockup ทั้งหมดกลับสู่ค่าเริ่มต้นหรือไม่?")) {
    localStorage.clear();
    loadStoredOrInitialData();

    if (document.getElementById("empMobileName")) {
      renderMobileEmployeeProfile();
      renderMobileCheckInButton();
      renderMobileRewards();
      renderMobileHistory();
    }
    if (document.getElementById("attendanceTableBody")) {
      renderAdminTable();
      updateAdminWidgets();
      renderAdminRewardsTable();
      renderAdminEmployeesTable();
      loadWorkRulesIntoForm();
    }

    showToast("รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว", ICONS.refresh);
  }
}

// ========================================================
// ⏰ LIVE REAL-TIME CLOCK
// ========================================================
function initLiveClock() {
  const updateClock = () => {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    
    const timeStr = `${hours}:${minutes}:${seconds}`;
    const shortTimeStr = `${hours}:${minutes}`;

    const daysTh = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
    const monthsTh = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    const dayName = daysTh[now.getDay()];
    const dateNum = now.getDate();
    const monthName = monthsTh[now.getMonth()];
    const yearTh = now.getFullYear() + 543;

    const fullDateTh = `${dayName}ที่ ${dateNum} ${monthName} ${yearTh}`;

    const mobileClockBig = document.getElementById("mobileClockBig");
    if (mobileClockBig) mobileClockBig.textContent = timeStr;

    const mobileDateBig = document.getElementById("mobileDateBig");
    if (mobileDateBig) mobileDateBig.textContent = fullDateTh;

    const phoneStatusClock = document.getElementById("phoneStatusClock");
    if (phoneStatusClock) phoneStatusClock.textContent = shortTimeStr;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

// ========================================================
// MOBILE VIEW: EMPLOYEE & CHECK-IN
// ========================================================
function renderMobileEmployeeProfile() {
  const nameEl = document.getElementById("empMobileName");
  if (nameEl) nameEl.textContent = `${currentEmployee.name} (${currentEmployee.nickname})`;

  const initialsEl = document.getElementById("empInitialsText");
  if (initialsEl) initialsEl.textContent = currentEmployee.initials || "กธ";

  const pointEl = document.getElementById("mobilePointNumber");
  if (pointEl) pointEl.textContent = currentEmployee.points.toLocaleString();

  const rewardBal = document.getElementById("mobileRewardBalance");
  if (rewardBal) rewardBal.textContent = `${currentEmployee.points.toLocaleString()} PTS`;
}

function renderMobileCheckInButton() {
  const grandBtn = document.getElementById("btnGrandCheckin");
  const grandBtnText = document.getElementById("grandBtnText");
  const grandBtnIcon = document.getElementById("grandBtnIcon");
  const banner = document.getElementById("mobileCheckinBanner");

  if (!grandBtn) return;

  if (currentEmployee.checkInStatus === "checked_in") {
    grandBtn.className = "btn-3d-grand btn-checkout";
    if (grandBtnIcon) grandBtnIcon.innerHTML = ICONS.checkOut;
    if (grandBtnText) grandBtnText.textContent = "บันทึกออกงาน";
    if (banner) {
      banner.className = "checkin-status-banner";
      banner.innerHTML = `<span class="icon-slot-xs">${ICONS.statusDotGreen}</span> เข้างานแล้วเวลา <strong>${currentEmployee.todayCheckInTime}</strong>`;
    }
  } else if (currentEmployee.checkInStatus === "checked_out") {
    grandBtn.className = "btn-3d-grand btn-checkin";
    if (grandBtnIcon) grandBtnIcon.innerHTML = ICONS.sparkle;
    if (grandBtnText) grandBtnText.textContent = "ลงเวลาครบแล้ว";
    grandBtn.disabled = true;
    grandBtn.style.opacity = "0.75";
    if (banner) {
      banner.className = "checkin-status-banner";
      banner.innerHTML = `<span class="icon-slot-xs">${ICONS.sparkle}</span> ออกงานแล้วเวลา <strong>${currentEmployee.todayCheckOutTime}</strong>`;
    }
  } else {
    grandBtn.className = "btn-3d-grand btn-checkin";
    if (grandBtnIcon) grandBtnIcon.innerHTML = ICONS.checkIn;
    if (grandBtnText) grandBtnText.textContent = "บันทึกเข้างาน";
    grandBtn.disabled = false;
    grandBtn.style.opacity = "1";
    if (banner) {
      banner.className = "checkin-status-banner";
      banner.innerHTML = `<span class="icon-slot-xs">${ICONS.sparkle}</span> กะเวลาทำงานปกติ (08:30 - 17:30 น.)`;
    }
  }
}

function handleMobileCheckInClick() {
  const grandBtn = document.getElementById("btnGrandCheckin");
  if (!grandBtn) return;

  grandBtn.classList.add("is-pressing");
  setTimeout(() => grandBtn.classList.remove("is-pressing"), 200);

  play3dBeepSound(currentEmployee.checkInStatus === "checked_in" ? 440 : 660);

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTimeStr = `${hours}:${minutes} น.`;

  if (currentEmployee.checkInStatus === "not_checked_in") {
    currentEmployee.checkInStatus = "checked_in";
    currentEmployee.todayCheckInTime = currentTimeStr;
    const earnedPoints = isGpsInOffice ? (workRules?.pointsOnTime || 20) : (workRules?.pointsWfh || 15);
    currentEmployee.points += earnedPoints;

    triggerConfetti();

    const existingRecIndex = attendanceRecords.findIndex(r => r.empId === currentEmployee.id);
    const locName = isGpsInOffice ? "ม.บูรพา บางแสน (อาคารเฉลิมพระเกียรติ)" : "WFH / นอกพื้นที่มหาวิทยาลัย";

    if (existingRecIndex !== -1) {
      attendanceRecords[existingRecIndex].checkIn = currentTimeStr;
      attendanceRecords[existingRecIndex].status = "ontime";
      attendanceRecords[existingRecIndex].location = locName;
      attendanceRecords[existingRecIndex].pointsEarned = earnedPoints;
    } else {
      attendanceRecords.unshift({
        id: `ATT-${Date.now().toString().slice(-4)}`,
        empId: currentEmployee.id,
        empName: currentEmployee.name,
        position: currentEmployee.position,
        department: currentEmployee.department,
        date: "2026-10-22",
        checkIn: currentTimeStr,
        checkOut: "-",
        status: "ontime",
        location: locName,
        pointsEarned: earnedPoints,
        initials: currentEmployee.initials || "กธ"
      });
    }

    employeeHistory.unshift({
      date: "วันนี้ (22 ต.ค. 2026)",
      in: currentTimeStr,
      out: "-",
      status: "ontime",
      points: `+${earnedPoints} PTS`
    });

    saveDataToStorage();
    renderMobileEmployeeProfile();
    renderMobileCheckInButton();
    renderMobileHistory();

    showToast(`บันทึกเข้างานสำเร็จเวลา ${currentTimeStr} (+${earnedPoints} PTS)`, ICONS.sparkle);

  } else if (currentEmployee.checkInStatus === "checked_in") {
    currentEmployee.checkInStatus = "checked_out";
    currentEmployee.todayCheckOutTime = currentTimeStr;

    const existingRec = attendanceRecords.find(r => r.empId === currentEmployee.id);
    if (existingRec) {
      existingRec.checkOut = currentTimeStr;
    }

    if (employeeHistory.length > 0) {
      employeeHistory[0].out = currentTimeStr;
    }

    saveDataToStorage();
    renderMobileCheckInButton();
    renderMobileHistory();

    showToast(`บันทึกเวลาออกงานสำเร็จ ${currentTimeStr}`, ICONS.home);
  }
}

// GPS / Location Simulation Toggle
function toggleGpsSimulation() {
  isGpsInOffice = !isGpsInOffice;
  currentEmployee.inOfficeArea = isGpsInOffice;

  const dot = document.getElementById("gpsDotIndicator");
  const label = document.getElementById("gpsTextLabel");
  const locDesc = document.getElementById("locStatusDesc");

  if (isGpsInOffice) {
    if (dot) dot.innerHTML = ICONS.statusDotGreen;
    if (label) label.textContent = "GPS: อยู่ในออฟฟิศ";
    if (locDesc) locDesc.textContent = "คุณอยู่ในพื้นที่ออฟฟิศแล้ว (ชั้น 14)";
    showToast("พิกัด GPS: ยืนยันตำแหน่งในออฟฟิศ", ICONS.pin);
  } else {
    if (dot) dot.innerHTML = ICONS.statusDotYellow;
    if (label) label.textContent = "GPS: นอกออฟฟิศ (WFH)";
    if (locDesc) locDesc.textContent = "อยู่นอกพื้นที่ออฟฟิศ (บันทึกเป็น WFH)";
    showToast("พิกัด GPS: อยู่นอกพื้นที่ (โหมด WFH)", ICONS.pin);
  }
}

// Tab Switching in Mobile View
function switchMobileTab(tab) {
  const tabs = ["home", "rewards", "history"];
  tabs.forEach(t => {
    const pane = document.getElementById(`mobilePane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const btn = document.getElementById(`navBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (pane) pane.classList.toggle("active", t === tab);
    if (btn) btn.classList.toggle("active", t === tab);
  });
  const appBody = document.querySelector('.mobile-app-body');
  if (appBody) {
    appBody.scrollTop = 0;
  }
}

// Render Rewards in Mobile View
function renderMobileRewards() {
  const container = document.getElementById("mobileRewardsContainer");
  if (!container) return;

  container.innerHTML = rewardsList.filter(r => r.active !== false).map(item => {
    const iconSvg = ICONS[item.iconKey] || ICONS.gift;
    return `
      <div class="mobile-reward-item">
        <div class="reward-vector-box" style="background:${item.color};">
          ${iconSvg}
        </div>
        <div class="reward-text-info">
          <div class="reward-title-txt">${item.title}</div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin: 2px 0;">${item.description}</div>
          <div class="reward-cost-tag">
            ${ICONS.starSolid}
            <span>${item.cost.toLocaleString()} PTS (คงเหลือ ${item.stock})</span>
          </div>
        </div>
        <button type="button" class="btn-redeem-mini" onclick="redeemReward('${item.id}')">
          แลกสิทธิ์
        </button>
      </div>
    `;
  }).join("");
}

function redeemReward(rewardId) {
  const reward = rewardsList.find(r => r.id === rewardId);
  if (!reward) return;

  if (currentEmployee.points < reward.cost) {
    showToast(`คะแนนไม่พอ ต้องการอีก ${(reward.cost - currentEmployee.points).toLocaleString()} PTS`, ICONS.clockAlert);
    return;
  }

  if (reward.stock <= 0) {
    showToast("ขออภัย รายการของรางวัลนี้หมดแล้ว", ICONS.clockAlert);
    return;
  }

  currentEmployee.points -= reward.cost;
  reward.stock -= 1;
  reward.claimedCount = (reward.claimedCount || 0) + 1;
  saveDataToStorage();

  triggerConfetti();
  play3dBeepSound(880);

  renderMobileEmployeeProfile();
  renderMobileRewards();
  showToast(`แลก "${reward.title}" สำเร็จแล้ว`, ICONS.gift);
}

// Render History in Mobile View
function renderMobileHistory() {
  const container = document.getElementById("mobileHistoryContainer");
  if (!container) return;

  container.innerHTML = employeeHistory.map(item => {
    const isLate = item.status === "late";
    const statusBg = isLate ? "var(--yellow-light)" : "var(--mint-light)";
    const statusColor = isLate ? "var(--yellow-shadow)" : "var(--mint-shadow)";
    const statusText = isLate ? "มาสาย" : "ตรงเวลา";
    const dotSvg = isLate ? ICONS.statusDotYellow : ICONS.statusDotGreen;

    return `
      <div class="history-item-clay">
        <div>
          <div style="font-size:0.86rem; font-weight:700; color:#1E293B;">${item.date}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
            เข้า: <strong>${item.in}</strong> | ออก: <strong>${item.out}</strong>
          </div>
        </div>
        <div style="text-align:right;">
          <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.72rem; font-weight:700; background:${statusBg}; color:${statusColor}; padding:2px 8px; border-radius:999px;">
            ${dotSvg} ${statusText}
          </span>
          <div style="font-size:0.78rem; font-weight:700; color:#D97706; margin-top:3px;">${item.points}</div>
        </div>
      </div>
    `;
  }).join("");
}

// ========================================================
// 💻 DESKTOP ADMIN: 5 SIDEBAR VIEWS SWITCHER
// ========================================================
function switchAdminSection(sectionName, btnEl) {
  // Update sidebar active buttons
  document.querySelectorAll(".sidebar-menu-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");

  // Hide all sections, show target section
  const sections = ["dashboard", "rules", "rewards", "employees", "reports"];
  sections.forEach(s => {
    const viewEl = document.getElementById(`adminView${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (viewEl) {
      viewEl.classList.toggle("active", s === sectionName);
    }
  });

  // Trigger view-specific re-renders
  if (sectionName === "dashboard") {
    renderAdminTable();
    updateAdminWidgets();
  } else if (sectionName === "rewards") {
    renderAdminRewardsTable();
  } else if (sectionName === "employees") {
    renderAdminEmployeesTable();
  } else if (sectionName === "rules") {
    loadWorkRulesIntoForm();
  }

  showToast(`สลับไปยังหน้า ${getSectionThaiTitle(sectionName)}`, ICONS.dashboard);
}

function getSectionThaiTitle(name) {
  switch (name) {
    case "dashboard": return "แดชบอร์ด";
    case "rules": return "กติกาและเกณฑ์คะแนน";
    case "rewards": return "จัดการของรางวัล";
    case "employees": return "รายชื่อพนักงาน";
    case "reports": return "สรุปรายงาน";
    default: return "";
  }
}

// ========================================================
// VIEW 1: แดชบอร์ด (Dashboard Table & CRUD)
// ========================================================
function renderAdminTable() {
  const tbody = document.getElementById("attendanceTableBody");
  if (!tbody) return;

  let filtered = [...attendanceRecords];

  if (currentSearchTerm) {
    const term = currentSearchTerm.toLowerCase();
    filtered = filtered.filter(r => 
      r.empName.toLowerCase().includes(term) ||
      r.empId.toLowerCase().includes(term) ||
      r.department.toLowerCase().includes(term)
    );
  }

  if (currentStatusFilter !== "all") {
    filtered = filtered.filter(r => r.status === currentStatusFilter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:36px; color:var(--text-muted);">
          <div style="margin-bottom:8px;">${ICONS.search}</div>
          ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    let statusClass = "ontime";
    let statusLabel = "ตรงเวลา";
    let dotIcon = ICONS.statusDotGreen;

    if (r.status === "late") {
      statusClass = "late";
      statusLabel = "มาสาย";
      dotIcon = ICONS.statusDotYellow;
    } else if (r.status === "absent") {
      statusClass = "absent";
      statusLabel = "ขาดงาน";
      dotIcon = ICONS.statusDotRed;
    } else if (r.status === "leave") {
      statusClass = "leave";
      statusLabel = "ลางาน";
      dotIcon = ICONS.statusDotBlue;
    }

    const initials = r.initials || r.empName.slice(0, 2);

    return `
      <tr>
        <td>
          <div class="emp-table-cell">
            <div class="emp-table-avatar-vector">
              <span>${initials}</span>
            </div>
            <div>
              <span class="emp-table-name">${r.empName}</span>
              <span class="emp-table-pos">${r.empId} • ${r.position || "Employee"}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight:600; color:#4B5563;">${r.department}</span>
        </td>
        <td><strong style="color:#1E293B;">${r.checkIn}</strong></td>
        <td><span style="color:#64748B;">${r.checkOut}</span></td>
        <td>
          <span class="status-pill-tag ${statusClass}">
            ${dotIcon}
            <span>${statusLabel}</span>
          </span>
        </td>
        <td>
          <span style="font-size:0.84rem; color:#475569; display:inline-flex; align-items:center; gap:4px;">
            ${ICONS.pin} ${r.location}
          </span>
        </td>
        <td>
          <span class="points-gain-badge">+${r.pointsEarned} PTS</span>
        </td>
        <td>
          <div class="action-buttons-group" style="justify-content:center;">
            <button type="button" class="btn-3d-action btn-yellow-edit" onclick="openEditAttendanceModal('${r.id}')" title="แก้ไขบันทึก">
              ${ICONS.edit} <span>แก้ไข</span>
            </button>
            <button type="button" class="btn-3d-action btn-red-delete" onclick="handleDeleteAttendance('${r.id}')" title="ลบข้อมูล">
              ${ICONS.trash} <span>ลบ</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateAdminWidgets() {
  const onTimeCount = attendanceRecords.filter(r => r.status === "ontime").length;
  const lateCount = attendanceRecords.filter(r => r.status === "late").length;
  const absentOrLeaveCount = attendanceRecords.filter(r => r.status === "absent" || r.status === "leave").length;
  const totalPoints = attendanceRecords.reduce((sum, r) => sum + (Number(r.pointsEarned) || 0), 0);

  const statPres = document.getElementById("statPresentCount");
  const statLt = document.getElementById("statLateCount");
  const statAb = document.getElementById("statAbsentCount");
  const statPts = document.getElementById("statPointsIssued");

  if (statPres) statPres.textContent = onTimeCount;
  if (statLt) statLt.textContent = lateCount;
  if (statAb) statAb.textContent = absentOrLeaveCount;
  if (statPts) statPts.textContent = `+${totalPoints}`;
}

function handleTableSearch(val) {
  currentSearchTerm = val;
  renderAdminTable();
}

function handleStatusFilter(val) {
  currentStatusFilter = val;
  renderAdminTable();
}

// Attendance Modal CRUD
function openAddAttendanceModal() {
  const titleText = document.getElementById("modalTitleText");
  const iconSlot = document.getElementById("modalActionIconSlot");
  if (titleText) titleText.textContent = "เพิ่มบันทึกการลงเวลาพนักงาน";
  if (iconSlot) iconSlot.innerHTML = ICONS.plus;

  document.getElementById("attendanceForm").reset();
  document.getElementById("formRecordId").value = "";
  document.getElementById("formCheckIn").value = "08:45 น.";
  document.getElementById("formCheckOut").value = "-";
  document.getElementById("formLocation").value = "ม.บูรพา บางแสน (อาคารเฉลิมพระเกียรติ)";
  document.getElementById("formPoints").value = "20";
  document.getElementById("attendanceModal").classList.add("open");
}

function openEditAttendanceModal(recordId) {
  const rec = attendanceRecords.find(r => r.id === recordId);
  if (!rec) return;

  const titleText = document.getElementById("modalTitleText");
  const iconSlot = document.getElementById("modalActionIconSlot");
  if (titleText) titleText.textContent = "แก้ไขบันทึกการลงเวลา";
  if (iconSlot) iconSlot.innerHTML = ICONS.edit;

  document.getElementById("formRecordId").value = rec.id;
  document.getElementById("formEmpName").value = rec.empName;
  document.getElementById("formDepartment").value = rec.department;
  document.getElementById("formStatus").value = rec.status;
  document.getElementById("formCheckIn").value = rec.checkIn;
  document.getElementById("formCheckOut").value = rec.checkOut;
  document.getElementById("formLocation").value = rec.location;
  document.getElementById("formPoints").value = rec.pointsEarned;
  
  document.getElementById("attendanceModal").classList.add("open");
}

function closeAttendanceModal() {
  document.getElementById("attendanceModal").classList.remove("open");
}

function handleAttendanceFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("formRecordId").value;
  const name = document.getElementById("formEmpName").value.trim();
  const dept = document.getElementById("formDepartment").value;
  const status = document.getElementById("formStatus").value;
  const checkIn = document.getElementById("formCheckIn").value.trim() || "-";
  const checkOut = document.getElementById("formCheckOut").value.trim() || "-";
  const location = document.getElementById("formLocation").value.trim() || "สำนักงาน";
  const points = parseInt(document.getElementById("formPoints").value, 10) || 0;

  if (id) {
    const index = attendanceRecords.findIndex(r => r.id === id);
    if (index !== -1) {
      attendanceRecords[index] = {
        ...attendanceRecords[index],
        empName: name,
        department: dept,
        status: status,
        checkIn: checkIn,
        checkOut: checkOut,
        location: location,
        pointsEarned: points
      };
      showToast("แก้ไขข้อมูลบันทึกเวลาเรียบร้อยแล้ว", ICONS.edit);
    }
  } else {
    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      empName: name,
      position: "Specialist",
      department: dept,
      date: "2026-10-22",
      checkIn: checkIn,
      checkOut: checkOut,
      status: status,
      location: location,
      pointsEarned: points,
      initials: name.slice(0, 2)
    };
    attendanceRecords.unshift(newRecord);
    showToast(`เพิ่มบันทึกเวลาของ ${name} สำเร็จ`, ICONS.plus);
  }

  saveDataToStorage();
  closeAttendanceModal();
  renderAdminTable();
  updateAdminWidgets();
}

function handleDeleteAttendance(recordId) {
  const rec = attendanceRecords.find(r => r.id === recordId);
  const name = rec ? rec.empName : "รายการนี้";
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบประวัติของ "${name}"?`)) {
    attendanceRecords = attendanceRecords.filter(r => r.id !== recordId);
    saveDataToStorage();
    renderAdminTable();
    updateAdminWidgets();
    showToast(`ลบข้อมูลของ ${name} เรียบร้อยแล้ว`, ICONS.trash);
  }
}

// ========================================================
// VIEW 2: กติกาและเกณฑ์คะแนน (Work Rules Engine)
// ========================================================
function loadWorkRulesIntoForm() {
  if (!workRules) return;
  const shiftStart = document.getElementById("ruleShiftStart");
  const shiftEnd = document.getElementById("ruleShiftEnd");
  const graceMinutes = document.getElementById("ruleGraceMinutes");
  const cutoffAbsent = document.getElementById("ruleCutoffAbsent");
  const pointsOnTime = document.getElementById("rulePointsOnTime");
  const pointsWfh = document.getElementById("rulePointsWfh");
  const pointsLate = document.getElementById("rulePointsLate");
  const pointsStreak5 = document.getElementById("rulePointsStreak5");
  const pointsStreak20 = document.getElementById("rulePointsStreak20");
  const gpsRadius = document.getElementById("ruleGpsRadius");
  const requireGps = document.getElementById("ruleRequireGps");
  const allowWfh = document.getElementById("ruleAllowWfh");

  if (shiftStart) shiftStart.value = workRules.shiftStart || "08:30";
  if (shiftEnd) shiftEnd.value = workRules.shiftEnd || "17:30";
  if (graceMinutes) graceMinutes.value = workRules.graceMinutes || 15;
  if (cutoffAbsent) cutoffAbsent.value = workRules.cutoffAbsent || "10:00";
  if (pointsOnTime) pointsOnTime.value = workRules.pointsOnTime || 20;
  if (pointsWfh) pointsWfh.value = workRules.pointsWfh || 15;
  if (pointsLate) pointsLate.value = workRules.pointsLate || 5;
  if (pointsStreak5) pointsStreak5.value = workRules.pointsStreak5 || 50;
  if (pointsStreak20) pointsStreak20.value = workRules.pointsStreak20 || 300;
  if (gpsRadius) gpsRadius.value = workRules.gpsRadiusMeters || 150;
  if (requireGps) requireGps.checked = workRules.requireGps ?? true;
  if (allowWfh) allowWfh.checked = workRules.allowWfh ?? true;
}

function saveWorkRulesSettings() {
  workRules = {
    shiftStart: document.getElementById("ruleShiftStart")?.value || "08:30",
    shiftEnd: document.getElementById("ruleShiftEnd")?.value || "17:30",
    graceMinutes: parseInt(document.getElementById("ruleGraceMinutes")?.value, 10) || 15,
    cutoffAbsent: document.getElementById("ruleCutoffAbsent")?.value || "10:00",
    pointsOnTime: parseInt(document.getElementById("rulePointsOnTime")?.value, 10) || 20,
    pointsWfh: parseInt(document.getElementById("rulePointsWfh")?.value, 10) || 15,
    pointsLate: parseInt(document.getElementById("rulePointsLate")?.value, 10) || 5,
    pointsStreak5: parseInt(document.getElementById("rulePointsStreak5")?.value, 10) || 50,
    pointsStreak20: parseInt(document.getElementById("rulePointsStreak20")?.value, 10) || 300,
    gpsRadiusMeters: parseInt(document.getElementById("ruleGpsRadius")?.value, 10) || 150,
    requireGps: document.getElementById("ruleRequireGps")?.checked ?? true,
    allowWfh: document.getElementById("ruleAllowWfh")?.checked ?? true
  };

  saveDataToStorage();
  showToast("บันทึกการตั้งค่ากติกาและคะแนนเรียบร้อยแล้ว", ICONS.checkCircle);
}

// ========================================================
// VIEW 3: จัดการของรางวัล (Reward Management)
// ========================================================
function renderAdminRewardsTable() {
  const tbody = document.getElementById("adminRewardsTableBody");
  if (!tbody) return;

  const countEl = document.getElementById("statRewardCount");
  const claimedEl = document.getElementById("statClaimedCount");
  const stockEl = document.getElementById("statTotalStock");

  const totalStock = rewardsList.reduce((sum, r) => sum + (r.stock || 0), 0);
  const totalClaimed = rewardsList.reduce((sum, r) => sum + (r.claimedCount || 0), 0);

  if (countEl) countEl.textContent = rewardsList.length;
  if (claimedEl) claimedEl.textContent = totalClaimed;
  if (stockEl) stockEl.textContent = totalStock;

  tbody.innerHTML = rewardsList.map(r => {
    const iconSvg = ICONS[r.iconKey] || ICONS.gift;
    const isActive = r.active !== false;

    return `
      <tr>
        <td>
          <div class="emp-table-cell">
            <div class="reward-vector-box" style="background:${r.color}; width:38px; height:38px;">
              ${iconSvg}
            </div>
            <div>
              <span class="emp-table-name">${r.title}</span>
              <span class="emp-table-pos">${r.description || ""}</span>
            </div>
          </div>
        </td>
        <td><strong>${r.category}</strong></td>
        <td><span class="points-gain-badge">${r.cost.toLocaleString()} PTS</span></td>
        <td><strong style="color:#1E293B;">${r.stock}</strong> ชิ้น</td>
        <td><span style="color:#64748B;">${r.claimedCount || 0} ครั้ง</span></td>
        <td>
          <span class="status-pill-tag ${isActive ? 'ontime' : 'absent'}">
            ${isActive ? ICONS.statusDotGreen : ICONS.statusDotRed}
            <span>${isActive ? 'เปิดให้แลก' : 'ระงับชั่วคราว'}</span>
          </span>
        </td>
        <td>
          <div class="action-buttons-group" style="justify-content:center;">
            <button type="button" class="btn-3d-action btn-green-add" style="padding:6px 10px; font-size:0.76rem;" onclick="handleRestockReward('${r.id}')" title="เพิ่มสต็อก">
              ${ICONS.plus} เติม
            </button>
            <button type="button" class="btn-3d-action btn-yellow-edit" style="padding:6px 10px; font-size:0.76rem;" onclick="openEditRewardModal('${r.id}')" title="แก้ไข">
              ${ICONS.edit}
            </button>
            <button type="button" class="btn-3d-action btn-red-delete" style="padding:6px 10px; font-size:0.76rem;" onclick="handleDeleteReward('${r.id}')" title="ลบ">
              ${ICONS.trash}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function handleRestockReward(rewardId) {
  const reward = rewardsList.find(r => r.id === rewardId);
  if (!reward) return;
  const addCount = prompt(`ระบุจำนวนสต็อกที่ต้องการเพิ่มสำหรับ "${reward.title}":`, "5");
  if (addCount && !isNaN(addCount)) {
    reward.stock += parseInt(addCount, 10);
    saveDataToStorage();
    renderAdminRewardsTable();
    showToast(`เติมสต็อก "${reward.title}" เพิ่ม ${addCount} ชิ้นเรียบร้อย`, ICONS.gift);
  }
}

function openAddRewardModal() {
  document.getElementById("rewardModalTitle").textContent = "เพิ่มของรางวัลใหม่";
  document.getElementById("rewardForm").reset();
  document.getElementById("formRewardId").value = "";
  document.getElementById("rewardModal").classList.add("open");
}

function openEditRewardModal(rewardId) {
  const r = rewardsList.find(item => item.id === rewardId);
  if (!r) return;

  document.getElementById("rewardModalTitle").textContent = "แก้ไขของรางวัล";
  document.getElementById("formRewardId").value = r.id;
  document.getElementById("formRewardTitle").value = r.title;
  document.getElementById("formRewardCategory").value = r.category;
  document.getElementById("formRewardCost").value = r.cost;
  document.getElementById("formRewardStock").value = r.stock;
  document.getElementById("formRewardIcon").value = r.iconKey;
  document.getElementById("formRewardDesc").value = r.description || "";

  document.getElementById("rewardModal").classList.add("open");
}

function closeRewardModal() {
  document.getElementById("rewardModal").classList.remove("open");
}

function handleRewardFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("formRewardId").value;
  const title = document.getElementById("formRewardTitle").value.trim();
  const category = document.getElementById("formRewardCategory").value;
  const cost = parseInt(document.getElementById("formRewardCost").value, 10) || 500;
  const stock = parseInt(document.getElementById("formRewardStock").value, 10) || 5;
  const iconKey = document.getElementById("formRewardIcon").value;
  const desc = document.getElementById("formRewardDesc").value.trim();

  const colorMap = {
    coffee: "#E2F6EA",
    sun: "#EBF3FF",
    utensils: "#FFF0E8",
    package: "#F6ECFF",
    heartPulse: "#FFF9E6"
  };

  if (id) {
    const idx = rewardsList.findIndex(r => r.id === id);
    if (idx !== -1) {
      rewardsList[idx] = {
        ...rewardsList[idx],
        title,
        category,
        cost,
        stock,
        iconKey,
        color: colorMap[iconKey] || "#EDF3FE",
        description: desc
      };
      showToast(`แก้ไขของรางวัล "${title}" สำเร็จ`, ICONS.edit);
    }
  } else {
    const newRew = {
      id: `REW-${Date.now().toString().slice(-4)}`,
      title,
      category,
      cost,
      stock,
      iconKey,
      color: colorMap[iconKey] || "#EDF3FE",
      claimedCount: 0,
      active: true,
      description: desc
    };
    rewardsList.unshift(newRew);
    showToast(`เพิ่มของรางวัล "${title}" สำเร็จ`, ICONS.gift);
  }

  saveDataToStorage();
  closeRewardModal();
  renderAdminRewardsTable();
}

function handleDeleteReward(rewardId) {
  const r = rewardsList.find(item => item.id === rewardId);
  const name = r ? r.title : "รายการนี้";
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบของรางวัล "${name}"?`)) {
    rewardsList = rewardsList.filter(item => item.id !== rewardId);
    saveDataToStorage();
    renderAdminRewardsTable();
    showToast(`ลบของรางวัล "${name}" เรียบร้อย`, ICONS.trash);
  }
}

// ========================================================
// VIEW 4: รายชื่อพนักงาน (Employees Directory)
// ========================================================
function renderAdminEmployeesTable() {
  const tbody = document.getElementById("adminEmployeesTableBody");
  if (!tbody) return;

  const totalEl = document.getElementById("statEmpTotal");
  if (totalEl) totalEl.textContent = employeeDirectory.length;

  let filtered = [...employeeDirectory];

  if (currentEmpSearchTerm) {
    const term = currentEmpSearchTerm.toLowerCase();
    filtered = filtered.filter(e => 
      e.name.toLowerCase().includes(term) ||
      e.id.toLowerCase().includes(term) ||
      (e.nickname && e.nickname.toLowerCase().includes(term)) ||
      e.department.toLowerCase().includes(term)
    );
  }

  if (currentEmpDeptFilter !== "all") {
    filtered = filtered.filter(e => e.department === currentEmpDeptFilter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:36px; color:var(--text-muted);">
          <div style="margin-bottom:8px;">${ICONS.users}</div>
          ไม่พบรายชื่อพนักงานที่ตรงกับเงื่อนไข
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(emp => {
    const pRate = emp.punctualityRate || 95;
    let barClass = "high";
    if (pRate < 85) barClass = "low";
    else if (pRate < 92) barClass = "medium";

    const isActive = emp.status === "active";

    return `
      <tr>
        <td>
          <div class="emp-table-cell">
            <div class="emp-table-avatar-vector">
              <span>${emp.initials || emp.name.slice(0, 2)}</span>
            </div>
            <div>
              <span class="emp-table-name">${emp.name} (${emp.nickname || "-"})</span>
              <span class="emp-table-pos">${emp.id}</span>
            </div>
          </div>
        </td>
        <td>
          <div>
            <strong style="color:#1E293B;">${emp.department}</strong>
            <div style="font-size:0.75rem; color:var(--text-muted);">${emp.position}</div>
          </div>
        </td>
        <td><span class="points-gain-badge">${emp.points.toLocaleString()} PTS</span></td>
        <td><strong style="color:#C2410C;">${emp.streak} วัน</strong></td>
        <td>
          <div style="width:120px;">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:2px;">
              <span>อัตราตรงเวลา</span>
              <strong>${pRate}%</strong>
            </div>
            <div class="progress-bar-container"><div class="progress-bar-fill ${barClass}" style="width:${pRate}%;"></div></div>
          </div>
        </td>
        <td>
          <span class="status-pill-tag ${isActive ? 'ontime' : 'leave'}">
            ${isActive ? ICONS.statusDotGreen : ICONS.statusDotBlue}
            <span>${isActive ? 'ทำงานปกติ' : 'ลางาน'}</span>
          </span>
        </td>
        <td>
          <div class="action-buttons-group" style="justify-content:center;">
            <button type="button" class="btn-3d-action btn-yellow-edit" style="padding:6px 10px; font-size:0.76rem;" onclick="openEditEmployeeModal('${emp.id}')" title="แก้ไข">
              ${ICONS.edit}
            </button>
            <button type="button" class="btn-3d-action btn-red-delete" style="padding:6px 10px; font-size:0.76rem;" onclick="handleDeleteEmployee('${emp.id}')" title="ลบ">
              ${ICONS.trash}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function handleEmployeeSearch(val) {
  currentEmpSearchTerm = val;
  renderAdminEmployeesTable();
}

function handleEmployeeDeptFilter(val) {
  currentEmpDeptFilter = val;
  renderAdminEmployeesTable();
}

function openAddEmployeeModal() {
  document.getElementById("employeeModalTitle").textContent = "เพิ่มพนักงานใหม่";
  document.getElementById("employeeForm").reset();
  document.getElementById("formDirEmpId").value = "";
  document.getElementById("employeeModal").classList.add("open");
}

function openEditEmployeeModal(empId) {
  const emp = employeeDirectory.find(e => e.id === empId);
  if (!emp) return;

  document.getElementById("employeeModalTitle").textContent = "แก้ไขข้อมูลพนักงาน";
  document.getElementById("formDirEmpId").value = emp.id;
  document.getElementById("formDirName").value = emp.name;
  document.getElementById("formDirNickname").value = emp.nickname || "";
  document.getElementById("formDirDept").value = emp.department;
  document.getElementById("formDirPos").value = emp.position;
  document.getElementById("formDirPoints").value = emp.points;
  document.getElementById("formDirStatus").value = emp.status;

  document.getElementById("employeeModal").classList.add("open");
}

function closeEmployeeModal() {
  document.getElementById("employeeModal").classList.remove("open");
}

function handleEmployeeFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("formDirEmpId").value;
  const name = document.getElementById("formDirName").value.trim();
  const nickname = document.getElementById("formDirNickname").value.trim();
  const dept = document.getElementById("formDirDept").value;
  const pos = document.getElementById("formDirPos").value.trim() || "Specialist";
  const points = parseInt(document.getElementById("formDirPoints").value, 10) || 500;
  const status = document.getElementById("formDirStatus").value;

  if (id) {
    const idx = employeeDirectory.findIndex(e => e.id === id);
    if (idx !== -1) {
      employeeDirectory[idx] = {
        ...employeeDirectory[idx],
        name,
        nickname,
        department: dept,
        position: pos,
        points,
        status,
        initials: name.slice(0, 2)
      };
      showToast(`แก้ไขข้อมูลของ ${name} สำเร็จ`, ICONS.edit);
    }
  } else {
    const newEmp = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      nickname,
      department: dept,
      position: pos,
      points,
      streak: 0,
      punctualityRate: 100,
      status,
      initials: name.slice(0, 2)
    };
    employeeDirectory.unshift(newEmp);
    showToast(`เพิ่มพนักงาน ${name} สำเร็จ`, ICONS.users);
  }

  saveDataToStorage();
  closeEmployeeModal();
  renderAdminEmployeesTable();
}

function handleDeleteEmployee(empId) {
  const emp = employeeDirectory.find(e => e.id === empId);
  const name = emp ? emp.name : "รายการนี้";
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลพนักงาน "${name}"?`)) {
    employeeDirectory = employeeDirectory.filter(e => e.id !== empId);
    saveDataToStorage();
    renderAdminEmployeesTable();
    showToast(`ลบข้อมูล ${name} เรียบร้อย`, ICONS.trash);
  }
}

// ========================================================
// VIEW 5: สรุปรายงาน & EXPORT (Reports & Analytics)
// ========================================================
function exportReportData(format) {
  if (format === "csv") {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Employee Name,Department,Date,Check-In,Check-Out,Status,Points Earned\n";

    attendanceRecords.forEach(r => {
      csvContent += `"${r.empId}","${r.empName}","${r.department}","${r.date}","${r.checkIn}","${r.checkOut}","${r.status}",${r.pointsEarned}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PastelWork_Attendance_Report_Oct2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("ส่งออกไฟล์รายงาน CSV สำเร็จเรียบร้อย", ICONS.checkCircle);
  } else if (format === "pdf") {
    showToast("กำลังเตรียมเปิดหน้าต่างสำหรับพิมพ์รายงาน PDF...", ICONS.reports);
    setTimeout(() => {
      window.print();
    }, 600);
  }
}

// ========================================================
// 🔔 3D PASTEL TOAST NOTIFICATION
// ========================================================
let toastTimer = null;
function showToast(message, iconSvg = ICONS.sparkle) {
  const toast = document.getElementById("toastBubble");
  const msgEl = document.getElementById("toastMsg");
  const iconEl = document.getElementById("toastIconSlot");

  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.innerHTML = iconSvg;

  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ========================================================
// AUDIO FEEDBACK (Tactile 3D Soft Tone)
// ========================================================
function play3dBeepSound(frequency = 580) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (err) {
    // Ignore autoplay limits
  }
}

// ========================================================
// CONFETTI CANVAS EFFECT
// ========================================================
let confettiParticles = [];
let confettiCtx = null;
let isConfettiRunning = false;

function initConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  confettiCtx = canvas.getContext("2d");
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas || !confettiCtx) return;

  const colors = ["#5CD8A6", "#6EB6FF", "#FFB703", "#FF7575", "#B39DDB", "#FFE066"];
  confettiParticles = [];

  const originX = canvas.width / 2;
  const originY = canvas.height * 0.45;

  for (let i = 0; i < 65; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12
    });
  }

  if (!isConfettiRunning) {
    isConfettiRunning = true;
    requestAnimationFrame(renderConfettiFrame);
  }
}

function renderConfettiFrame() {
  if (!confettiCtx) return;
  const canvas = document.getElementById("confettiCanvas");
  confettiCtx.clearRect(0, 0, canvas.width, canvas.height);

  let activeParticles = 0;

  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.22;
    p.alpha -= 0.014;
    p.rotation += p.vRotation;

    if (p.alpha > 0) {
      activeParticles++;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(0, p.alpha);
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      confettiCtx.restore();
    }
  });

  if (activeParticles > 0) {
    requestAnimationFrame(renderConfettiFrame);
  } else {
    isConfettiRunning = false;
    confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
