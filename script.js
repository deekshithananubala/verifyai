const button = document.querySelector("#checkButton");
const resetButton = document.querySelector("#resetButton");
const result = document.querySelector("#result");


// -------------------------
// NORMALIZE TEXT
// -------------------------

function normalize(value) {
  return value.trim().toLowerCase();
}


// -------------------------
// FORMAT DATE
// YYYY-MM-DD → DD-MM-YYYY
// -------------------------

function formatDate(date) {

  if (date === "") {
    return "";
  }

  const parts = date.split("-");

  return parts[2] + "-" + parts[1] + "-" + parts[0];
}


// -------------------------
// CALCULATE SIMILARITY
// -------------------------

function similarity(valueA, valueB) {

  const a = normalize(valueA);
  const b = normalize(valueB);

  const maxLength = Math.max(a.length, b.length);

  if (maxLength === 0) {
    return 1;
  }

  let sameCharacters = 0;

  const shorterLength = Math.min(a.length, b.length);

  for (let i = 0; i < shorterLength; i++) {

    if (a[i] === b[i]) {
      sameCharacters++;
    }

  }

  return sameCharacters / maxLength;
}


// -------------------------
// CHECK ONE FIELD
// -------------------------

function checkField(valueA, valueB) {

  // Missing
  if (valueA.trim() === "" || valueB.trim() === "") {

    return {
      type: "missing",
      status: "⚪",
      message: "Missing information",
      score: 0
    };

  }


  // Exact match
  if (valueA === valueB) {

    return {
      type: "match",
      status: "✅",
      message: "Exact Match",
      score: 1
    };

  }


  // Same after formatting
  if (normalize(valueA) === normalize(valueB)) {

    return {
      type: "format",
      status: "🟡",
      message: "Formatting Difference",
      score: 1
    };

  }


  // Similar values
  const similarityScore = similarity(valueA, valueB);

  if (similarityScore >= 0.75) {

    return {
      type: "possible",
      status: "🟠",
      message: "Possible Typo",
      score: 0
    };

  }


  // Different values
  return {
    type: "conflict",
    status: "🔴",
    message: "Actual Conflict",
    score: 0
  };

}


// -------------------------
// CREATE RESULT CARD
// -------------------------

function createResultCard(field, check, valueA, valueB) {

  let values = "";

  if (check.type !== "match") {

    values = `
      <div class="values">

        <div>
          <span>Information A</span>
          <strong>${valueA || "Not provided"}</strong>
        </div>

        <div>
          <span>Information B</span>
          <strong>${valueB || "Not provided"}</strong>
        </div>

      </div>
    `;

  }


  return `
    <div class="result-card">

      <div class="result-title">

        <strong>
          ${check.status} ${field}
        </strong>

        <span>
          ${check.message}
        </span>

      </div>

      ${values}

    </div>
  `;
}


// -------------------------
// CHECK CONSISTENCY
// -------------------------

button.addEventListener("click", function() {

  const nameA = document.querySelector("#nameA").value;
  const dobA = document.querySelector("#dobA").value;
  const emailA = document.querySelector("#emailA").value;
  const phoneA = document.querySelector("#phoneA").value;
  const addressA = document.querySelector("#addressA").value;


  const nameB = document.querySelector("#nameB").value;
  const dobB = document.querySelector("#dobB").value;
  const emailB = document.querySelector("#emailB").value;
  const phoneB = document.querySelector("#phoneB").value;
  const addressB = document.querySelector("#addressB").value;


  // Check every field

  const nameCheck = checkField(nameA, nameB);

  const dobCheck = checkField(dobA, dobB);

  const emailCheck = checkField(emailA, emailB);

  const phoneCheck = checkField(phoneA, phoneB);

  const addressCheck = checkField(addressA, addressB);


  // Store results

  const checks = [
    nameCheck,
    dobCheck,
    emailCheck,
    phoneCheck,
    addressCheck
  ];


  // Calculate score

  let score = 0;

  checks.forEach(function(check) {
    score = score + check.score;
  });


  // Result border

  if (score === 5) {
    result.style.border = "2px solid green";
  } else {
    result.style.border = "2px solid red";
  }


  // Display results

  result.innerHTML = `

    <div class="result-header">

      <h2>
        ${
          score === 5
            ? "✓ Information is Consistent"
            : "⚠ Review Required"
        }
      </h2>

      <h3>
        Consistency Score: ${score}/5
      </h3>

    </div>


    <div class="result-list">

      ${createResultCard(
        "Name",
        nameCheck,
        nameA,
        nameB
      )}


      ${createResultCard(
        "Date of Birth",
        dobCheck,
        formatDate(dobA),
        formatDate(dobB)
      )}


      ${createResultCard(
        "Email",
        emailCheck,
        emailA,
        emailB
      )}


      ${createResultCard(
        "Phone Number",
        phoneCheck,
        phoneA,
        phoneB
      )}


      ${createResultCard(
        "Address",
        addressCheck,
        addressA,
        addressB
      )}

    </div>

  `;

});


// -------------------------
// RESET
// -------------------------

resetButton.addEventListener("click", function() {

  document.querySelector("#nameA").value = "";
  document.querySelector("#dobA").value = "";
  document.querySelector("#emailA").value = "";
  document.querySelector("#phoneA").value = "";
  document.querySelector("#addressA").value = "";


  document.querySelector("#nameB").value = "";
  document.querySelector("#dobB").value = "";
  document.querySelector("#emailB").value = "";
  document.querySelector("#phoneB").value = "";
  document.querySelector("#addressB").value = "";


  result.innerHTML = "";

  result.style.border = "none";

});
