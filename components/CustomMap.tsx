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

let cells: Cell[] = [];
let canvas: HTMLCanvasElement;
let texture: THREE.Texture;

const CELL_SIZE_LAT = 10; // Size of cells in degrees (latitude)
const CELL_SIZE_LON = 10; // Size of cells in degrees (longitude)

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
    const x = (cell.x + 180) / 360 * width;
    const y = (80 + cell.y) / 180 * height;
    const cellWidth = CELL_SIZE_LON / 360 * width;
    const cellHeight = CELL_SIZE_LAT / 180 * height;

    ctx.strokeRect(x, y, cellWidth, cellHeight);
    if (cell.toggled) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(x, y, cellWidth, cellHeight);
    }
  });
};

const createCells = (width: number, height: number) => {
  cells = [];
  for (let lat = 90; lat > -90; lat -= CELL_SIZE_LAT) {
    for (let lon = -180; lon < 180; lon += CELL_SIZE_LON) {
      cells.push({
        id: `Cell-${lon}-${lat}`,
        x: lon,
        y: lat,
        toggled: false,
        owner: '',
        turnCaptured: 0,
        name: `Cell ${lon}-${lat}`
      });
    }
  }
  console.log(`Created ${cells.length} cells`);
};

const handleClick = (uv: THREE.Vector2, width: number, height: number, onCellClick: (cell: Cell) => void) => {
  console.log('handleClick called with UV:', uv);
  const lon = uv.x * 360 - 180;
  const lat = 90 - uv.y * 180;
  console.log('Calculated coordinates:', { lon, lat });

  const clickedCell = cells.find(cell => 
    cell.x <= lon && lon < cell.x + CELL_SIZE_LON && 
    cell.y >= lat && lat > cell.y - CELL_SIZE_LAT
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