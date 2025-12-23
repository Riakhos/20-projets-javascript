// ===========================
// GESTION NAVIGATION
// ===========================

document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // GESTION DU MENU BURGER
    // ===========================
    const burger = document.getElementById("burger-menu");
    const navUl = document.querySelector("#nav-menu");

    if (burger && navUl) {
        // Au clic sur le burger, ouvrir/fermer le menu
        burger.addEventListener("click", () => {
            navUl.classList.toggle("open");
            burger.src = navUl.classList.contains("open")
                ? "./assets/close.png"
                : "./assets/burger.png";
        });

        // Ferme le menu si on repasse en mode desktop lors d'un redimensionnement
        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                navUl.classList.remove("open");
                burger.src = "./assets/burger.png";
            }
        });

        // Fermer le menu quand on clique sur un lien en mode mobile
        // Sélectionner tous les liens sauf les dropdown-toggle
        const navLinks = navUl.querySelectorAll("a:not(.dropdown-toggle)");
        // Ajouter aussi tous les liens dans les dropdown-menu
        const dropdownLinks = navUl.querySelectorAll(".dropdown-menu a");

        // Combiner tous les liens
        const allLinks = [...navLinks, ...dropdownLinks];

        allLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 820) {
                    navUl.classList.remove("open");
                    burger.src = "./assets/burger.png";
                }
            });
        });
    } else {
        console.error("L'élément burger ou nav n'a pas été trouvé");
    }

    // ===========================
    // GESTION DES DROPDOWNS
    // ===========================
    const dropdowns = document.querySelectorAll(".dropdown");

    // Fonction pour fermer tous les dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("active");
        });
    }

    // Gestion des événements pour chaque dropdown
    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        // Gestion du clic sur le bouton toggle
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Si ce dropdown est déjà actif, le fermer
            if (dropdown.classList.contains("active")) {
                closeAllDropdowns();
                return;
            }

            // Fermer tous les autres dropdowns
            closeAllDropdowns();

            // Activer ce dropdown
            dropdown.classList.add("active");
        });

        // Empêcher la fermeture quand on clique à l'intérieur du dropdown
        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        if (dropdownMenu) {
            dropdownMenu.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }
    });

    // Fermer les dropdowns en cliquant ailleurs ou sur l'overlay mobile
    document.addEventListener("click", function (e) {
        // Si on clique sur l'overlay mobile (::before pseudo-element)
        const activeDropdown = document.querySelector(".dropdown.active");
        if (activeDropdown && window.innerWidth <= 820) {
            const dropdownMenu = activeDropdown.querySelector(".dropdown-menu");
            if (
                dropdownMenu &&
                !dropdownMenu.contains(e.target) &&
                !e.target.closest(".dropdown-toggle")
            ) {
                closeAllDropdowns();
            }
        } else if (!e.target.closest(".dropdown")) {
            closeAllDropdowns();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeAllDropdowns();
        }
    });

    // ===========================
    // LOGIQUE DE LA CALCULATRICE
    // ===========================
    const displayOutput = document.querySelector(".js-display-output");
    const displayHistory = document.querySelector(".js-display-history");
    const digitButtons = document.querySelectorAll(".js-key-digit");
    const operatorButtons = document.querySelectorAll(".js-key-op");
    const equalsButton = document.querySelector(".js-key-equals");
    const allClearButton = document.querySelector(".js-key-all-clear");
    const clearButton = document.querySelector(".js-key-clear");
    const signButton = document.querySelector(".js-key-sign");
    const percentButton = document.querySelector(".js-key-percent");
    const historyList = document.querySelector(".js-history-list");
    const historyClearButton = document.querySelector(".js-history-clear");
    const historyPanel = document.querySelector(".calculator__history-panel");

    const operatorSymbols = {
        add: "+",
        subtract: "−",
        multiply: "×",
        divide: "÷",
    };

    const calcState = {
        current: "0",
        previous: null,
        operator: null,
        overwrite: false,
        history: [],
    };

    digitButtons.forEach((button) => {
        button.addEventListener("click", handleDigit);
    });

    operatorButtons.forEach((button) => {
        button.addEventListener("click", handleOperator);
    });

    equalsButton.addEventListener("click", handleEquals);
    allClearButton.addEventListener("click", resetCalculator);
    clearButton.addEventListener("click", clearEntry);
    signButton.addEventListener("click", toggleSign);
    percentButton.addEventListener("click", applyPercent);
    historyClearButton.addEventListener("click", clearHistory);

    updateDisplays();
    updateHistoryVisibility();

    // ===========================
    // GESTION DU CLAVIER
    // ===========================
    document.addEventListener("keydown", handleKeyboard);

    function handleKeyboard(event) {
        const key = event.key;

        // Chiffres et décimal
        if (/^[0-9.]$/.test(key)) {
            event.preventDefault();
            const digitEvent = { currentTarget: { dataset: { digit: key } } };
            handleDigit(digitEvent);
            return;
        }

        // Opérateurs
        const operatorMap = {
            "+": "add",
            "-": "subtract",
            "*": "multiply",
            "/": "divide",
        };

        if (operatorMap[key]) {
            event.preventDefault();
            const operatorEvent = {
                currentTarget: { dataset: { action: operatorMap[key] } },
            };
            handleOperator(operatorEvent);
            return;
        }

        // Entrée pour le calcul
        if (key === "Enter") {
            event.preventDefault();
            handleEquals();
            return;
        }

        // Backspace pour effacer (Clear Entry)
        if (key === "Backspace") {
            event.preventDefault();
            clearEntry();
            return;
        }

        // Escape pour réinitialiser (All Clear)
        if (key === "Escape") {
            event.preventDefault();
            resetCalculator();
            return;
        }

        // % pour le pourcentage
        if (key === "%") {
            event.preventDefault();
            applyPercent();
            return;
        }
    }

    function handleDigit(event) {
        const digit = event.currentTarget.dataset.digit;

        if (calcState.overwrite) {
            calcState.current = digit === "." ? "0." : digit;
            calcState.overwrite = false;
        } else if (digit === "." && calcState.current.includes(".")) {
            return;
        } else if (calcState.current === "0" && digit !== ".") {
            calcState.current = digit;
        } else {
            calcState.current += digit;
        }

        updateDisplays();
    }

    function handleOperator(event) {
        const nextOperator = event.currentTarget.dataset.action;

        if (calcState.operator && !calcState.overwrite) {
            const result = computeResult();
            calcState.current = result;
            calcState.previous = result;
        } else {
            calcState.previous = calcState.current;
        }

        calcState.operator = nextOperator;
        calcState.overwrite = true;
        updateDisplays();
    }

    function handleEquals() {
        if (
            !calcState.operator ||
            calcState.previous === null ||
            calcState.overwrite
        )
            return;

        const expression = `${formatDisplay(calcState.previous)} ${operatorSymbols[calcState.operator]
            } ${formatDisplay(calcState.current)}`;
        const result = computeResult();

        calcState.history.unshift(`${expression} = ${formatDisplay(result)}`);
        calcState.history = calcState.history.slice(0, 8);
        renderHistory();

        calcState.current = result;
        calcState.previous = null;
        calcState.operator = null;
        calcState.overwrite = true;

        updateDisplays();
        displayHistory.textContent = `${expression} =`;
    }

    function toggleSign() {
        if (calcState.current === "0") return;

        if (calcState.overwrite) {
            calcState.previous = null;
            calcState.operator = null;
            calcState.overwrite = false;
        }

        calcState.current = calcState.current.startsWith("-")
            ? calcState.current.slice(1)
            : `-${calcState.current}`;

        updateDisplays();
    }

    function applyPercent() {
        const value = parseFloat(calcState.current);
        const result = roundNumber(value / 100).toString();
        calcState.current = result;
        calcState.overwrite = false;
        updateDisplays();
    }

    function resetCalculator() {
        calcState.current = "0";
        calcState.previous = null;
        calcState.operator = null;
        calcState.overwrite = false;
        displayHistory.textContent = "";
        updateDisplays();
    }

    function clearHistory() {
        calcState.history = [];
        renderHistory();
        updateHistoryVisibility();
    }

    function updateHistoryVisibility() {
        if (calcState.history.length === 0) {
            historyPanel.style.display = "none";
        } else {
            historyPanel.style.display = "block";
        }
    }

    function clearEntry() {
        // Construire la chaîne complète du calcul actuel
        let fullCalculation =
            calcState.previous !== null && calcState.operator
                ? `${calcState.previous}${operatorSymbols[calcState.operator]}${calcState.current
                }`
                : calcState.current;

        // Si on est en mode overwrite ou qu'il ne reste que "0", ne rien faire
        if (fullCalculation === "0") return;

        // Supprimer le dernier caractère
        fullCalculation = fullCalculation.slice(0, -1);

        // Si vide après suppression, remettre à "0"
        if (fullCalculation === "" || fullCalculation === "-") {
            calcState.current = "0";
            calcState.previous = null;
            calcState.operator = null;
            calcState.overwrite = false;
            updateDisplays();
            return;
        }

        // Re-parser la chaîne pour reconstruire l'état
        const operatorMatch = fullCalculation.match(/[+−×÷]/);

        if (operatorMatch) {
            const operatorPos = fullCalculation.indexOf(operatorMatch[0]);
            calcState.previous = fullCalculation.slice(0, operatorPos);

            // Retrouver l'opérateur dans operatorSymbols
            const operatorKey = Object.keys(operatorSymbols).find(
                (key) => operatorSymbols[key] === operatorMatch[0]
            );
            calcState.operator = operatorKey;

            const afterOperator = fullCalculation.slice(operatorPos + 1);
            if (afterOperator === "") {
                // L'opérateur a été supprimé, remettre current à previous
                calcState.current = calcState.previous;
                calcState.previous = null;
                calcState.operator = null;
            } else {
                calcState.current = afterOperator;
            }
            calcState.overwrite = false;
        } else {
            // Pas d'opérateur, juste un nombre
            calcState.current = fullCalculation;
            calcState.previous = null;
            calcState.operator = null;
            calcState.overwrite = false;
        }

        updateDisplays();
    }

    function computeResult() {
        const first = parseFloat(calcState.previous ?? "0");
        const second = parseFloat(calcState.current);
        let value = second;

        switch (calcState.operator) {
            case "add":
                value = first + second;
                break;
            case "subtract":
                value = first - second;
                break;
            case "multiply":
                value = first * second;
                break;
            case "divide":
                value = second === 0 ? Number.NaN : first / second;
                break;
        }

        return roundNumber(value).toString();
    }

    function roundNumber(value) {
        return Number.parseFloat(value.toFixed(10));
    }

    function updateDisplays() {
        displayOutput.textContent = formatDisplay(calcState.current);

        if (calcState.operator && calcState.previous !== null) {
            const symbol = operatorSymbols[calcState.operator];
            displayHistory.textContent = `${formatDisplay(
                calcState.previous
            )} ${symbol}`;
        } else if (!calcState.operator) {
            displayHistory.textContent = "";
        }
    }

    function formatDisplay(value) {
        return value.toString().replaceAll(".", ",");
    }

    function renderHistory() {
        historyList.innerHTML = "";
        const fragment = document.createDocumentFragment();

        calcState.history.forEach((entry) => {
            const item = document.createElement("li");
            item.classList.add("calculator__history-item");
            item.textContent = entry;
            fragment.appendChild(item);
        });

        historyList.appendChild(fragment);
        updateHistoryVisibility();
    }
});
