// CustomMap.tsx
import * as THREE from 'three';

export interface Cell {
  id: string;
  x: number;
  y: number;
  toggled: boolean;
  owner: string;
  turnCaptured: number;
  name: string;
}

interface CustomMapProps {
  width: number;
  height: number;
  cellsX: number;
  cellsY: number;
  onCellClick: (cell: Cell) => void;
}

let cells: Cell[] = [];
let canvas: HTMLCanvasElement;
let texture: THREE.Texture;

export const generateCustomMapTexture = (
  width: number,
  height: number,
  onCellClick: (cell: Cell) => void,
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
      (uv: THREE.Vector2) => handleClick(uv, width, height, onCellClick),
      () => cells
    );
  };
  img.src = '/world.png';
};

const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.lineWidth = 1;

  cells.forEach(cell => {
    ctx.strokeRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    if (cell.toggled) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red with 50% opacity
      ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
    }
  });
};

const CELL_SIZE = 128;
const PADDING_PERCENTAGE = 0.1;

const createCells = (width: number, height: number) => {
  cells = [];
  const paddingY = Math.floor(height * PADDING_PERCENTAGE);
  const paddingX = Math.floor(width * PADDING_PERCENTAGE);
  
  for (let y = paddingY; y < height - paddingY; y += CELL_SIZE) {
    for (let x = paddingX; x < width - paddingX; x += CELL_SIZE) {
      cells.push({
        id: `Cell-${x}-${y}`,
        x,
        y,
        toggled: false,
        owner: '',
        turnCaptured: 0,
        name: `Cell ${x}-${y}`
      });
    }
  }
  console.log(`Created ${cells.length} cells`);
};

const handleClick = (uv: THREE.Vector2, width: number, height: number, onCellClick: (cell: Cell) => void) => {
  console.log('handleClick called with UV:', uv);
  const x = Math.floor(uv.x * width);
  const y = Math.floor((1 - uv.y) * height);
  console.log('Calculated pixel coordinates:', { x, y });

  const clickedCell = cells.find(cell => 
    cell.x <= x && x < cell.x + CELL_SIZE && 
    cell.y <= y && y < cell.y + CELL_SIZE
  );
  console.log('Found clicked cell:', clickedCell);
  
  if (clickedCell) {
    clickedCell.toggled = !clickedCell.toggled;
    console.log(`Cell at (${clickedCell.x}, ${clickedCell.y}) has been ${clickedCell.toggled ? 'toggled on' : 'toggled off'}`);

    onCellClick(clickedCell);
    updateTexture();
  } else {
    console.log('No cell found at the clicked location');
  }
};

const updateTexture = () => {
  console.log('Updating texture');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the background image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Redraw the grid and toggled cells
      drawGrid(ctx, canvas.width, canvas.height);
      
      // Update the texture
      if (texture) {
        texture.needsUpdate = true;
        console.log('Texture updated');
      }
    };
    img.src = '/world.png';
  } else {
    console.log('Failed to get 2D context for canvas');
  }
};

// Add this function to log all cells
const logAllCells = () => {
  console.log('All cells:', cells);
};
