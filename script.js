/*************************************************
 AI-Assisted Dialysis Decision Support
 STEP B: Patient-ID–based Session Storage
**************************************************/

// =============== LOGIN ==================
document.getElementById("moBtn").onclick = () => login("Medical Officer");
document.getElementById("staffBtn").onclick = () => login("Dialysis Staff");

function login(role) {
  document.getElementById("roleText").innerText =
    "Logged in as: " + role;
  document.getElementById("app").style.display = "block";
  loadPatients();
}

// =============== PATIENT REGISTRATION ==================
let patients = JSON.parse(localStorage.getItem("patients")) || [];

document.getElementById("registerPatientBtn").onclick = () => {
  const age = document.getElementById("patientAge").value;
  const type = document.getElementById("dialysisType").value;

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

  document.getElementById("generatedPatientId").innerText =
    "Patient registered successfully. Patient ID: " + patientId;

  updatePatientDropdown();
};

// =============== LOAD PATIENT IDS ==================
function updatePatientDropdown() {
  const select = document.getElementById("patientSelect");
  select.innerHTML = '<option value="">Select Patient ID</option>';

  patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = p.id;
    select.appendChild(opt);
  });
}

// =============== SELECT ACTIVE PATIENT ==================
document.getElementById("patientSelect").onchange = () => {
  const pid = document.getElementById("patientSelect").value;
  if (!pid) return;

  localStorage.setItem("activePatient", pid);
  document.getElementById("activePatientText").innerText =
    "Active Patient: " + pid;
};

// =============== SAVE SESSION DATA ==================
document.getElementById("saveSessionBtn").onclick = () => {
  const pid = localStorage.getItem("activePatient");
  if (!pid) {
    alert("Please select a patient first");
    return;
  }

  const hb = parseFloat(document.getElementById("hb").value);
  const k = parseFloat(document.getElementById("k").value);
  const na = parseFloat(document.getElementById("na").value);
  const lastPostWt = parseFloat(
    document.getElementById("lastPostWt").value
  );
  const currentPreWt = parseFloat(
    document.getElementById("currentPreWt").value
  );
  const intraFluid = parseFloat(
    document.getElementById("intraFluid").value
  );

  if (
    isNaN(hb) || isNaN(k) || isNaN(na) ||
    isNaN(lastPostWt) || isNaN(currentPreWt) || isNaN(intraFluid)
  ) {
    alert("Please enter all session values");
    return;
  }

  const session = {
    date: new Date().toLocaleString(),
    hb: hb,
    k: k,
    na: na,
    lastPostWt: lastPostWt,
    currentPreWt: currentPreWt,
    intraFluid: intraFluid
  };

  let sessions = JSON.parse(
    localStorage.getItem(pid + "_sessions") || "[]"
  );

  sessions.push(session);
  localStorage.setItem(
    pid + "_sessions",
    JSON.stringify(sessions)
  );

  reviewSession(session);
};

// =============== CLINICAL REVIEW LOGIC ==================
function reviewSession(s) {
  let alerts = [];

  if (s.hb < 7) alerts.push("Low hemoglobin");
  if (s.k >= 6) alerts.push("High potassium");
  if (s.na < 130 || s.na > 150) alerts.push("Abnormal sodium");

  const ifg = s.currentPreWt - s.lastPostWt;
  const uf = ifg + s.intraFluid;

  let output =
    "Session saved successfully\n\n" +
    "Interdialytic weight gain: " + ifg.toFixed(1) + " L\n" +
    "Suggested UF: " + uf.toFixed(1) + " L\n";

  if (alerts.length > 0) {
    output += "\nAlerts:\n" + alerts.join("\n");
  } else {
    output += "\nNo critical laboratory alerts";
  }

  output +=
    "\n\nDecision support only — final decision by clinician.";

  document.getElementById("sessionOutput").innerText = output;
}
