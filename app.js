const levels = [
  {
    id: 1,
    title: "Level 1: One variable, one object",
    goal: "See how a single reference points at one object and how mutation affects it.",
    initial: {
      variables: ["a"],
      objects: [],
    },
    lines: [
      {
        code: 'Person a = new Person("Ana");',
        action: { type: "assign", variable: "a", object: { id: "obj1", label: "Person", fields: { name: "Ana" } } },
        question: {
          text: "After this line, where does a point?",
          choices: ["No object yet", "Person object with name Ana", "null"],
          answerIndex: 1,
        },
      },
      {
        code: 'a.name = "Bea";',
        action: { type: "mutate", variable: "a", field: "name", value: "Bea" },
        question: {
          text: "What changes after this mutation?",
          choices: ["The object referenced by a updates its name", "a now points to null", "A new object is created"],
          answerIndex: 0,
        },
      },
    ],
  },
  {
    id: 2,
    title: "Level 2: Two variables, aliasing",
    goal: "Two variables can reference the same object.",
    initial: {
      variables: ["a", "b"],
      objects: [],
    },
    lines: [
      {
        code: 'Person a = new Person("Kai");',
        action: { type: "assign", variable: "a", object: { id: "obj1", label: "Person", fields: { name: "Kai" } } },
        question: {
          text: "What does variable a reference?",
          choices: ["Person Kai", "null", "Variable b"],
          answerIndex: 0,
        },
      },
      {
        code: "Person b = a;",
        action: { type: "alias", variable: "b", source: "a" },
        question: {
          text: "Now b is assigned. Which statement is true?",
          choices: ["a and b point to the same object", "b points to null", "a points to b"],
          answerIndex: 0,
        },
      },
      {
        code: 'b.name = "Lee";',
        action: { type: "mutate", variable: "b", field: "name", value: "Lee" },
        question: {
          text: "After updating b.name, what does a.name show?",
          choices: ["Kai", "Lee", "null"],
          answerIndex: 1,
        },
      },
    ],
  },
  {
    id: 3,
    title: "Level 3: null and reassignments",
    goal: "Track when references are cleared and reassigned.",
    initial: {
      variables: ["a", "b"],
      objects: [],
    },
    lines: [
      {
        code: 'Person a = new Person("Ada");',
        action: { type: "assign", variable: "a", object: { id: "obj1", label: "Person", fields: { name: "Ada" } } },
        question: {
          text: "Where does a point after the assignment?",
          choices: ["Person Ada", "null", "Variable b"],
          answerIndex: 0,
        },
      },
      {
        code: "Person b = a;",
        action: { type: "alias", variable: "b", source: "a" },
        question: {
          text: "After b = a, how many references point to the same object?",
          choices: ["0", "1", "2"],
          answerIndex: 2,
        },
      },
      {
        code: "a = null;",
        action: { type: "null", variable: "a" },
        question: {
          text: "What happens to the original object?",
          choices: ["It is still referenced by b", "It is immediately deleted", "b becomes null too"],
          answerIndex: 0,
        },
      },
      {
        code: 'b = new Person("Bela");',
        action: { type: "assign", variable: "b", object: { id: "obj2", label: "Person", fields: { name: "Bela" } } },
        question: {
          text: "Which object does b reference now?",
          choices: ["Person Ada", "Person Bela", "null"],
          answerIndex: 1,
        },
      },
    ],
  },
  {
    id: 4,
    title: "Level 4: Arrays of references",
    goal: "Arrays store references too, one per slot.",
    initial: {
      variables: ["arr", "a"],
      objects: [
        { id: "arr1", label: "Person[]", fields: { length: 2 }, slots: [null, null] },
      ],
    },
    lines: [
      {
        code: "Person[] arr = new Person[2];",
        action: { type: "assign-existing", variable: "arr", objectId: "arr1" },
        question: {
          text: "After creating the array, what is stored in each slot?",
          choices: ["null references", "new Person objects", "copies of arr"],
          answerIndex: 0,
        },
      },
      {
        code: 'Person a = new Person("Mia");',
        action: { type: "assign", variable: "a", object: { id: "obj1", label: "Person", fields: { name: "Mia" } } },
        question: {
          text: "After this line, what does a reference?",
          choices: ["The array", "Person Mia", "null"],
          answerIndex: 1,
        },
      },
      {
        code: "arr[0] = a;",
        action: { type: "array-assign", arrayId: "arr1", index: 0, source: "a" },
        question: {
          text: "Now arr[0] holds...",
          choices: ["Person Mia", "null", "a new array"],
          answerIndex: 0,
        },
      },
      {
        code: 'arr[1] = new Person("Noa");',
        action: { type: "array-assign", arrayId: "arr1", index: 1, object: { id: "obj2", label: "Person", fields: { name: "Noa" } } },
        question: {
          text: "Which slot points to the new Person Noa?",
          choices: ["arr[0]", "arr[1]", "a"],
          answerIndex: 1,
        },
      },
    ],
  },
  {
    id: 5,
    title: "Level 5: Methods and parameter passing",
    goal: "Parameters receive copies of references, not new objects.",
    initial: {
      variables: ["a", "p"],
      objects: [],
    },
    lines: [
      {
        code: 'Person a = new Person("Tara");',
        action: { type: "assign", variable: "a", object: { id: "obj1", label: "Person", fields: { name: "Tara" } } },
        question: {
          text: "What does a reference?",
          choices: ["Person Tara", "null", "Parameter p"],
          answerIndex: 0,
        },
      },
      {
        code: "updateName(a); // call method", 
        action: { type: "alias", variable: "p", source: "a", temporary: true },
        question: {
          text: "Inside updateName, parameter p points to...",
          choices: ["A copy of the object", "The same object as a", "null"],
          answerIndex: 1,
        },
      },
      {
        code: 'p.name = "Zara"; // inside method',
        action: { type: "mutate", variable: "p", field: "name", value: "Zara" },
        question: {
          text: "After the method mutation, what does a.name show?",
          choices: ["Tara", "Zara", "null"],
          answerIndex: 1,
        },
      },
      {
        code: "p = null; // inside method",
        action: { type: "null", variable: "p" },
        question: {
          text: "After p = null inside the method, what about a?",
          choices: ["a is still pointing to Person Zara", "a becomes null", "a points to p"],
          answerIndex: 0,
        },
      },
    ],
  },
];

const variablesEl = document.getElementById("variables");
const objectsEl = document.getElementById("objects");
const arrowsEl = document.getElementById("arrows");
const runLineBtn = document.getElementById("runLineBtn");
const resetLevelBtn = document.getElementById("resetLevelBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const levelInfoEl = document.getElementById("levelInfo");
const codeLinesEl = document.getElementById("codeLines");
const questionTextEl = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");

let currentLevelIndex = 0;
let currentLineIndex = -1;
let state = null;
let awaitingAnswer = false;

const createState = (level) => ({
  variables: Object.fromEntries(level.initial.variables.map((name) => [name, null])),
  objects: [...level.initial.objects.map((obj) => ({ ...obj }))],
  tempVariables: new Set(),
});

const getObjectById = (id) => state.objects.find((obj) => obj.id === id);

const addObject = (object) => {
  const existing = getObjectById(object.id);
  if (!existing) {
    state.objects.push({ ...object });
  }
};

const renderLevelInfo = (level) => {
  levelInfoEl.innerHTML = `
    <h2>${level.title}</h2>
    <p>${level.goal}</p>
  `;
};

const renderVariables = () => {
  variablesEl.innerHTML = "";
  Object.entries(state.variables).forEach(([name, ref]) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `var-${name}`;
    card.innerHTML = `
      <div class="card__title">${name}</div>
      <div class="card__meta">${ref ? `→ ${ref}` : "→ null"}</div>
    `;
    variablesEl.appendChild(card);
  });
};

const renderObjects = () => {
  objectsEl.innerHTML = "";
  state.objects.forEach((obj) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `obj-${obj.id}`;

    const fields = Object.entries(obj.fields || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join(" • ");

    const slots = obj.slots
      ? obj.slots
          .map(
            (value, index) => `
              <div class="array-slot" data-array="${obj.id}" data-index="${index}">
                [${index}]: <span>${value ? value : "null"}</span>
              </div>
            `
          )
          .join("")
      : "";

    card.innerHTML = `
      <div class="card__title">${obj.label} (${obj.id})</div>
      ${fields ? `<div class="card__meta">${fields}</div>` : ""}
      ${slots ? `<div class="card__meta">${slots}</div>` : ""}
    `;
    objectsEl.appendChild(card);
  });
};

const clearArrows = () => {
  arrowsEl.innerHTML = "";
};

const ensureArrow = (id) => {
  let line = document.getElementById(id);
  if (!line) {
    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("id", id);
    arrowsEl.appendChild(line);
  }
  return line;
};

const getCenter = (element, side) => {
  const rect = element.getBoundingClientRect();
  const stageRect = document.querySelector(".stage").getBoundingClientRect();
  return {
    x: side === "left" ? rect.right - stageRect.left : rect.left - stageRect.left,
    y: rect.top - stageRect.top + rect.height / 2,
  };
};

const positionArrow = (line, fromEl, toEl, isNull = false) => {
  const from = getCenter(fromEl, "left");
  const to = toEl ? getCenter(toEl, "right") : { x: from.x + 120, y: from.y };
  line.setAttribute("x1", from.x);
  line.setAttribute("y1", from.y);
  line.setAttribute("x2", to.x);
  line.setAttribute("y2", to.y);
  line.classList.toggle("null", isNull);
};

const updateArrows = () => {
  clearArrows();
  Object.entries(state.variables).forEach(([name, ref]) => {
    const varEl = document.getElementById(`var-${name}`);
    if (!varEl) return;
    const line = ensureArrow(`arrow-${name}`);
    if (ref) {
      const objEl = document.getElementById(`obj-${ref}`);
      if (objEl) {
        positionArrow(line, varEl, objEl);
      }
    } else {
      positionArrow(line, varEl, null, true);
    }
  });

  state.objects
    .filter((obj) => obj.slots)
    .forEach((obj) => {
      obj.slots.forEach((value, index) => {
        const slotEl = document.querySelector(`[data-array="${obj.id}"][data-index="${index}"]`);
        const line = ensureArrow(`arrow-${obj.id}-${index}`);
        if (slotEl && value) {
          const objEl = document.getElementById(`obj-${value}`);
          if (objEl) {
            positionArrow(line, slotEl, objEl);
          }
        } else if (slotEl) {
          positionArrow(line, slotEl, null, true);
        }
      });
    });
};

const renderCodeLines = (level) => {
  codeLinesEl.innerHTML = "";
  level.lines.forEach((line, index) => {
    const li = document.createElement("li");
    li.textContent = line.code;
    if (index === currentLineIndex) {
      li.classList.add("active");
    }
    codeLinesEl.appendChild(li);
  });
};

const renderQuestion = (question) => {
  questionTextEl.textContent = question.text;
  choicesEl.innerHTML = "";
  feedbackEl.textContent = "";
  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice;
    button.addEventListener("click", () => handleChoice(index, question.answerIndex, button));
    choicesEl.appendChild(button);
  });
};

const handleChoice = (selectedIndex, answerIndex, button) => {
  if (!awaitingAnswer) return;
  const buttons = [...choicesEl.querySelectorAll(".choice")];
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === answerIndex) {
      btn.classList.add("correct");
    }
  });
  if (selectedIndex === answerIndex) {
    button.classList.add("correct");
    feedbackEl.textContent = "Correct! Keep going.";
  } else {
    button.classList.add("incorrect");
    feedbackEl.textContent = "Not quite. Review the diagram, then continue.";
  }
  awaitingAnswer = false;
  runLineBtn.disabled = false;
  if (currentLineIndex === levels[currentLevelIndex].lines.length - 1) {
    nextLevelBtn.disabled = false;
    runLineBtn.disabled = true;
  }
};

const highlightObject = (objectId) => {
  const objectEl = document.getElementById(`obj-${objectId}`);
  if (!objectEl) return;
  objectEl.classList.add("highlight");
  setTimeout(() => objectEl.classList.remove("highlight"), 800);
};

const applyAction = (action) => {
  if (!action) return;
  switch (action.type) {
    case "assign": {
      addObject(action.object);
      state.variables[action.variable] = action.object.id;
      break;
    }
    case "assign-existing": {
      state.variables[action.variable] = action.objectId;
      break;
    }
    case "alias": {
      state.variables[action.variable] = state.variables[action.source];
      if (action.temporary) {
        state.tempVariables.add(action.variable);
      }
      break;
    }
    case "mutate": {
      const targetId = state.variables[action.variable];
      const obj = getObjectById(targetId);
      if (obj) {
        obj.fields = { ...obj.fields, [action.field]: action.value };
        highlightObject(targetId);
      }
      break;
    }
    case "null": {
      state.variables[action.variable] = null;
      break;
    }
    case "array-assign": {
      if (action.object) {
        addObject(action.object);
      }
      const arr = getObjectById(action.arrayId);
      if (arr && arr.slots) {
        if (action.source) {
          arr.slots[action.index] = state.variables[action.source];
        } else if (action.object) {
          arr.slots[action.index] = action.object.id;
        }
      }
      break;
    }
    default:
      break;
  }
};

const runNextLine = () => {
  const level = levels[currentLevelIndex];
  if (currentLineIndex >= level.lines.length - 1) return;
  currentLineIndex += 1;
  const line = level.lines[currentLineIndex];
  applyAction(line.action);
  renderVariables();
  renderObjects();
  updateArrows();
  renderCodeLines(level);
  renderQuestion(line.question);
  awaitingAnswer = true;
  runLineBtn.disabled = true;
};

const resetLevel = () => {
  const level = levels[currentLevelIndex];
  state = createState(level);
  currentLineIndex = -1;
  awaitingAnswer = false;
  nextLevelBtn.disabled = true;
  runLineBtn.disabled = false;
  renderLevelInfo(level);
  renderVariables();
  renderObjects();
  renderCodeLines(level);
  clearArrows();
  questionTextEl.textContent = "Press “Run next line” to start.";
  choicesEl.innerHTML = "";
  feedbackEl.textContent = "";
};

const goToNextLevel = () => {
  if (currentLevelIndex >= levels.length - 1) return;
  currentLevelIndex += 1;
  resetLevel();
};

runLineBtn.addEventListener("click", runNextLine);
resetLevelBtn.addEventListener("click", resetLevel);
nextLevelBtn.addEventListener("click", goToNextLevel);
window.addEventListener("resize", () => {
  renderVariables();
  renderObjects();
  updateArrows();
});

resetLevel();
