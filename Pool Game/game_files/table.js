export let tableWidth = 800;
export let tableHeight = (tableWidth * 59) / 103;

export function setupTable() {
    createCanvas(tableWidth, tableHeight, WEBGL);
}
