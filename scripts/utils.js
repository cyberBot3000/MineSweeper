export function pointEquals(left, right){
    return left.col === right.col && left.row === right.row;
}

/**
 *
 * @param {{col: Number, row: Number}} point
 * @param {Array< Array<Number> >} pointsArr
 */
export function outOfBounds(point, width, height) {
    return point.row < 0 || point.row >= width || point.col < 0 || point.col >= height;
}


export function get2DimArr(width, height, fillVal=0){
    let arr = [];
    for (let i = 0; i < height; i++) {
        arr.push([]);
        for (let j = 0; j < width; j++) {
            if(typeof fillVal == 'object'){
                arr[i].push({...fillVal});
                continue
            }
            arr[i].push(fillVal);
        }
    }
    return arr;
}

export function showElement(htmlElem){
	htmlElem.classList.add("active");
}
export function hideElement(htmlElem){
	htmlElem.classList.remove("active");
}

/**
 *
 * @param {HTMLElement} parentElem
 * @param {HTMLElement} childElem
 */
export function findChildIndex(parentElem, childElem){
    return Array.from(parentElem.children).indexOf(childElem);
}

export function indexToPoint(index, fieldWidth){
    let row = Math.floor(index / fieldWidth);
    let col = index - row * fieldWidth;
    return {
        row: row,
        col: col
    }
}

export function pointToIndex(point, fieldWidth){
    return point.row * fieldWidth + point.col
}