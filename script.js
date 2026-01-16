// ================= LOGIN =================
moBtn.onclick = () => login("Medical Officer");
staffBtn.onclick = () => login("Dialysis Staff");

function login(role) {
  roleText.innerText = "Logged in as: " + role;
  app.style.display = "block";
  loadPatients();
}

// ================= PATIENT REGISTRATION =================
let patients = JSON.parse(localStorage.getItem("patients")) || [];

registerPatientBtn.onclick = () => {
  const age = patientAge.value;
  const type = dialysisType.value;

  if (!age || !type) {
    alert("Please enter patient details");
    return;
  }

  const patientId = "PID-" + Date.now();

  const patient = {
    id: patientId,
    age: age,
    dialysisType: type
  };

  patients.push(patient);
  localStorage.setItem("patients", JSON.stringify(patients));

  generatedPatientId.innerText =
    "Patient registered successfully. Patient ID: " + patientId;

  updatePatientDropdown();
};

function updatePatientDropdown() {
  patientSelect.innerHTML =
    '<option value="">Select Patient ID</option>';

  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = p.id;
    patientSelect.appendChild(opt);
  });
}

// ================= PATIENT SELECTION =================
patientSelect.onchange = () => {
  const pid = patientSelect.value;
  if (!pid) return;

  localStorage.setItem("activePatient", pid);
  activePatientText.innerText = "Active Patient: " + pid;
};

// ================= LAB REVIEW =================
labBtn.onclick = () => {
  if (!localStorage.getItem("activePatient")) {
    alert("Select patient first");
    return;
  }

  let alerts = [];

  if (parseFloat(hb.value) < 7) alerts.push("Low hemoglobin");
  if (parseFloat(k.value) >= 6) alerts.push("High potassium");
  if (parseFloat(na.value) < 130 || parseFloat(na.value) > 150)
    alerts.push("Abnormal sodium");

  alert(alerts.length ? alerts.join("\n") : "Labs acceptable");
};

// ================= UF CALCULATION =================
ufBtn.onclick = () => {
  if (!localStorage.getItem("activePatient")) {
    alert("Select patient first");
    return;
  }

  const ifg =
    parseFloat(currentPreWt.value) - parseFloat(lastPostWt.value);
  const uf = ifg + parseFloat(intraFluid.value);

  ufText.innerText =
    "Interdialytic gain: " + ifg.toFixed(1) + " L\n" +
    "Suggested UF: " + uf.toFixed(1) +
    " L\n(For clinical review only)";
};
