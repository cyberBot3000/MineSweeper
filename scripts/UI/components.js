export function createGameOverScreen() {
	let gameOverScreen = document.createElement("div");
	gameOverScreen.classList.add("game-over");
	gameOverScreen.appendChild(createDiv("game-over__text", "Игра окончена"));
	return gameOverScreen;
}
export function createButton(className, innerText = "") {
	let button = document.createElement("button");
	button.textContent = innerText;
	button.classList.add(className.split(" "));
	return button;
}
export function createDiv(className, innerText = "") {
	let div = document.createElement("div");
	div.textContent = innerText;
	div.classList.add(className.split(" "));
	return div;
}

export function createField(fieldsize) {
	let field = document.createElement("div");
	field.classList.add("field");
	for (let i = 0; i < fieldsize; i++) {
		for (let j = 0; j < fieldsize; j++) {
			field.appendChild(createCell());
		}
	}
	return field;
}

export function createCell() {
	let cell = document.createElement("div");
	cell.classList.add("cell", "cell_closed", "cell_active");
	return cell;
}
