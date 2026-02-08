const BASE_URL = "http://localhost:5000/api/departments";

/* ================= GET ALL DEPARTMENTS ================= */
export const getDepartments = async () => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch departments");
  }

  return res.json();
};

/* ================= CREATE DEPARTMENT ================= */
export const createDepartment = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create department");
  }

  return res.json();
};

/* ================= UPDATE DEPARTMENT ================= */
export const updateDepartment = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update department");
  }

  return res.json();
};

/* ================= DELETE DEPARTMENT ================= */
export const deleteDepartment = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete department");
  }

  return res.json();
};
