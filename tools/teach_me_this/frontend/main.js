const form = document.getElementById("teach-form");
const topicEl = document.getElementById("topic");
const sourcesEl = document.getElementById("sources-text");
const filesEl = document.getElementById("source-files");
const levelEl = document.getElementById("level");
const styleEl = document.getElementById("style");
const btn = document.getElementById("explain-btn");
const btnLabel = document.getElementById("explain-label");
const spinner = document.getElementById("explain-spinner");
const statusEl = document.getElementById("status");
const sectionsEl = document.getElementById("sections");
const metaEl = document.getElementById("results-meta");
const emptyEl = document.getElementById("empty-state");

const SECTION_DEFS = [
  { key: "simple_explanation", label: "Simple Explanation", icon: "\u2728", cls: "icon-purple" },
  { key: "detailed_explanation", label: "Detailed Explanation", icon: "\u2139", cls: "icon-blue" },
  { key: "real_life_example", label: "Real-Life Example", icon: "\u26F0", cls: "icon-green" },
  { key: "key_points", label: "Key Points Summary", icon: "\u2705", cls: "icon-amber" },
  { key: "practice_questions", label: "5 Practice Questions", icon: "\u2753", cls: "icon-pink" },
];

function setLoading(on) {
  btn.disabled = on;
  btnLabel.style.display = on ? "none" : "";
  spinner.style.display = on ? "inline" : "none";
}

function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (isError ? " error" : "");
}

function clearResults() {
  sectionsEl.innerHTML = "";
  emptyEl.style.display = "block";
  metaEl.textContent = "Nothing yet.";
}

function createSectionCard(def, content) {
  const card = document.createElement("div");
  card.className = "section-card";

  const header = document.createElement("div");
  header.className = "section-header";

  const iconEl = document.createElement("div");
  iconEl.className = "section-icon " + def.cls;
  iconEl.textContent = def.icon;

  const labelEl = document.createElement("div");
  labelEl.className = "section-label";
  labelEl.textContent = def.label;

  const chevron = document.createElement("div");
  chevron.className = "section-chevron";
  chevron.textContent = "\u25BC";

  header.append(iconEl, labelEl, chevron);

  const body = document.createElement("div");
  body.className = "section-body";

  if (Array.isArray(content)) {
    if (def.key === "practice_questions") {
      const list = document.createElement("div");
      list.className = "practice-list";
      content.forEach(function (q, i) {
        const item = document.createElement("div");
        item.className = "practice-item";
        const qRow = document.createElement("div");
        qRow.className = "practice-question-row";
        const num = document.createElement("span");
        num.className = "practice-num";
        num.textContent = "Q" + (i + 1);
        const qText = document.createElement("span");
        qText.className = "practice-q-text";
        qText.textContent = q.question != null ? q.question : q;
        const toggle = document.createElement("span");
        toggle.className = "practice-toggle";
        toggle.textContent = "Show answer";
        qRow.append(num, qText, toggle);
        const answerEl = document.createElement("div");
        answerEl.className = "practice-answer";
        answerEl.textContent = q.answer != null ? q.answer : "";
        toggle.addEventListener("click", function () {
          var open = answerEl.classList.toggle("open");
          toggle.textContent = open ? "Hide answer" : "Show answer";
        });
        item.append(qRow, answerEl);
        list.appendChild(item);
      });
      body.appendChild(list);
    } else {
      const ul = document.createElement("ul");
      content.forEach(function (pt) {
        const li = document.createElement("li");
        li.textContent = pt;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }
  } else {
    body.textContent = content;
  }

  card.append(header, body);

  header.addEventListener("click", function () {
    var isOpen = body.classList.contains("open");
    body.classList.toggle("open", !isOpen);
    header.classList.toggle("open", !isOpen);
    chevron.classList.toggle("open", !isOpen);
  });

  return card;
}

function renderResult(data) {
  sectionsEl.innerHTML = "";
  emptyEl.style.display = "none";
  metaEl.textContent = data.level + " \u00B7 " + data.style;

  var s = data.sections;

  SECTION_DEFS.forEach(function (def, idx) {
    var content = s[def.key];
    var card = createSectionCard(def, content);
    if (idx < 2) {
      card.querySelector(".section-body").classList.add("open");
      card.querySelector(".section-header").classList.add("open");
      card.querySelector(".section-chevron").classList.add("open");
    }
    sectionsEl.appendChild(card);
  });
}

async function callApi() {
  var topic = topicEl.value.trim();
  var sourcesText = sourcesEl.value.trim();
  var files = filesEl.files;
  var level = levelEl.value;
  var style = styleEl.value;

  var hasFiles = files && files.length > 0;
  var hasSources = sourcesText.length > 0;

  if (!topic && !hasFiles && !hasSources) {
    throw new Error("Enter a topic, paste some text, or upload a file.");
  }

  if (topic && !hasFiles && !hasSources) {
    var res = await fetch("/api/teach/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topic, level: level, style: style }),
    });
    if (!res.ok) {
      var err = await res.json().catch(function () { return {}; });
      throw new Error(err.detail || "Server error " + res.status);
    }
    return res.json();
  }

  var fd = new FormData();
  fd.append("level", level);
  fd.append("style", style);
  fd.append("topic_hint", topic);
  fd.append("sources_text", sourcesText);
  for (var i = 0; i < files.length; i++) fd.append("files", files[i]);

  var res2 = await fetch("/api/teach/explain-from-files", {
    method: "POST",
    body: fd,
  });
  if (!res2.ok) {
    var err2 = await res2.json().catch(function () { return {}; });
    throw new Error(err2.detail || "Server error " + res2.status);
  }
  return res2.json();
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  setLoading(true);
  setStatus("Thinking...");
  clearResults();

  try {
    var data = await callApi();
    renderResult(data);
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Something went wrong.", true);
  } finally {
    setLoading(false);
  }
});
