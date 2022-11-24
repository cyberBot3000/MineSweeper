import { FIELDSIZE, MINES_COLUMN } from "./gameSettings.js";
import "./UI/process.js";
import {
	ROOT_ELEMENT,
	showMines,
	clearCells,
	openCell,
	markCell,
	clearCell,
	changeMarksCount,
	showGameOverScreen,
	hideGameOverScreen,
} from "./UI/process.js";
import { get2DimArr, outOfBounds, pointEquals, showElement } from "./utils.js";

let gameStarted = false;
let gameOvered = false;
let marksCount = MINES_COLUMN;
changeMarksCount(marksCount);

let cells = createEmptyCells();

ROOT_ELEMENT.addEventListener("gameInit", function (e) {
	hideGameOverScreen();
	cells = createEmptyCells();
	gameOvered = false;
	gameStarted = false;
	changeMarksCount(marksCount);
	marksCount = MINES_COLUMN;
	renderField();
});
ROOT_ELEMENT.addEventListener("gameStart", function (e) {
	cells = createEmptyCells();
	marksCount = MINES_COLUMN;
	clearCells();
	generateMines(e.detail.point, MINES_COLUMN);
	fillNearMines();

});
ROOT_ELEMENT.addEventListener("cellClicked", e => {
	let clickedPoint = e.detail.point;
	let clickedCell = cells[clickedPoint.row][clickedPoint.col];
	clickedCell.isClicked = true;
	if (!clickedCell.isActive) {
		return;
	}
	if (!gameStarted) {
		ROOT_ELEMENT.dispatchEvent(
			new CustomEvent("gameStart", {
				detail: {
					point: e.detail.point,
				},
			})
		);
		gameStarted = true;
	}
	if (clickedCell.isMine) {
		ROOT_ELEMENT.dispatchEvent(
			new CustomEvent("gameOver", {
				detail: {
					isWin: false,
				},
			})
		);
		return;
	}
	openGroupOfCells(clickedPoint);
});
ROOT_ELEMENT.addEventListener("cellMarked", function (e) {
	if (marksCount == 0) {
		return;
	}
	let currCell = cells[e.detail.point.row][e.detail.point.col];
	if (currCell.isOpened) return;
	if (currCell.isMarked) {
		marksCount++;
		currCell.isMarked = false;
		currCell.isActive = true;
		return;
	}
	marksCount--;
	currCell.isMarked = true;
	currCell.isActive = false;
});
ROOT_ELEMENT.addEventListener("gameOver", e => {
	showGameOverScreen(e.detail.isWin);
	showMines(cells);
	gameOvered = true;
});
ROOT_ELEMENT.addEventListener("fieldAction", () => {
	renderField();
	checkWin();
});

/**
 *
 * @param {{row: Number, col: Number}} clickPoint
 */
function generateMines(clickPoint, minesColumn) {
	while (minesColumn > 0) {
		let currMinePoint = {
			row: Math.floor(Math.random() * FIELDSIZE),
			col: Math.floor(Math.random() * FIELDSIZE),
		};
		let currCell = cells[currMinePoint.row][currMinePoint.col];

		if (pointEquals(clickPoint, currMinePoint) || currCell.isMine) {
			continue;
		}

		currCell.isMine = true;

		minesColumn--;
	}
}

/**
 *
 * @param {{col: Number, row: Number}} point
 */
function minesNear(point) {
	let minesCount = 0;
	for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
		for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
			let currPoint = {
				col: point.col + offsetCol,
				row: point.row + offsetRow,
			};
			if (outOfBounds(currPoint, FIELDSIZE, FIELDSIZE)) {
				continue;
			}
			minesCount += Number(cells[currPoint.row][currPoint.col].isMine);
		}
	}
	return minesCount;
}

function openGroupOfCells(startPosition) {
	if (outOfBounds(startPosition, FIELDSIZE, FIELDSIZE)) {
		return;
	}
	let currCell = cells[startPosition.row][startPosition.col];
	if (currCell.isOpened || !currCell.isActive) {
		return;
	}
	currCell.isOpened = true;
	currCell.isActive = false;
	if (currCell.minesNear != 0) {
		return;
	}
	for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
		for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
			let currPoint = {
				col: startPosition.col + offsetCol,
				row: startPosition.row + offsetRow,
			};

			if (pointEquals(currPoint, startPosition)) continue;
			openGroupOfCells(currPoint);
		}
	}
}

function fillNearMines() {
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			cells[i][j].minesNear = minesNear({ row: i, col: j });
		}
	}
}

/**
 *
 * @param {{isMine: Boolean, isOpened: Boolean, isMarked: Boolean, isClicked: Boolean, isActive: Boolean, minesNear: Number }} changedCell
 */
function renderField() {
	if (gameOvered) {
		return;
	}
	changeMarksCount(marksCount);
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			let currCell = cells[i][j];
			let currPos = { row: i, col: j };
			if (currCell.isMarked) {
				markCell(currPos);
				continue;
			}
			if (currCell.isOpened) {
				openCell(currPos, currCell.minesNear);
				continue;
			}
			clearCell(currPos);
		}
	}
}

/**
 *
 * @returns {Array<Array<{isMine: Boolean, isOpened: Boolean, isMarked: Boolean, isClicked: Boolean, isActive: Boolean, minesNear: Number }>>}
 */
function createEmptyCells() {
	return get2DimArr(FIELDSIZE, FIELDSIZE, {
		isMine: false,
		isOpened: false,
		isMarked: false,
		isClicked: false,
		isActive: true,
		minesNear: 0,
	});
}

function checkWin() {
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			if (cells[i][j].isActive) {
				return;
			}
		}
	}
	ROOT_ELEMENT.dispatchEvent(
		new CustomEvent("gameOver", {
			detail: {
				isWin: true,
			},
		})
	);
}
