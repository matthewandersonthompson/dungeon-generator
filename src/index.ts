import { DungeonGenerator } from './generator/DungeonGenerator';
import { ControlPanel } from './ui/ControlPanel';
import { LayerPreviewPanel } from './ui/LayerPreview';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { Dungeon } from './core/Types';

/**
 * Main application class
 */
class DungeonApp {
  private container: HTMLElement;
  private controlPanel: ControlPanel;
  private layerPreview: LayerPreviewPanel;
  private mainCanvas: HTMLCanvasElement;
  private dungeonGenerator?: DungeonGenerator;
  private renderer?: CanvasRenderer;
  private currentDungeon?: Dungeon;
  
  /**
   * Create a new dungeon app
   * @param container HTML element to place the app in
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.mainCanvas = document.createElement('canvas');
    
    // Create app container
    const appContainer = document.createElement('div');
    appContainer.className = 'dungeon-app';
    this.container.appendChild(appContainer);
    
    // Create left sidebar for controls
    const controlSidebar = document.createElement('div');
    controlSidebar.className = 'control-sidebar';
    
    // Create main content area
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    
    // Add canvas to main content
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.appendChild(this.mainCanvas);
    mainContent.appendChild(canvasContainer);
    
    // Add an export button below the canvas
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export as PNG';
    exportButton.addEventListener('click', () => this.exportDungeon());
    
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-container';
    exportContainer.appendChild(exportButton);
    mainContent.appendChild(exportContainer);
    
    // Add controls and main content to app container
    appContainer.appendChild(controlSidebar);
    appContainer.appendChild(mainContent);
    
    // Initialize UI components
    this.controlPanel = new ControlPanel(
      controlSidebar, 
      this.generateDungeon.bind(this)
    );
    
    // Create collapsible layer preview panel
    const layerPreviewContainer = document.createElement('div');
    layerPreviewContainer.className = 'layer-preview-container collapsed';
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Layer Preview';
    toggleButton.addEventListener('click', () => {
      layerPreviewContainer.classList.toggle('collapsed');
    });
    
    controlSidebar.appendChild(toggleButton);
    
    // Initialize layer preview
    this.layerPreview = new LayerPreviewPanel(
      layerPreviewContainer, 
      400, 300
    );
    
    // Append the layer preview to the main container
    appContainer.appendChild(layerPreviewContainer);
    
    // Initial setup
    this.generateDungeon();
  }
  
  /**
   * Generate a dungeon with current parameters
   */
  generateDungeon(): void {
    // Get parameters from control panel
    const params = this.controlPanel.getParams();
    
    // Create dungeon generator
    this.dungeonGenerator = new DungeonGenerator(params);
    
    // Generate dungeon
    const dungeon = this.dungeonGenerator.generate();
    this.currentDungeon = dungeon;
    
    // Render with layer options from preview
    this.renderer = new CanvasRenderer(
      this.mainCanvas, 
      dungeon, 
      {
        cellSize: 24,
        padding: 10,
        layerOptions: this.layerPreview.getLayerOptions()
      }
    );
    
    this.renderer.render();
  }
  
  /**
   * Export the current dungeon as a PNG
   */
  exportDungeon(): void {
    if (!this.renderer) {
      return;
    }
    
    const dataUrl = this.renderer.exportToPNG();
    
    // Create a temporary link element to download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `dungeon-${Date.now()}.png`;
    link.click();
  }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('dungeon-app-container');
  
  if (!appContainer) {
    console.error('Could not find app container');
    return;
  }
  
  // Create the app
  const app = new DungeonApp(appContainer);
});