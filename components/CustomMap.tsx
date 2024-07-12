// CustomMap.tsx
import * as THREE from 'three';

interface Cell {
  x: number;
  y: number;
  toggled: boolean;
}

let cells: Cell[] = [];
let canvas: HTMLCanvasElement;
let texture: THREE.Texture;

export const generateCustomMapTexture = (
  width: number,
  height: number,
  onTextureGenerated: (
    texture: THREE.Texture, 
    handleClick: (uv: THREE.Vector2) => void,
    getCells: () => Cell[]
  ) => void
) => {
  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  createCells(width, height);
  console.log(`Total cells created: ${cells.length}`);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    drawGrid(ctx, width, height);
    
    texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    onTextureGenerated(
      texture, 
      (uv: THREE.Vector2) => handleClick(uv, width, height),
      () => cells
    );
  };
  img.src = '/world.png';
};

const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, CELL_SIZE: number) => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;

  cells.forEach(cell => {
    ctx.strokeRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    if (cell.toggled) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
      ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    }
  });
};

const CELL_SIZE = 32;
const PADDING_PERCENTAGE = 0.1;

const createCells = (width: number, height: number) => {
  cells = [];
  const paddingY = height * PADDING_PERCENTAGE;
  const paddingX = width * PADDING_PERCENTAGE;
  
  for (let y = paddingY; y < height - paddingY; y += CELL_SIZE) {
    for (let x = paddingX; x < width - paddingX; x += CELL_SIZE) {
      cells.push({ x, y, toggled: false });
    }
  }
  console.log(`Created ${cells.length} cells`);
};

const handleClick = (uv: THREE.Vector2, width: number, height: number) => {
  console.log('handleClick called with UV:', uv);
  const x = Math.floor(uv.x * width);
  const y = Math.floor((1 - uv.y) * height);
  console.log('Calculated pixel coordinates:', { x, y });

  const cellX = Math.floor((x - width * PADDING_PERCENTAGE) / CELL_SIZE) * CELL_SIZE + width * PADDING_PERCENTAGE;
  const cellY = Math.floor((y - height * PADDING_PERCENTAGE) / CELL_SIZE) * CELL_SIZE + height * PADDING_PERCENTAGE;
  console.log('Calculated cell coordinates:', { cellX, cellY });

  const clickedCell = cells.find(cell => 
    cell.x <= x && x < cell.x + CELL_SIZE && 
    cell.y <= y && y < cell.y + CELL_SIZE
  );
  console.log('Found clicked cell:', clickedCell);
  
  if (clickedCell) {
    clickedCell.toggled = !clickedCell.toggled;
    console.log(`Cell at (${clickedCell.x}, ${clickedCell.y}) has been ${clickedCell.toggled ? 'toggled on' : 'toggled off'}`);

    updateTexture();
  } else {
    console.log('No cell found at the clicked location');
  }
};

// Modify the updateTexture function
const updateTexture = () => {
  console.log('Updating texture');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    drawGrid(ctx, canvas.width, canvas.height, CELL_SIZE);
    texture.needsUpdate = true;
    console.log('Texture updated');
  } else {
    console.log('Failed to get 2D context for canvas');
  }
};

// Add this function to log all cells
const logAllCells = () => {
  console.log('All cells:', cells);
};