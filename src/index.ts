import { DungeonGenerator } from './generator/DungeonGenerator';
import { ControlPanel } from './ui/ControlPanel';
import { LayerPreviewPanel } from './ui/LayerPreview';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { Dungeon } from './core/Types';

class DungeonApp {
    private container: HTMLElement;
    private controlPanel: ControlPanel;
    private layerPreview: LayerPreviewPanel;
    private mainCanvas: HTMLCanvasElement;
    private dungeonGenerator?: DungeonGenerator;
    private renderer?: CanvasRenderer;
    private currentDungeon?: Dungeon;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.mainCanvas = document.createElement('canvas');
        
        const appContainer = document.createElement('div');
        appContainer.className = 'dungeon-app';
        this.container.appendChild(appContainer);
        
        const controlSidebar = document.createElement('div');
        controlSidebar.className = 'control-sidebar';
        
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        canvasContainer.appendChild(this.mainCanvas);
        mainContent.appendChild(canvasContainer);
        
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export as PNG';
        exportButton.addEventListener('click', () => this.exportDungeon());
        
        const exportContainer = document.createElement('div');
        exportContainer.className = 'export-container';
        exportContainer.appendChild(exportButton);
        mainContent.appendChild(exportContainer);
        
        appContainer.appendChild(controlSidebar);
        appContainer.appendChild(mainContent);
        
        this.controlPanel = new ControlPanel(
            controlSidebar, 
            this.generateDungeon.bind(this)
        );
        
        const layerPreviewContainer = document.createElement('div');
        layerPreviewContainer.className = 'layer-preview-container collapsed';
        
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Layer Preview';
        toggleButton.addEventListener('click', () => {
            layerPreviewContainer.classList.toggle('collapsed');
        });
        
        controlSidebar.appendChild(toggleButton);
        
        this.layerPreview = new LayerPreviewPanel(
            layerPreviewContainer, 
            400, 300
        );
        
        appContainer.appendChild(layerPreviewContainer);
        
        this.generateDungeon();
    }
    
    generateDungeon(): void {
        const params = this.controlPanel.getParams();
        
        this.dungeonGenerator = new DungeonGenerator(params);
        
        const dungeon = this.dungeonGenerator.generate();
        this.currentDungeon = dungeon;
        
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
    
    exportDungeon(): void {
        if (!this.renderer) {
            return;
        }
        
        const dataUrl = this.renderer.exportToPNG();
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `dungeon-${Date.now()}.png`;
        link.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('dungeon-app-container');
    
    if (!appContainer) {
        console.error('Could not find app container');
        return;
    }
    
    const app = new DungeonApp(appContainer);
});