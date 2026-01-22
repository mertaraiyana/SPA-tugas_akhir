/*************************************************
 * STATE (DATA APLIKASI)
 *************************************************/
let tasks = [
  { id: 1, judul: "Tugas Matematika", deadline: "2026-01-10", status: "Belum", catatan: "Bab 1-3 tentang integral" },
  { id: 2, judul: "Tugas Pemrograman", deadline: "2026-01-12", status: "Selesai", catatan: "Buat program kalkulator" }
];

let userProfile = {
  nama: "Mahasiswa",
  email: "xxyyzz@example.com",
  status: "Aktif",
  foto: "user.png"
};

/*************************************************
 * HELPER RENDER
 *************************************************/
function render(content) {
  document.getElementById("app").innerHTML = content;
}

/*************************************************
 * KOMPONEN UI (REUSABLE)
 *************************************************/

// Card
function Card(title, body) {
  return `
    <div class="card">
      <h3>${title}</h3>
      <div class="card-body">
        ${body}
      </div>
    </div>
  `;
}

// Button
function Button(label, onclick, type = "primary") {
  return `<button class="btn ${type}" onclick="${onclick}">${label}</button>`;
}

// Table Tugas dengan filter
function TaskTable(data, filterText = '', filterStatus = 'semua') {
  // Filter berdasarkan teks pencarian dan status
  let filtered = data.filter(t => {
    const matchText = t.judul.toLowerCase().includes(filterText.toLowerCase()) || 
                      t.catatan.toLowerCase().includes(filterText.toLowerCase());
    const matchStatus = filterStatus === 'semua' || t.status === filterStatus;
    return matchText && matchStatus;
  });

  if (filtered.length === 0) {
    return "<p>Tidak ada tugas yang sesuai dengan pencarian.</p>";
  }

  const rows = filtered.map(t => {
    const statusColor = t.status === 'Selesai' ? '#90EE90' : (t.status === 'Sedang Dikerjakan' ? '#FFD700' : '#FFB6C1');
    const statusBgColor = t.status === 'Selesai' ? 'background-color: #e8f5e9' : (t.status === 'Sedang Dikerjakan' ? 'background-color: #fff8e1' : 'background-color: #ffe0e6');
    
    return `
    <tr>
      <td>${t.judul}</td>
      <td>${t.deadline}</td>
      <td style="${statusBgColor}">
        <select class="status-select" onchange="changeTaskStatus(${t.id}, this.value)" style="border: none; background-color: transparent; color: #333; font-weight: 600; cursor: pointer; padding: 4px; border-radius: 4px;">
          <option value="Belum" ${t.status === 'Belum' ? 'selected' : ''}>Belum</option>
          <option value="Sedang Dikerjakan" ${t.status === 'Sedang Dikerjakan' ? 'selected' : ''}>Sedang Dikerjakan</option>
          <option value="Selesai" ${t.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
        </select>
      </td>
      <td>
        ${Button("Detail", `showDetail(${t.id})`)}
        ${Button("Hapus", `deleteTask(${t.id})`, "danger")}
      </td>
    </tr>
  `}).join("");

  return `
    <table class="table">
      <thead>
        <tr>
          <th>Judul</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// Form Tugas
function TaskForm() {
  return `
    <form onsubmit="addTask(event)">
      <label>Judul</label>
      <input name="judul" required />

      <label>Deadline</label>
      <input type="date" name="deadline" required />

      <label>Catatan (Detail Tugas)</label>
      <textarea name="catatan" rows="4" placeholder="Tambahkan detail atau catatan untuk tugas ini..."></textarea>

      <button class="btn primary" type="submit">Simpan</button>
    </form>
  `;
}

// Kalender Component
function CalendarComponent(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  
  let html = `
    <div class="calendar-header">
      <button class="calendar-nav" onclick="prevMonth()">‹</button>
      <h4>${monthNames[month]} ${year}</h4>
      <button class="calendar-nav" onclick="nextMonth()">›</button>
    </div>
    <table class="calendar-table">
      <thead>
        <tr>
  `;
  
  dayNames.forEach(day => {
    html += `<th>${day}</th>`;
  });
  
  html += `</tr></thead><tbody><tr>`;
  
  // Empty cells
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += `<td class="empty"></td>`;
  }
  
  // Days
  let currentDay = startingDayOfWeek;
  for (let day = 1; day <= daysInMonth; day++) {
    if (currentDay === 7) {
      html += `</tr><tr>`;
      currentDay = 0;
    }
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.deadline === dateStr);
    const hasTask = dayTasks.length > 0;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    
    html += `<td class="calendar-day ${isToday ? 'today' : ''} ${hasTask ? 'has-task' : ''}" onclick="showTasksOnDate('${dateStr}')" style="cursor: pointer;">
      <span>${day}</span>
      ${hasTask ? `<div class="task-indicator">${dayTasks.length}</div>` : ''}
    </td>`;
    
    currentDay++;
  }
  
  // Close last week
  while (currentDay > 0 && currentDay < 7) {
    html += `<td class="empty"></td>`;
    currentDay++;
  }
  
  html += `</tr></tbody></table>`;
  
  return html;
}

// Modal
function showModal(title, content) {
  document.getElementById("modal-root").innerHTML = `
    <div class="modal">
      <div class="modal-box">
        <h3>${title}</h3>
        ${content}
        <button class="btn" onclick="closeModal()">Tutup</button>
      </div>
    </div>
  `;
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

/*************************************************
 * HALAMAN (PAGES)
 *************************************************/

// Home
function renderHome() {
  render(`
    ${Card(
      "Home",
      `<p>Selamat datang di aplikasi <b>TaskMahasiswa</b>.</p>`
    )}
    
    <div class="menu-cards-grid">
      ${MenuCard(
        "📊 Dashboard",
        "Lihat ringkasan statistik tugas Anda. Dapatkan informasi jumlah tugas total, tugas yang sudah selesai, dan tugas yang masih belum dikerjakan.",
        "renderDashboard()"
      )}
      
      ${MenuCard(
        "✏️ Manajemen Tugas",
        "Kelola tugas Anda dengan mudah. Tambahkan tugas baru, lihat daftar tugas, ubah status, dan hapus tugas yang sudah tidak diperlukan.",
        "renderTasksList()"
      )}
      
      ${MenuCard(
        "📅 Kalender",
        "Visualisasikan tugas Anda dalam bentuk kalender. Klik pada tanggal untuk melihat detail tugas yang jatuh pada hari tersebut.",
        "renderCalendar()"
      )}
      
      ${MenuCard(
        "👤 Profil",
        "Kelola informasi profil Anda. Lihat dan edit data diri, email, dan status keaktifan akun Anda.",
        "renderProfile()"
      )}
    </div>
  `);
}

// Menu Card Component
function MenuCard(title, description, action) {
  return `
    <div class="menu-card" onclick="${action}">
      <h4>${title}</h4>
      <p>${description}</p>
      <span class="menu-card-arrow">→</span>
    </div>
  `;
}

// Dashboard
function renderDashboard() {
  const total = tasks.length;
  const selesai = tasks.filter(t => t.status === "Selesai").length;
  const belum = total - selesai;

  render(`
    ${Card("Total Tugas", `<h2>${total}</h2>`)}
    ${Card("Selesai", `<h2>${selesai}</h2>`)}
    ${Card("Belum Selesai", `<h2>${belum}</h2>`)}
  `);
}

// Manajemen Tugas - Form
function renderTasksForm() {
  render(
    Card("Tambah Tugas", TaskForm())
  );
}

// Manajemen Tugas - List
let currentFilterText = '';
let currentFilterStatus = 'semua';

function renderTasksList() {
  const filterSection = `
    <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
      <input 
        type="text" 
        id="search-input" 
        placeholder="Cari tugas berdasarkan judul atau catatan..." 
        style="flex: 1; min-width: 250px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;"
        onkeyup="filterTasks(this.value, document.getElementById('status-filter').value)"
      />
      <select 
        id="status-filter" 
        style="padding: 10px 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background-color: white; cursor: pointer;"
        onchange="filterTasks(document.getElementById('search-input').value, this.value)"
      >
        <option value="semua">Semua Status</option>
        <option value="Belum">Belum Dikerjakan</option>
        <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
        <option value="Selesai">Selesai</option>
      </select>
      <button 
        class="btn primary" 
        onclick="resetFilter()" 
        style="padding: 10px 20px;"
      >Reset</button>
    </div>
  `;
  
  render(
    Card("Daftar Tugas", filterSection + TaskTable(tasks, currentFilterText, currentFilterStatus))
  );
}

// Manajemen Tugas (deprecated - untuk backward compatibility)
function renderTasks() {
  render(`
    ${Card("Tambah Tugas", TaskForm())}
    ${Card("Daftar Tugas", TaskTable(tasks))}
  `);
}

// Kalender (placeholder)
function renderCalendar() {
  render(`
    <div class="card">
      <h3>Kalender Tugas</h3>
      <div class="card-body">
        ${CalendarComponent(currentCalendarYear, currentCalendarMonth)}
        <p style="margin-top: 20px; font-size: 12px; color: #666;">💡 Klik pada tanggal untuk melihat tugas yang jatuh pada hari tersebut</p>
      </div>
    </div>
  `);
}

// Tampilkan tugas berdasarkan tanggal di kalender
function showTasksOnDate(dateStr) {
  const dayTasks = tasks.filter(t => t.deadline === dateStr);
  
  if (dayTasks.length === 0) {
    showModal("Tugas - " + dateStr, "<p>Tidak ada tugas pada tanggal ini.</p>");
    return;
  }
  
  const formattedDate = new Date(dateStr).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let content = `<div style="max-height: 400px; overflow-y: auto;">`;
  
  dayTasks.forEach(task => {
    content += `
      <div style="border-left: 4px solid #667eea; padding: 12px; margin-bottom: 12px; background-color: #f9f9f9; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; color: #333;">${task.judul}</h4>
        <p style="margin: 4px 0; font-size: 13px;"><b>Status:</b> <span style="background-color: ${task.status === 'Selesai' ? '#90EE90' : '#FFB6C1'}; padding: 2px 8px; border-radius: 3px;">${task.status}</span></p>
        <p style="margin: 4px 0; font-size: 13px;"><b>Catatan:</b></p>
        <p style="margin: 4px 0; font-size: 12px; color: #666; white-space: pre-wrap; background-color: white; padding: 8px; border-radius: 3px;">${task.catatan || "(Tidak ada catatan)"}</p>
        <div style="margin-top: 8px;">
          ${Button("Edit Status", `updateTaskStatus(${task.id})`, "primary")}
          ${Button("Hapus", `deleteTask(${task.id})`, "danger")}
        </div>
      </div>
    `;
  });
  
  content += `</div>`;
  
  showModal("Tugas - " + formattedDate, content);
}

// Update status tugas
function updateTaskStatus(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  closeModal();
  
  showModal(
    "Update Status Tugas",
    `
    <p><b>Tugas:</b> ${task.judul}</p>
    <p style="margin-top: 15px;"><b>Ubah Status:</b></p>
    ${Button("Belum", `setTaskStatus(${id}, 'Belum')`, 'primary')}
    ${Button("Sedang Dikerjakan", `setTaskStatus(${id}, 'Sedang Dikerjakan')`, 'primary')}
    ${Button("Selesai", `setTaskStatus(${id}, 'Selesai')`, 'primary')}
    `
  );
}

function setTaskStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  task.status = status;
  closeModal();
  renderCalendar();
}

// Profil
function renderProfile() {
  render(`
    <div class="card">
      <h3>Profil Mahasiswa</h3>
      <div class="card-body">
        <div class="profile-container">
          <div class="profile-photo">
            <img src="${userProfile.foto}" alt="Foto Profil">
          </div>
          <div class="profile-info">
            <div class="info-row">
              <label>Nama</label>
              <p>${userProfile.nama}</p>
            </div>
            <div class="info-row">
              <label>Email</label>
              <p>${userProfile.email}</p>
            </div>
            <div class="info-row">
              <label>Status</label>
              <p><span class="status-badge">${userProfile.status}</span></p>
            </div>
            <button class="btn primary" onclick="showEditProfileModal()">Edit Profil</button>
          </div>
        </div>
      </div>
    </div>
  `);
}

/*************************************************
 * INTERAKSI / LOGIC
 *************************************************/

// Tambah tugas
function addTask(event) {
  event.preventDefault();

  const form = event.target;

  tasks.push({
    id: Date.now(),
    judul: form.judul.value,
    deadline: form.deadline.value,
    status: "Belum",
    catatan: form.catatan.value || ""
  });

  renderTasks();
}

// Detail tugas
function showDetail(id) {
  const task = tasks.find(t => t.id === id);

  if (!task) return;

  showModal(
    "Detail Tugas",
    `
    <p><b>Judul:</b> ${task.judul}</p>
    <p><b>Deadline:</b> ${task.deadline}</p>
    <p><b>Status:</b> ${task.status}</p>
    <p><b>Catatan:</b></p>
    <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; min-height: 50px; white-space: pre-wrap;">${task.catatan || "(Tidak ada catatan)"}</p>
    `
  );
}

// Hapus tugas
function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  showModal(
    "Konfirmasi",
    `
    <p>Hapus tugas <b>${task.judul}</b>?</p>
    ${Button("Ya, Hapus", `confirmDelete(${id})`, "danger")}
    `
  );
}

function confirmDelete(id) {
  tasks = tasks.filter(t => t.id !== id);
  closeModal();
  renderTasksList();
}

// Ubah status tugas dari tabel
function changeTaskStatus(id, status) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  console.log("Mengubah status tugas:", id, "menjadi:", status);
  task.status = status;
  renderTasksList();
}

// Filter tugas berdasarkan pencarian dan status
function filterTasks(searchText, status) {
  currentFilterText = searchText;
  currentFilterStatus = status;
  
  // Update nilai input agar tetap konsisten
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  if (searchInput) searchInput.value = searchText;
  if (statusFilter) statusFilter.value = status;
  
  renderTasksList();
}

// Reset filter
function resetFilter() {
  currentFilterText = '';
  currentFilterStatus = 'semua';
  renderTasksList();
}

/*************************************************
 * EDIT PROFIL
 *************************************************/
function showEditProfileModal() {
  showModal(
    "Edit Profil",
    `
    <form onsubmit="saveProfile(event)">
      <label>Nama</label>
      <input type="text" name="nama" value="${userProfile.nama}" required />

      <label>Email</label>
      <input type="email" name="email" value="${userProfile.email}" required />

      <label>Status</label>
      <select name="status" required>
        <option value="Aktif" ${userProfile.status === "Aktif" ? "selected" : ""}>Aktif</option>
        <option value="Nonaktif" ${userProfile.status === "Nonaktif" ? "selected" : ""}>Nonaktif</option>
      </select>

      <button class="btn primary" type="submit" style="margin-top: 20px;">Simpan Perubahan</button>
    </form>
    `
  );
}

function saveProfile(event) {
  event.preventDefault();
  const form = event.target;
  
  userProfile.nama = form.nama.value;
  userProfile.email = form.email.value;
  userProfile.status = form.status.value;
  
  // Sinkronisasi nama di header
  document.querySelector(".nama-user").textContent = `Hi, ${userProfile.nama}`;
  
  closeModal();
  renderProfile();
}

/*************************************************
 * SUBMENU TOGGLE
 *************************************************/
function toggleSubmenu() {
  const submenu = document.getElementById("submenu-tasks");
  submenu.classList.toggle("active");
}

/*************************************************
 * CALENDAR NAVIGATION
 *************************************************/
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function prevMonth() {
  currentCalendarMonth--;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentCalendarMonth++;
  if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderCalendar();
}

/*************************************************
 * INIT APP
 *************************************************/
function initApp() {
  // Sinkronisasi nama di header dengan profil
  document.querySelector(".nama-user").textContent = `Hi, ${userProfile.nama}`;
}

window.onload = () => {
  initApp();
  renderHome();
};