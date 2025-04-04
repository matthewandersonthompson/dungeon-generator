import { DungeonParams } from '../core/Types';
import { DungeonParamsBuilder } from '../generator/DungeonParams';

/**
 * UI control panel for dungeon generation
 */
export class ControlPanel {
  private container: HTMLElement;
  private onGenerateCallback: () => void;
  private controls: Map<string, HTMLInputElement | HTMLSelectElement> = new Map();
  private presets: Map<string, DungeonParams> = new Map();
  
  /**
   * Create a new control panel
   * @param container HTML element to place the control panel in
   * @param onGenerate Callback for when the generate button is clicked
   */
  constructor(container: HTMLElement, onGenerate: () => void) {
    this.container = container;
    this.onGenerateCallback = onGenerate;
    
    // Set up presets
    this.presets.set('default', DungeonParamsBuilder.createDefault());
    this.presets.set('small', DungeonParamsBuilder.createSmall());
    this.presets.set('large', DungeonParamsBuilder.createLarge());
    this.presets.set('cave', DungeonParamsBuilder.createCave());
    this.presets.set('maze', DungeonParamsBuilder.createMaze());
    this.presets.set('loopy', DungeonParamsBuilder.createLoopy());
    this.presets.set('temple', DungeonParamsBuilder.createTemple());
    
    this.initUI();
  }
  
  /**
   * Initialize the UI
   */
  private initUI(): void {
    // Create preset dropdown
    this.createPresetSelector();
    
    // Create number inputs
    this.createNumberInput('width', 'Width:', 10, 100, 1, 50);
    this.createNumberInput('height', 'Height:', 10, 100, 1, 50);
    this.createNumberInput('numRooms', 'Rooms:', 1, 50, 1, 15);
    
    // Create sliders
    this.createSlider('roomDensity', 'Room Density:', 0, 1, 0.05, 0.5);
    this.createSlider('roomSizeVariation', 'Size Variation:', 0, 1, 0.05, 0.5);
    this.createSlider('specialRoomChance', 'Special Rooms:', 0, 1, 0.05, 0.2);
    this.createSlider('featureDensity', 'Feature Density:', 0, 1, 0.05, 0.5);
    
    // Create number inputs
    this.createNumberInput('corridorWidth', 'Corridor Width:', 1, 3, 1, 1);
    
    // Create checkbox
    this.createCheckbox('createLoops', 'Create Loops', true);
    
    // Create slider (only shown when loops are enabled)
    this.createSlider('loopChance', 'Loop Chance:', 0, 1, 0.05, 0.3);
    
    // Create hallway style dropdown
    this.createDropdown('hallwayStyle', 'Hallway Style:', [
      { value: 'straight', label: 'Straight' },
      { value: 'bendy', label: 'Bendy' },
      { value: 'organic', label: 'Organic' }
    ], 'bendy');
    
    // Create door controls
    this.createSlider('doorFrequency', 'Door Frequency:', 0, 1, 0.05, 0.8);
    this.createSlider('secretDoorChance', 'Secret Door Chance:', 0, 1, 0.05, 0.1);
    
    // Create theme dropdown
    this.createDropdown('theme', 'Theme:', [
      { value: 'standard', label: 'Standard' },
      { value: 'cave', label: 'Cave' },
      { value: 'temple', label: 'Temple' },
      { value: 'maze', label: 'Maze' },
      { value: 'loopy', label: 'Loopy' }
    ], 'standard');
    
    // Create seed input
    this.createTextInput('seed', 'Seed:', '');
    
    // Create the generate button
    this.createGenerateButton();
    
    // Set up event handlers for control dependencies
    this.setupEventHandlers();
  }
  
  /**
   * Create a preset selector
   */
  private createPresetSelector(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Preset:';
    
    const select = document.createElement('select');
    select.id = 'preset-selector';
    
    // Add preset options
    const presets = [
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small Dungeon' },
      { value: 'large', label: 'Large Dungeon' },
      { value: 'cave', label: 'Cave System' },
      { value: 'maze', label: 'Maze' },
      { value: 'loopy', label: 'Loopy Dungeon' },
      { value: 'temple', label: 'Temple' },
      { value: 'custom', label: 'Custom' }
    ];
    
    for (const preset of presets) {
      const option = document.createElement('option');
      option.value = preset.value;
      option.textContent = preset.label;
      select.appendChild(option);
    }
    
    // Set up event handler
    select.addEventListener('change', () => {
      const presetName = select.value;
      
      if (presetName !== 'custom') {
        const presetParams = this.presets.get(presetName);
        if (presetParams) {
          this.setParams(presetParams);
        }
      }
    });
    
    container.appendChild(label);
    container.appendChild(select);
    this.container.appendChild(container);
  }
  
  /**
   * Create a number input
   */
  private createNumberInput(
    id: string, 
    label: string, 
    min: number, 
    max: number, 
    step: number, 
    defaultValue: number
  ): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = id;
    input.min = min.toString();
    input.max = max.toString();
    input.step = step.toString();
    input.value = defaultValue.toString();
    
    container.appendChild(labelElement);
    container.appendChild(input);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  /**
   * Create a slider input
   */
  private createSlider(
    id: string, 
    label: string, 
    min: number, 
    max: number, 
    step: number, 
    defaultValue: number
  ): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = min.toString();
    input.max = max.toString();
    input.step = step.toString();
    input.value = defaultValue.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = defaultValue.toString();
    
    // Update the display value when the slider changes
    input.addEventListener('input', () => {
      valueDisplay.textContent = input.value;
    });
    
    container.appendChild(labelElement);
    container.appendChild(input);
    container.appendChild(valueDisplay);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  /**
   * Create a checkbox input
   */
  private createCheckbox(id: string, label: string, defaultChecked: boolean): void {
    const container = document.createElement('div');
    container.className = 'control-group checkbox-group';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = defaultChecked;
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    container.appendChild(input);
    container.appendChild(labelElement);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  /**
   * Create a dropdown select
   */
  private createDropdown(
    id: string, 
    label: string, 
    options: Array<{ value: string, label: string }>, 
    defaultValue: string
  ): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const select = document.createElement('select');
    select.id = id;
    
    for (const option of options) {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      select.appendChild(optionElement);
    }
    
    select.value = defaultValue;
    
    container.appendChild(labelElement);
    container.appendChild(select);
    this.container.appendChild(container);
    
    this.controls.set(id, select);
  }
  
  /**
   * Create a text input
   */
  private createTextInput(id: string, label: string, defaultValue: string): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.value = defaultValue;
    
    container.appendChild(labelElement);
    container.appendChild(input);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  /**
   * Create the generate button
   */
  private createGenerateButton(): void {
    const button = document.createElement('button');
    button.textContent = 'Generate Dungeon';
    button.className = 'generate-button';
    button.addEventListener('click', () => {
      // Select "Custom" in the preset dropdown
      const presetSelector = document.getElementById('preset-selector') as HTMLSelectElement;
      if (presetSelector) {
        presetSelector.value = 'custom';
      }
      
      // Trigger the generate callback
      this.onGenerateCallback();
    });
    
    const container = document.createElement('div');
    container.className = 'button-container';
    container.appendChild(button);
    
    this.container.appendChild(container);
  }
  
  /**
   * Set up event handlers for control dependencies
   */
  private setupEventHandlers(): void {
    // Show/hide loop chance based on create loops checkbox
    const createLoopsCheckbox = this.controls.get('createLoops') as HTMLInputElement;
    const loopChanceContainer = document.getElementById('loopChance')?.parentElement;
    
    if (createLoopsCheckbox && loopChanceContainer) {
      // Set initial state
      loopChanceContainer.style.display = createLoopsCheckbox.checked ? 'block' : 'none';
      
      // Add change handler
      createLoopsCheckbox.addEventListener('change', () => {
        if (loopChanceContainer) {
          loopChanceContainer.style.display = createLoopsCheckbox.checked ? 'block' : 'none';
        }
      });
    }
  }
  
  /**
   * Get the current parameter values from the controls
   * @returns DungeonParams object with current values
   */
  getParams(): DungeonParams {
    const params: Partial<DungeonParams> = {};
    
    // Get number input values
    for (const param of ['width', 'height', 'numRooms', 'corridorWidth']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control) {
        // Use type assertion to avoid type errors
        (params as any)[param] = parseInt(control.value, 10);
      }
    }
    
    // Get slider values
    for (const param of ['roomDensity', 'roomSizeVariation', 'specialRoomChance', 'featureDensity', 'loopChance', 'doorFrequency', 'secretDoorChance']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control) {
        // Use type assertion to avoid type errors
        (params as any)[param] = parseFloat(control.value);
      }
    }
    
    // Get checkbox values
    const createLoopsControl = this.controls.get('createLoops') as HTMLInputElement;
    if (createLoopsControl) {
      params.createLoops = createLoopsControl.checked;
    }
    
    // Get dropdown values
    const hallwayStyleControl = this.controls.get('hallwayStyle') as HTMLSelectElement;
    if (hallwayStyleControl) {
      params.hallwayStyle = hallwayStyleControl.value as 'straight' | 'bendy' | 'organic';
    }
    
    const themeControl = this.controls.get('theme') as HTMLSelectElement;
    if (themeControl) {
      params.theme = themeControl.value;
    }
    
    // Get seed
    const seedControl = this.controls.get('seed') as HTMLInputElement;
    if (seedControl && seedControl.value.trim() !== '') {
      params.seed = seedControl.value.trim();
    }
    
    // Validate and normalize
    return DungeonParamsBuilder.validateAndNormalize(params);
  }
  
  /**
   * Set parameters in the controls
   * @param params DungeonParams to set
   */
  setParams(params: DungeonParams): void {
    // Set number input values
    for (const param of ['width', 'height', 'numRooms', 'corridorWidth']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control && params[param as keyof DungeonParams] != null) {
        control.value = String(params[param as keyof DungeonParams]);
      }
    }
    
    // Set slider values
    for (const param of ['roomDensity', 'roomSizeVariation', 'specialRoomChance', 'featureDensity', 'loopChance', 'doorFrequency', 'secretDoorChance']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control && params[param as keyof DungeonParams] != null) {
        control.value = String(params[param as keyof DungeonParams]);
        
        // Update display value
        const valueDisplay = control.nextElementSibling as HTMLElement;
        if (valueDisplay && valueDisplay.className === 'slider-value') {
          valueDisplay.textContent = control.value;
        }
      }
    }
    
    // Set checkbox values
    const createLoopsControl = this.controls.get('createLoops') as HTMLInputElement;
    if (createLoopsControl && params.createLoops !== undefined) {
      createLoopsControl.checked = params.createLoops;
      
      // Update dependent controls
      const loopChanceContainer = document.getElementById('loopChance')?.parentElement;
      if (loopChanceContainer) {
        loopChanceContainer.style.display = createLoopsControl.checked ? 'block' : 'none';
      }
    }
    
    // Set dropdown values
    const hallwayStyleControl = this.controls.get('hallwayStyle') as HTMLSelectElement;
    if (hallwayStyleControl && params.hallwayStyle !== undefined) {
      hallwayStyleControl.value = params.hallwayStyle;
    }
    
    const themeControl = this.controls.get('theme') as HTMLSelectElement;
    if (themeControl && params.theme !== undefined) {
      themeControl.value = params.theme;
    }
    
    // Don't set the seed from presets to allow for random generation
  }
}