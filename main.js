const VALUES = {
  preset: "",
  axiom: "",
  rules: "",
  sentence: "",
  interval: "",
  iterations: "",
  leafLength: "",
  leafAlpha: "",
  leafWidth: "",
  leafColor: "",
  branchLength: "",
  branchWidth: "",
  branchAngle: "",
  branchColor: "",
  branchFalloff: "",
  animation: "",
  animationSpeed: "",
  animationMax: "",
};

const PRESETS = [
  {
    axiom: "X",
    rules: {
      F: "FF",
      X: "F+[-F-XF-X][+FF][--XF[+X]][++F-X]",
    },
  },
  {
    axiom: "FX",
    rules: {
      F: "FF+[+F-F-F]-[-F+F+F]",
    },
  },
  {
    axiom: "X",
    rules: {
      F: "FX[FX[+XF]]",
      X: "FF[+XZ++X-F[+ZX]][-X++F-X]",
      Z: "[+F-X-F][++ZX]",
    },
  },
  {
    axiom: "F",
    rules: {
      F: "F > F[+F]F[-F]F",
    },
  },
  {
    axiom: "F",
    rules: {
      F: "F[+F]F[-F][F]",
    },
  },
  {
    axiom: "X",
    rules: {
      X: "F[-X]F+X",
    },
  },
];

const handleSubmit = (e) => {
  e.preventDefault();
  resetInterval();
  updateValues();
  applyRules();
  renderCanvas();
};

const resizeCanvas = () => {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  resetInterval();
  renderCanvas();
};

const initializeApp = () => {
  resizeCanvas();
  const presets = document.querySelector("#presets");
  const form = document.querySelector("#form");
  VALUES.animationMax = document
    .getElementById("animation.speed")
    .getAttribute("max");
  presets.setAttribute("max", PRESETS.length - 1);
  form.onsubmit = handleSubmit;
};

const resetInterval = () => {
  if (VALUES.interval) {
    clearInterval(VALUES.interval);
    VALUES.interval = "";
  }
};

const updateValues = () => {
  VALUES.preset = document.getElementById("presets").valueAsNumber;
  VALUES.iterations = document.getElementById("iterations").valueAsNumber;
  VALUES.animation = document.getElementById("animation").checked;
  VALUES.animationSpeed =
    document.getElementById("animation.speed").valueAsNumber;
  VALUES.leafLength = document.getElementById("leaf.length").valueAsNumber;
  VALUES.leafAlpha = document.getElementById("leaf.alpha").value;
  VALUES.leafWidth = document.getElementById("leaf.width").valueAsNumber;
  VALUES.leafColor = document.getElementById("leaf.color").value;
  VALUES.branchLength = document.getElementById("branch.length").valueAsNumber;
  VALUES.branchWidth = document.getElementById("branch.width").valueAsNumber;
  VALUES.branchAngle = document.getElementById("branch.angle").valueAsNumber;
  VALUES.branchColor = document.getElementById("branch.color").value;
  VALUES.branchFalloff = document.getElementById("branch.falloff").value;

  VALUES.axiom = PRESETS[VALUES.preset].axiom;
  VALUES.rules = PRESETS[VALUES.preset].rules;
};

const applyRules = () => {
  for (let i = 0; i < VALUES.iterations; i++) {
    let newSentence = "";
    for (let j = 0; j < VALUES.axiom.length; j++) {
      const currentLetter = VALUES.axiom[j];
      if (VALUES.rules[currentLetter]) {
        newSentence += VALUES.rules[currentLetter];
      } else {
        newSentence += currentLetter;
      }
    }
    VALUES.axiom = newSentence;
    VALUES.branchLength *= VALUES.branchFalloff;
  }
  VALUES.sentence = VALUES.axiom;
};

const executeSteps = (counter, context) => {
  if (counter !== VALUES.sentence.length) {
    const currentLetter = VALUES.sentence[counter];

    switch (currentLetter) {
      case "F":
        context.fillStyle = VALUES.branchColor;
        context.fillRect(0, 0, VALUES.branchWidth, -VALUES.branchLength);
        context.transform(1, 0, 0, 1, 0, -VALUES.branchLength);
        break;
      case "+":
        context.rotate((VALUES.branchAngle * Math.PI) / 180);
        break;
      case "-":
        context.rotate((-VALUES.branchAngle * Math.PI) / 180);
        break;
      case "[":
        context.save();
        break;
      case "]":
        context.fillStyle = VALUES.leafColor;
        context.globalAlpha = VALUES.leafAlpha;

        context.scale(VALUES.leafWidth, VALUES.leafLength);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(1, -1);
        context.lineTo(0, -4);
        context.lineTo(-1, -1);
        context.lineTo(0, 0);
        context.closePath();
        context.fill();

        context.restore();
        break;
      default:
        break;
    }
  } else {
    resetInterval();
  }
};

const renderCanvas = () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context.resetTransform();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.transform(1, 0, 0, 1, canvas.width / 2, canvas.height);

  let counter = 0;
  if (VALUES.animation) {
    VALUES.interval = setInterval(() => {
      executeSteps(counter, context);
      counter++;
    }, VALUES.animationMax - VALUES.animationSpeed);
  } else {
    while (counter < VALUES.sentence.length) {
      executeSteps(counter, context);
      counter++;
    }
  }
};

const toggleMenu = (forceClose) => {
  const menu = document.getElementById("menu");
  const canvas = document.getElementById("canvas");
  const changeState = (left = "-300px", action = "remove") => {
    menu.style.left = left;
    canvas.classList[action]("darken");
  };

  if (forceClose) {
    changeState();
    return;
  }
  if (menu.style.left === "10px") {
    changeState();
  } else {
    changeState("10px", "add");
  }
};

const handleClose = (e) => {
  const menu = document.getElementById("menu");
  let targetElement = e.target;

  if (
    menu.style.left === "10px" &&
    targetElement.getAttribute("id") !== "toggle"
  ) {
    do {
      if (targetElement == menu) return;
      targetElement = targetElement.parentNode;
    } while (targetElement);

    toggleMenu(true);
  }
};

window.addEventListener("DOMContentLoaded", initializeApp);

window.addEventListener("resize", resizeCanvas, false);

document.addEventListener("click", handleClose);
