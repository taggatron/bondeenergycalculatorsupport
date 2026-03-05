const BOND_ENERGIES = {
  "H-H": 436,
  "Cl-Cl": 243,
  "H-Cl": 431,
  "C-H": 413,
  "O=O": 498,
  "C=O": 805,
  "O-H": 463,
  "N#N": 945,
  "N-H": 391
};

const MOLECULES = {
  H2: {
    formula: "H2",
    atoms: [
      { element: "H", x: 35, y: 65 },
      { element: "H", x: 115, y: 65 }
    ],
    bonds: [{ a: 0, b: 1, type: "H-H" }]
  },
  Cl2: {
    formula: "Cl2",
    atoms: [
      { element: "Cl", x: 32, y: 65 },
      { element: "Cl", x: 118, y: 65 }
    ],
    bonds: [{ a: 0, b: 1, type: "Cl-Cl" }]
  },
  HCl: {
    formula: "HCl",
    atoms: [
      { element: "H", x: 36, y: 65 },
      { element: "Cl", x: 118, y: 65 }
    ],
    bonds: [{ a: 0, b: 1, type: "H-Cl" }]
  },
  CH4: {
    formula: "CH4",
    atoms: [
      { element: "C", x: 78, y: 65 },
      { element: "H", x: 78, y: 22 },
      { element: "H", x: 122, y: 65 },
      { element: "H", x: 78, y: 108 },
      { element: "H", x: 34, y: 65 }
    ],
    bonds: [
      { a: 0, b: 1, type: "C-H" },
      { a: 0, b: 2, type: "C-H" },
      { a: 0, b: 3, type: "C-H" },
      { a: 0, b: 4, type: "C-H" }
    ]
  },
  O2: {
    formula: "O2",
    atoms: [
      { element: "O", x: 38, y: 65 },
      { element: "O", x: 112, y: 65 }
    ],
    bonds: [{ a: 0, b: 1, type: "O=O" }]
  },
  CO2: {
    formula: "CO2",
    atoms: [
      { element: "O", x: 26, y: 65 },
      { element: "C", x: 76, y: 65 },
      { element: "O", x: 126, y: 65 }
    ],
    bonds: [
      { a: 0, b: 1, type: "C=O" },
      { a: 1, b: 2, type: "C=O" }
    ]
  },
  H2O: {
    formula: "H2O",
    atoms: [
      { element: "H", x: 34, y: 84 },
      { element: "O", x: 76, y: 50 },
      { element: "H", x: 118, y: 84 }
    ],
    bonds: [
      { a: 0, b: 1, type: "O-H" },
      { a: 1, b: 2, type: "O-H" }
    ]
  },
  N2: {
    formula: "N2",
    atoms: [
      { element: "N", x: 38, y: 65 },
      { element: "N", x: 112, y: 65 }
    ],
    bonds: [{ a: 0, b: 1, type: "N#N" }]
  },
  NH3: {
    formula: "NH3",
    atoms: [
      { element: "N", x: 76, y: 56 },
      { element: "H", x: 38, y: 96 },
      { element: "H", x: 114, y: 96 },
      { element: "H", x: 76, y: 14 }
    ],
    bonds: [
      { a: 0, b: 1, type: "N-H" },
      { a: 0, b: 2, type: "N-H" },
      { a: 0, b: 3, type: "N-H" }
    ]
  }
};

const REACTIONS = [
  {
    name: "Hydrogen Chlorination",
    wordEquation: "Hydrogen + Chlorine -> Hydrogen Chloride",
    symbolEquation: "H2 + Cl2 -> 2HCl",
    reactants: [
      { molecule: "H2", count: 1 },
      { molecule: "Cl2", count: 1 }
    ],
    products: [{ molecule: "HCl", count: 2 }]
  },
  {
    name: "Methane Combustion",
    wordEquation: "Methane + Oxygen -> Carbon Dioxide + Water",
    symbolEquation: "CH4 + 2O2 -> CO2 + 2H2O",
    reactants: [
      { molecule: "CH4", count: 1 },
      { molecule: "O2", count: 2 }
    ],
    products: [
      { molecule: "CO2", count: 1 },
      { molecule: "H2O", count: 2 }
    ]
  },
  {
    name: "Haber Process",
    wordEquation: "Nitrogen + Hydrogen -> Ammonia",
    symbolEquation: "N2 + 3H2 -> 2NH3",
    reactants: [
      { molecule: "N2", count: 1 },
      { molecule: "H2", count: 3 }
    ],
    products: [{ molecule: "NH3", count: 2 }]
  }
];

const elementStyle = {
  H: { fill: "#f6f6ee", text: "#1e281f" },
  C: { fill: "#4d5750", text: "#f8faf8" },
  O: { fill: "#d86256", text: "#fff8f6" },
  N: { fill: "#4f80cb", text: "#f7faff" },
  Cl: { fill: "#53a35f", text: "#f4fff4" }
};

const state = {
  reactionIndex: 0,
  broken: new Map(),
  formed: new Map()
};

const reactionSelect = document.getElementById("reactionSelect");
const wordEquationEl = document.getElementById("wordEquation");
const symbolEquationEl = document.getElementById("symbolEquation");
const reactantsArea = document.getElementById("reactantsArea");
const productsArea = document.getElementById("productsArea");
const brokenList = document.getElementById("brokenList");
const formedList = document.getElementById("formedList");
const brokenTotalEl = document.getElementById("brokenTotal");
const formedTotalEl = document.getElementById("formedTotal");
const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("resultBox");
const bondTable = document.getElementById("bondTable");
const energyInValue = document.getElementById("energyInValue");
const energyOutValue = document.getElementById("energyOutValue");
const netFlowValue = document.getElementById("netFlowValue");

function buildReactionOptions() {
  REACTIONS.forEach((reaction, idx) => {
    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = reaction.name;
    reactionSelect.append(option);
  });
}

function clearSelections() {
  state.broken.clear();
  state.formed.clear();
  resultBox.textContent = "Selections reset. Click bonds and calculate.";
  resultBox.className = "result";
}

function renderReaction() {
  const reaction = REACTIONS[state.reactionIndex];
  wordEquationEl.textContent = reaction.wordEquation;
  symbolEquationEl.textContent = reaction.symbolEquation;

  reactantsArea.innerHTML = "";
  productsArea.innerHTML = "";

  renderSide(reaction.reactants, reactantsArea, "reactant");
  renderSide(reaction.products, productsArea, "product");
  renderEnergyLists();
}

function renderSide(molecules, container, sideType) {
  molecules.forEach((entry) => {
    for (let instance = 1; instance <= entry.count; instance += 1) {
      const key = `${sideType}-${entry.molecule}-${instance}`;
      const molecule = MOLECULES[entry.molecule];
      const card = document.createElement("div");
      card.className = "molecule-card";

      const title = document.createElement("p");
      title.className = "molecule-title";
      title.textContent = `${molecule.formula} (${instance})`;
      card.append(title);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 150 130");

      drawBonds(svg, molecule, key, sideType);
      drawAtoms(svg, molecule);

      card.append(svg);
      container.append(card);
    }
  });
}

function drawBonds(svg, molecule, instanceKey, sideType) {
  molecule.bonds.forEach((bond, bondIndex) => {
    const atomA = molecule.atoms[bond.a];
    const atomB = molecule.atoms[bond.b];
    const bondId = `${instanceKey}-bond-${bondIndex}`;
    const energy = BOND_ENERGIES[bond.type];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(atomA.x));
    line.setAttribute("y1", String(atomA.y));
    line.setAttribute("x2", String(atomB.x));
    line.setAttribute("y2", String(atomB.y));
    line.setAttribute("class", "bond");
    line.setAttribute("role", "button");
    line.setAttribute("tabindex", "0");
    line.setAttribute("aria-label", `${bond.type} bond, ${energy} kilojoules per mole`);
    line.dataset.sideType = sideType;
    line.dataset.bondId = bondId;
    line.dataset.bondType = bond.type;
    line.dataset.energy = String(energy);

    line.addEventListener("click", () => toggleBond(line));
    line.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleBond(line);
      }
    });

    svg.append(line);
  });
}

function drawAtoms(svg, molecule) {
  molecule.atoms.forEach((atom) => {
    const color = elementStyle[atom.element] || { fill: "#dddddd", text: "#222222" };

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(atom.x));
    circle.setAttribute("cy", String(atom.y));
    circle.setAttribute("r", "13");
    circle.setAttribute("class", "atom");
    circle.setAttribute("fill", color.fill);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", String(atom.x));
    label.setAttribute("y", String(atom.y));
    label.setAttribute("class", "atom-label");
    label.setAttribute("fill", color.text);
    label.textContent = atom.element;

    svg.append(circle);
    svg.append(label);
  });
}

function toggleBond(line) {
  const sideType = line.dataset.sideType;
  const bondId = line.dataset.bondId;
  const bondType = line.dataset.bondType;
  const energy = Number(line.dataset.energy);
  const targetMap = sideType === "reactant" ? state.broken : state.formed;
  const className = sideType === "reactant" ? "selected-broken" : "selected-formed";
  const animationClass = sideType === "reactant" ? "breaking-anim" : "making-anim";
  const popupPolarity = sideType === "reactant" ? "in" : "out";
  const sign = sideType === "reactant" ? "+" : "-";

  if (targetMap.has(bondId)) {
    targetMap.delete(bondId);
    line.classList.remove(className);
  } else {
    targetMap.set(bondId, { bondType, energy });
    line.classList.add(className);
    playBondAnimation(line, animationClass);
    showEnergyPopup(line, `${sign}${energy}`, popupPolarity);
  }

  renderEnergyLists();
}

function playBondAnimation(line, animationClass) {
  line.classList.remove(animationClass);
  void line.getBoundingClientRect();
  line.classList.add(animationClass);

  window.setTimeout(() => {
    line.classList.remove(animationClass);
  }, 560);
}

function showEnergyPopup(line, label, polarity) {
  const svg = line.ownerSVGElement;
  if (!svg) {
    return;
  }

  const x1 = Number(line.getAttribute("x1"));
  const x2 = Number(line.getAttribute("x2"));
  const y1 = Number(line.getAttribute("y1"));
  const y2 = Number(line.getAttribute("y2"));

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", String((x1 + x2) / 2));
  text.setAttribute("y", String((y1 + y2) / 2 - 8));
  text.setAttribute("class", `energy-pop ${polarity}`);
  text.textContent = `${label} kJ/mol`;

  svg.append(text);
  window.setTimeout(() => {
    text.remove();
  }, 950);
}

function renderEnergyLists() {
  renderEnergyListFromMap(brokenList, state.broken);
  renderEnergyListFromMap(formedList, state.formed);

  const brokenTotal = sumMapValues(state.broken);
  const formedTotal = sumMapValues(state.formed);
  const netFlow = brokenTotal - formedTotal;

  brokenTotalEl.textContent = String(brokenTotal);
  formedTotalEl.textContent = String(formedTotal);
  energyInValue.textContent = String(brokenTotal);
  energyOutValue.textContent = String(formedTotal);
  netFlowValue.textContent = String(netFlow);
}

function renderEnergyListFromMap(listEl, map) {
  listEl.innerHTML = "";
  if (map.size === 0) {
    const li = document.createElement("li");
    li.textContent = "No bonds selected";
    listEl.append(li);
    return;
  }

  map.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.bondType}: ${entry.energy} kJ/mol`;
    listEl.append(li);
  });
}

function sumMapValues(map) {
  let total = 0;
  map.forEach((entry) => {
    total += entry.energy;
  });
  return total;
}

function calculateDeltaH() {
  const broken = sumMapValues(state.broken);
  const formed = sumMapValues(state.formed);
  const deltaH = broken - formed;

  const sign = deltaH > 0 ? "+" : "";
  const text = `ΔH = ${broken} - ${formed} = ${sign}${deltaH} kJ/mol`;

  resultBox.textContent =
    deltaH < 0
      ? `${text} (Exothermic)`
      : deltaH > 0
        ? `${text} (Endothermic)`
        : `${text} (Thermoneutral)`;

  resultBox.className = `result ${deltaH < 0 ? "exo" : deltaH > 0 ? "endo" : ""}`;
}

function renderBondTable() {
  const names = Object.keys(BOND_ENERGIES).sort();
  names.forEach((name) => {
    const chip = document.createElement("span");
    chip.className = "bond-chip";
    chip.textContent = `${name}: ${BOND_ENERGIES[name]}`;
    bondTable.append(chip);
  });
}

reactionSelect.addEventListener("change", () => {
  state.reactionIndex = Number(reactionSelect.value);
  clearSelections();
  renderReaction();
});

calcBtn.addEventListener("click", calculateDeltaH);

resetBtn.addEventListener("click", () => {
  clearSelections();
  renderReaction();
});

buildReactionOptions();
renderBondTable();
renderReaction();
