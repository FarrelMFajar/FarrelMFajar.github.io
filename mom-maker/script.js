document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mom-form");
  const statusDiv = document.getElementById("status");
  const saveBtn = document.getElementById("saveLocal");
  const loadBtn = document.getElementById("loadLocal");

  // Utility: Get all form values as an object
  function getFormData() {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  }

  // Utility: Populate form with data
  function setFormData(data) {
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
  }

  // Save to localStorage
  function saveToLocal() {
    const data = getFormData();
    const now = new Date().toISOString();
    const existing = JSON.parse(localStorage.getItem("momRecords") || "[]");
    existing.push({ id: now, ...data });
    localStorage.setItem("momRecords", JSON.stringify(existing));
    statusDiv.textContent = "Saved to local storage ✅";
  }

  // Load most recent entry
  function loadFromLocal() {
    const records = JSON.parse(localStorage.getItem("momRecords") || "[]");
    if (records.length === 0) {
      statusDiv.textContent = "No records found.";
      return;
    }
    const latest = records[records.length - 1];
    setFormData(latest);
    statusDiv.textContent = "Loaded last saved record.";
  }

  // Handle form submit (next step: generate files)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getFormData();
    console.log("Form data collected:", data);

    // Placeholder – doc generation handled next
    alert("File generation coming next...");
  });

  saveBtn.addEventListener("click", saveToLocal);
  loadBtn.addEventListener("click", loadFromLocal);
});
