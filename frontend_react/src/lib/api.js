// Thin fetch wrappers around the existing Flask backend API.
// The backend contract (routes + JSON shapes) is unchanged from the
// original project — this file only mirrors what frontend/js/*.js
// used to call directly.

async function getJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status})`);
  return res.json();
}

// -------- dashboard / live status --------

export const getDashboardSummary = () => getJson("/api/dashboard_summary");
export const getCurrentEmployee = () => getJson("/api/current_employee");
export const getActivityLog = (limit = 50) => getJson(`/api/activity_log?limit=${limit}`);
export const getOpenSessions = () => getJson("/api/open_sessions");
export const getCameraStatus = () => getJson("/camera_status");

// -------- employees --------

export const listEmployees = () => getJson("/api/employees");

export async function saveEmployee({ id, name, hourlyRate, photoFile }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("hourly_rate", hourlyRate);
  if (photoFile) formData.append("photo", photoFile);

  const url = id ? `/api/employees/${id}` : "/api/employees";
  const method = id ? "PUT" : "POST";
  const res = await fetch(url, { method, body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save employee.");
  return data;
}

export async function deleteEmployee(id) {
  const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete employee.");
  }
  return res.json();
}

// -------- reports / payments --------

export function getRecords({ employeeId, date, limit = 200 } = {}) {
  const params = new URLSearchParams();
  if (employeeId) params.set("employee_id", employeeId);
  if (date) params.set("date", date);
  if (limit) params.set("limit", limit);
  return getJson(`/api/records?${params.toString()}`);
}
