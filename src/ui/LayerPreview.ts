import { LayerOptions } from '../core/Types';
import { LayerManager } from '../renderer/LayerManager';
import { Random } from '../core/Random';

/**
 * UI component for previewing texture layers
 */
export class LayerPreviewPanel {
  private container: HTMLElement;
  private previewCanvas: HTMLCanvasElement;
  private layerControls: Map<string, LayerControlUI>;
  private layerManager: LayerManager;
  public element: HTMLElement;
  
  /**
   * Create a new layer preview panel
   * @param container HTML element to place the preview in
   * @param width Canvas width
   * @param height Canvas height
   */
  constructor(container: HTMLElement, width: number, height: number) {
    this.container = container;
    this.element = container;
    this.previewCanvas = document.createElement('canvas');
    this.previewCanvas.width = width;
    this.previewCanvas.height = height;
    
    // Create a layer manager with a random seed
    this.layerManager = new LayerManager(width, height, Math.random().toString());
    
    this.layerControls = new Map();
    
    this.initializeUI();
  }
  
  /**
   * Initialize the UI
   */
  private initializeUI(): void {
    // Create canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'layer-preview-canvas';
    canvasContainer.appendChild(this.previewCanvas);
    this.container.appendChild(canvasContainer);
    
    // Create panel title
    const title = document.createElement('h2');
    title.textContent = 'Texture Layer Preview';
    this.container.appendChild(title);
    
    // Create layer control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'layer-control-panel';
    
    // Add layer controls
    this.addLayerControl(controlPanel, 'grid', 'Grid Layer');
    this.addLayerControl(controlPanel, 'rocks', 'Rock Debris');
    this.addLayerControl(controlPanel, 'cracks', 'Cracks');
    this.addLayerControl(controlPanel, 'dots', 'Dots');
    
    this.container.appendChild(controlPanel);
    
    // Add refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Preview';
    refreshButton.addEventListener('click', () => {
      // Create a new layer manager with a new random seed
      this.layerManager = new LayerManager(
        this.previewCanvas.width, 
        this.previewCanvas.height, 
        Math.random().toString()
      );
      this.updatePreview();
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(refreshButton);
    this.container.appendChild(buttonContainer);
    
    // Initial render
    this.updatePreview();
  }
  
  /**
   * Add a layer control to the panel
   * @param panel Panel to add the control to
   * @param layerType Type of layer
   * @param label Label for the control
   */
  private addLayerControl(panel: HTMLElement, layerType: string, label: string): void {
    const control = new LayerControlUI(layerType, label, {
      opacity: 0.2,
      density: 1.0,
      scale: 1.0,
      color: '#000000',
      visible: true
    });
    
    control.onChange(() => this.updatePreview());
    panel.appendChild(control.element);
    this.layerControls.set(layerType, control);
  }
  
  /**
   * Update the preview canvas
   */
  updatePreview(): void {
    const ctx = this.previewCanvas.getContext('2d')!;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    
    // Generate and draw each visible layer
    for (const [layerType, control] of this.layerControls.entries()) {
      if (control.options.visible) {
        const layer = this.layerManager.generateLayer(layerType, control.options);
        ctx.drawImage(layer, 0, 0);
      }
    }
  }
  
  /**
   * Get the current layer options
   * @returns Map of layer types to their options
   */
  getLayerOptions(): Record<string, LayerOptions> {
    const options: Record<string, LayerOptions> = {};
    
    for (const [layerType, control] of this.layerControls.entries()) {
      options[layerType] = {...control.options};
    }
    
    return options;
  }
}

/**
 * UI component for controlling a single layer
 */
export class LayerControlUI {
  public element: HTMLElement;
  public options: LayerOptions;
  private changeCallbacks: Array<() => void> = [];
  
  /**
   * Create a new layer control
   * @param layerType Type of layer
   * @param label Label for the control
   * @param defaultOptions Default layer options
   */
  constructor(layerType: string, label: string, defaultOptions: LayerOptions) {
    this.options = {...defaultOptions};
    this.element = document.createElement('div');
    this.element.className = 'layer-control';
    this.element.dataset.layerType = layerType;
    
    // Build UI elements
    this.buildHeader(label);
    this.buildOpacityControl();
    this.buildDensityControl();
    this.buildScaleControl();
    this.buildColorControl();
    this.buildVisibilityToggle();
  }
  
  /**
   * Add a change callback
   * @param callback Function to call when the control changes
   */
  onChange(callback: () => void): void {
    this.changeCallbacks.push(callback);
  }
  
  /**
   * Trigger change callbacks
   */
  private triggerChange(): void {
    for (const callback of this.changeCallbacks) {
      callback();
    }
  }
  
  /**
   * Build the header element
   * @param label Label for the control
   */
  private buildHeader(label: string): void {
    const header = document.createElement('h3');
    header.textContent = label;
    this.element.appendChild(header);
  }
  
  /**
   * Build the opacity control
   */
  private buildOpacityControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Opacity:';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.05';
    slider.value = this.options.opacity.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = this.options.opacity.toString();
    
    slider.addEventListener('input', () => {
      this.options.opacity = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    this.element.appendChild(container);
  }
  
  /**
   * Build the density control
   */
  private buildDensityControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Density:';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '2';
    slider.step = '0.1';
    slider.value = this.options.density.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = this.options.density.toString();
    
    slider.addEventListener('input', () => {
      this.options.density = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    this.element.appendChild(container);
  }
  
  /**
   * Build the scale control
   */
  private buildScaleControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Scale:';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.2';
    slider.max = '3';
    slider.step = '0.1';
    slider.value = this.options.scale.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = this.options.scale.toString();
    
    slider.addEventListener('input', () => {
      this.options.scale = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    this.element.appendChild(container);
  }
  
  /**
   * Build the color control
   */
  private buildColorControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Color:';
    
    const input = document.createElement('input');
    input.type = 'color';
    input.value = this.options.color;
    
    input.addEventListener('input', () => {
      this.options.color = input.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(input);
    this.element.appendChild(container);
  }
  
  /**
   * Build the visibility toggle
   */
  private buildVisibilityToggle(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = this.options.visible;
    
    const label = document.createElement('label');
    label.textContent = 'Visible';
    
    checkbox.addEventListener('change', () => {
      this.options.visible = checkbox.checked;
      this.triggerChange();
    });
    
    container.appendChild(checkbox);
    container.appendChild(label);
    this.element.appendChild(container);
  }
}