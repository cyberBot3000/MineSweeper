import { COLORS, FIELDSIZE } from "../gameSettings.js";
import { createButton, createDiv, createField, createGameOverScreen } from "./components.js";
import { hideElement, indexToPoint, pointToIndex, showElement } from "../utils.js";

export const ROOT_ELEMENT = document.getElementById("root");
const GAMEFIELD = createField(FIELDSIZE);
const countField = createDiv('marks-count');
const countFieldHeading = createDiv('marks-count__heading', 'Флажков осталось: ');
const countFieldColumn = createDiv('marks-count__column', '0');
const gameOverScreen = createGameOverScreen();
const gameOverMessageField = createDiv('game-over__message-field');
gameOverScreen.appendChild(gameOverMessageField);
const playAgainBtn = createButton('game-over__play-again-btn', 'играть снова');
gameOverScreen.appendChild(playAgainBtn);
playAgainBtn.addEventListener('click', (e) => {
	e.preventDefault();
	ROOT_ELEMENT.dispatchEvent(new CustomEvent("gameInit"));
})
GAMEFIELD.style.setProperty('--cells-count', FIELDSIZE);
countField.appendChild(countFieldHeading);
countField.appendChild(countFieldColumn);

ROOT_ELEMENT.appendChild(countField);
ROOT_ELEMENT.appendChild(GAMEFIELD);
ROOT_ELEMENT.appendChild(gameOverScreen);

document.querySelectorAll(".cell").forEach((elem, index) => {
	elem.addEventListener("click", e => {
		ROOT_ELEMENT.dispatchEvent(
			new CustomEvent("cellClicked", {
				detail: {
					point: indexToPoint(index, FIELDSIZE),
				},
			})
		);
		ROOT_ELEMENT.dispatchEvent(
			new CustomEvent("fieldAction", {
				detail: {
					point: indexToPoint(index, FIELDSIZE),
				},
			})
		);
	});
	elem.addEventListener("contextmenu", function (event) {
		event.preventDefault();
		ROOT_ELEMENT.dispatchEvent(
			new CustomEvent("cellMarked", {
				detail: {
					point: indexToPoint(index, FIELDSIZE),
				},
			})
		);
		ROOT_ELEMENT.dispatchEvent(
			new CustomEvent("fieldAction", {
				detail: {
					point: indexToPoint(index, FIELDSIZE),
				},
			})
		);
	});
});


/**
 *
 * @param {Array<Array<{isMine: Boolean, isOpened: Boolean, isMarked: Boolean, isClicked: Boolean, isActive: Boolean, minesNear: Number }>>} cells
 */
export function showMines(cells) {
	for (let i = 0; i < FIELDSIZE; i++) {
		for (let j = 0; j < FIELDSIZE; j++) {
			if (!cells[i][j].isMine) continue;

			let mine = Array.from(GAMEFIELD.children)[i * FIELDSIZE + j];
			mine.textContent = "X";
			mine.classList.add("cell_mine");
		}
	}
}

export function clearCells() {
	Array.from(GAMEFIELD.children).forEach(elem => {
		elem.innerHTML = "";
		elem.className = "cell cell_closed cell_active";
	});
}
export function clearCell(position) {
	let cell = Array.from(GAMEFIELD.children)[pointToIndex(position, FIELDSIZE)];
	cell.innerHTML = "";
	cell.className = "cell cell_closed cell_active";
}
/**
 *
 * @param {{col: Number, row: Number}} position
 * @param {Number} minesNear
 */
export function openCell(position, minesNear) {
	let allCells = Array.from(GAMEFIELD.children);
	let currCell = allCells[pointToIndex(position, FIELDSIZE)];
	currCell.classList.remove("cell_closed", "cell_active");
	currCell.style.setProperty("--bg-col", COLORS[minesNear.toString()]);
	if (minesNear != 0) {
		currCell.textContent = minesNear;
	}
}


/**
 *
 * @param {{col: Number, row: Number}}} cellPosPoint
 */
export function markCell(position) {
	let targetCell = getCell(position);
	targetCell.textContent = "!";
	targetCell.classList.remove("cell_active");
	targetCell.classList.add("cell_marked");
}

export function disableMark(position) {
	if (!isMarked(position)) return;
	let targetCell = getCell(position);
	targetCell.innerHTML = "";
	targetCell.classList.remove("cell_marked");
	targetCell.classList.add("cell_active");
}

export function changeMarksCount(newCount){
	countFieldColumn.textContent = newCount;
}

export function showGameOverScreen(isWin){
	if(isWin){
		gameOverMessageField.textContent = 'Поздравляем, Вы победили!'
	}
	else {
		gameOverMessageField.textContent = 'Вы проиграли(('
	}
	showElement(gameOverScreen);
}

export function hideGameOverScreen(){
	hideElement(gameOverScreen);
}

function getCell(position){
	return Array.from(GAMEFIELD.children)[pointToIndex(position, FIELDSIZE)];
}