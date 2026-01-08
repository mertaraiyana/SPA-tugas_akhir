/*************************************************
 * STATE (DATA APLIKASI)
 *************************************************/
let tasks = [
  { id: 1, judul: "Tugas Matematika", deadline: "2026-01-10", status: "Belum" },
  { id: 2, judul: "Tugas Pemrograman", deadline: "2026-01-12", status: "Selesai" }
];

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

// Table Tugas
function TaskTable(data) {
  if (data.length === 0) {
    return "<p>Tidak ada tugas.</p>";
  }

  const rows = data.map(t => `
    <tr>
      <td>${t.judul}</td>
      <td>${t.deadline}</td>
      <td>${t.status}</td>
      <td>
        ${Button("Detail", `showDetail(${t.id})`)}
        ${Button("Hapus", `deleteTask(${t.id})`, "danger")}
      </td>
    </tr>
  `).join("");

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

      <button class="btn primary" type="submit">Simpan</button>
    </form>
  `;
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
  render(
    Card(
      "Home",
      `<p>Selamat datang di aplikasi <b>TaskMahasiswa</b>.</p>`
    )
  );
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

// Manajemen Tugas
function renderTasks() {
  render(`
    ${Card("Tambah Tugas", TaskForm())}
    ${Card("Daftar Tugas", TaskTable(tasks))}
  `);
}

// Kalender (placeholder)
function renderCalendar() {
  render(
    Card(
      "Kalender",
      "<p>Fitur kalender akan dikembangkan.</p>"
    )
  );
}

// Profil
function renderProfile() {
  render(
    Card(
      "Profil",
      `
      <p><b>Nama:</b> Mahasiswa</p>
      <p><b>Status:</b> Aktif</p>
      `
    )
  );
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
    status: "Belum"
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
  renderTasks();
}

/*************************************************
 * INIT APP
 *************************************************/
window.onload = () => {
  renderHome();
};
