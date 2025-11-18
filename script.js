// --- LOGIC GATE IMPLEMENTATION ---

// AND Gate: True only if both A and B are True
function AND(A, B) {
  return A && B;
}

// OR Gate: True if A OR B (or both) are True
function OR(A, B) {
  return A || B;
}

// NOR Gate: True only if NOT (A OR B)
function NOR(A, B) {
  return !(A || B);
}

// XNOR Gate: True if A and B are the same (both True or both False)
function XNOR(A, B) {
  return A === B;
}

// --- CORE APPLICATION LOGIC ---

function toggleInput(id) {
  const element = document.getElementById(id);
  const isToggled = element.classList.toggle("active");

  // Update Input Value Display
  const valSpanId = "val_" + id.split("_")[1];
  document.getElementById(valSpanId).textContent = isToggled ? "1" : "0";

  // Special case for Time input icon
  if (id === "input_time") {
    document.getElementById("time_icon").textContent = isToggled ? "🌙" : "☀️";
  }

  calculateReminder();
}

function calculateReminder() {
  // 1. Get Boolean Inputs (True/False based on 'active' class)
  const Ir = document.getElementById("input_rain").classList.contains("active");
  const Id = document
    .getElementById("input_drizzle")
    .classList.contains("active");
  const Iw = document.getElementById("input_wind").classList.contains("active");
  const It = document.getElementById("input_time").classList.contains("active");

  // 2. Intermediate Gate Outputs (The Hidden Layer)
  const O_Risk = OR(Ir, Id); // OR: Any Rain Risk? (Uses OR)

  // A_Hazard is now redefined to be a "Drizzle Hazard" as requested by the user.
  // TRUE if Drizzle AND High Wind are present (I_D * I_W). This is used to cancel the umbrella.
  const A_Hazard = AND(Id, Iw); // AND: Drizzle AND Wind? (Uses AND)

  const N_NoRain = NOR(Ir, Id); // NOR: Absolutely No Rain Risk? (Uses NOR)
  const X_Consistent = XNOR(It, Iw); // XNOR: Time and Wind are consistent? (Uses XNOR)

  // 3. Final Logic (The decision layer)

  // FINAL LOGIC: Reminder ON = (O_Risk AND NOT A_Hazard) AND NOT N_NoRain
  // This logic is simple and robust:
  // 1. Must have rain risk (O_Risk=1)
  // 2. Must not be a Drizzle Hazard (A_Hazard=0)
  // 3. Must confirm rain is actually falling (NOT N_NoRain=1)

  // Term 1: Must Take (O_Risk AND NOT A_Hazard)
  const notAHazard = !A_Hazard;
  const mustTake = AND(O_Risk, notAHazard);

  // Term 2: The Universal Safety Switch (NOT N_NoRain)
  const notNNoRain = !N_NoRain;

  // Final Decision
  const reminderOn = AND(mustTake, notNNoRain);

  // 4. Update UI
  updateGateDisplay({ O_Risk, A_Hazard, N_NoRain, X_Consistent });
  updateOutput(reminderOn);
}

function updateGateDisplay(results) {
  // Display results in the Logic Gate section
  document.getElementById("O_Risk").textContent = results.O_Risk ? "1" : "0";
  document.getElementById("A_Hazard").textContent = results.A_Hazard
    ? "1"
    : "0";
  document.getElementById("N_NoRain").textContent = results.N_NoRain
    ? "1"
    : "0";
  document.getElementById("X_Consistent").textContent = results.X_Consistent
    ? "1"
    : "0";
}

function updateOutput(isReminderOn) {
  const umbrellaElement = document.getElementById("umbrella_output");
  const textElement = document.getElementById("output_text");
  const valElement = document.getElementById("val_output");

  if (isReminderOn) {
    umbrellaElement.textContent = "☔";
    textElement.textContent = "Umbrella Recommended! (Reminder ON)";
    textElement.classList.remove("text-gray-700");
    textElement.classList.add("text-green-800");
    umbrellaElement.style.transform = "scale(1.1)";
    valElement.textContent = "1";
  } else {
    umbrellaElement.textContent = "🚫☂️";
    textElement.textContent = "No Umbrella Needed.";
    textElement.classList.remove("text-green-800");
    textElement.classList.add("text-gray-700");
    umbrellaElement.style.transform = "scale(1.0)";
    valElement.textContent = "0";
  }
}

// Initialize the calculation on load
window.onload = function () {
  calculateReminder();
};
