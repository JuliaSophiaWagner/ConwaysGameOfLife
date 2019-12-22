class CgolPitch extends HTMLElement
{
    constructor() 
    {
        super();
        this.currentDiv = document.getElementById("container");
        this.createElement(this.currentDiv);
    }

    private _color: string = "blue";
    private _pixelSize: string = "15px";
    public shadowElement: any; 
    private currentDiv: any;    

    public get width(): string
    {
        return this.getAttribute('width')!;
    }
    public set width(value: string) 
    {
        if (Number(value) == NaN || Number(value) < 10) 
        {
             return;
        }

        this.setAttribute("width", value.toString()); 
    }

    public get height(): string 
    {
        return this.getAttribute('height')!;
    }
    public set height(value: string) 
    {
        if (Number(value) == NaN || Number(value) < 10) 
        {
            return;
        }


        this.setAttribute("height", value.toString());
    }


    createElement(firstElement: any) 
    {
        console.log("create new element");
        var cell = document.createElement("div");
        cell.id = "firstElement";
        cell.style.textAlign = "center";
        document.body.insertBefore(cell, firstElement);

        for (var i = 0; i < Number(this.height); i++)
        {
            var div1 = document.createElement('div');

            for (var j = 0; j < Number(this.width); j++)
            {
                var divTemp = document.createElement("div");
                divTemp.onclick = clickedElement;
                divTemp.style.width = this._pixelSize;
                divTemp.style.height = this._pixelSize;
                divTemp.style.background = this._color;
                divTemp.style.display = 'inline-block';
                divTemp.style.border = '1px solid black';                
                divTemp.id = i + "-" + j;
                div1.appendChild(divTemp);
            }

            div1.style.height = this._pixelSize;
            div1.id = "row" + i.toString();
            cell.appendChild(div1);   
        }
    }   

    connectedCallback()
    {
        this.shadowElement = this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = `
        <style>
        </style>
        <div style="display: inline-block; vertical-align:top;" id= "container">
        </div>
        `;
    }

    attributeChangedCallback(name:string, oldValue:string, newValue:string)
    {
        switch (name)
        {
          case 'height':
            console.log(`Height value changed from ${oldValue} to ${newValue}`);
            this.setAttribute(this.height.toString(), newValue);
            break;
          case 'width':
            console.log(`Width value changed from ${oldValue} to ${newValue}`);
            this.setAttribute(this.width.toString(), newValue);
            break;
        }
    }

    disconnectedCallback() 
    {
    }

    removeGrid()
    {
        for (let i = 0; i < Number(this.getAttribute("height")); i++)
        {
            console.log(Number(this.getAttribute("height")));
            console.log("row" + i);
            console.log(document.getElementById("row"+ i.toString()));
            document.getElementById("row"+ i.toString())!.remove();            
        }
    }

    updateGrid(newPixelSize:number)
    {
        this._pixelSize = newPixelSize.toString() + "px";
        this.removeGrid();
        this.createElement(this.currentDiv);
    }

}

window.customElements.define('cgol-pitch', CgolPitch);

class Item{
    constructor(clickState:ClickState, id: string, number: number, livedOnce: boolean){
    this._clickState = clickState;
    this._id = id;
    this._number = number;
    this._livedOnce = livedOnce;
    }

    private _id: string;
    private _livedOnce: boolean;
    private _clickState: ClickState;
    private _number: number;

    get livedOnce(): boolean {
        return this._livedOnce;
    }

    set livedOnce(value: boolean) {
        this._livedOnce = value;
    }
    get number(): number {
        return this._number;
    }

    set number(newNumber: number) {
        this._number = newNumber;
    }

    get id(): string {
        return this._id;
    }

    get clickState(): ClickState {
        return this._clickState;
    }
    
    set clickState(newState: ClickState) {
        this._clickState = newState;
    }
}

enum ClickState
{
    alive,
    dead
}

let rows:number = 25;
let cols: number = 65;
let field = new Array(rows);
let fieldTemp = new Array(rows);
let timer : number;
let reproductionTime = 100;
let nothingChanged: boolean = false;
let playing: boolean = false;
let generation: number = 0;
InitializeGame();

let startButton = document.getElementById('start');
startButton!.onclick = play;

let stopButton = document.getElementById('stop');
stopButton!.onclick = stopGame;

let stepButton = document.getElementById('step');
stepButton!.onclick = oneStep;

let clearButton = document.getElementById('clear');
clearButton!.onclick = clearGame;

let setTimer = document.getElementById('setTimer');
setTimer!.onclick = setTime;

let setSizeButton = document.getElementById('setSize');
setSizeButton!.onclick = resizeGrid;

let loadLevelButton = document.getElementById('loadLevel');
loadLevelButton!.onclick = loadLevel;

let generationText = document.getElementById("generation");
updateGenerationText();
updateGridPixelSize();
window.addEventListener("resize", updateGridPixelSize);
window.addEventListener("orientationchanged", updateGridPixelSize);

function clickedElement($event:any)
{
    let id = (event!.target as Element).id;    
    handleClickedElement(id);
}

function handleClickedElement(id:string)
{
    let item = document.getElementById(id);
    var idTemp= id.split("-");
    var row:any = idTemp[0];
    var col:any = idTemp[1];
    var element = field[row][col];

    if (field[row][col].clickState === ClickState.dead) {
        field[row][col].number = 1;
        item!.style.backgroundColor = "green";
        field[row][col].clickState = ClickState.alive;
        field[row][col].livedOnce = true;
    }
    else if (field[row][col].clickState === ClickState.alive) {
        field[row][col].number = 0;
        item!.style.backgroundColor = "gray";
        field[row][col].clickState = ClickState.dead;
        field[row][col].livedOnce = true;
    }
}

function updateGridPixelSize()
{
    console.log("resize pixel");   
    let cgolPitchTemp = <CgolPitch>document.getElementsByTagName("cgol-pitch")[0];
    let firstElement = (cgolPitchTemp.shadowElement.querySelector("#container") as HTMLDivElement);
    let width = window.innerWidth;
    let height = window.innerHeight - firstElement.offsetTop - 30;
    let maxSize = 25;
    let sizeWidth = Math.floor(width / cols);
    let sizeHeight = Math.floor(height / rows);
    let size = Math.min(maxSize, sizeWidth, sizeHeight);
    
    if (size < 5)
    {
        size = 5;
    }

    cgolPitchTemp.updateGrid(size);
    changeColorsOfGrid();
}

function updateGenerationText()
{
    generationText!.innerHTML = generation.toString();
}

function loadLevel()
{
    clearGame();
    let inputText = <HTMLTextAreaElement>document.getElementById("textarea"); 
    let stringRows = new Array(inputText.value.split("\n").length);
    stringRows = inputText.value.split("\n");
    
    if (stringRows === null || stringRows === undefined)
    {
        window.alert("Wrong input. The input is not valid.");
        return;
    }

    let maxCol = 0;

    for (let i = 0; i < stringRows.length; i++)
    {
        if (maxCol < stringRows[i].length) 
        {
            maxCol = stringRows[i].length;
        }
    }

    let rowsTemp = stringRows.length;
    let colsTemp = maxCol;

    if (stringRows.length < 10)
    {
        rowsTemp = 10;
    }

    if (maxCol < 10)
    {
        colsTemp = 10;
    }

    changeGridHeightAndWith(rowsTemp, colsTemp);
    updateGridPixelSize();

    for (let i = 0; i < rows; i++) 
    {
        if (stringRows.length <= i || (stringRows[i] === "" && stringRows.length === i))
        {
            break;
        }

        if (stringRows[i] === "")
        {
            continue;
        }

        for (let j = 0; j < cols; j++) 
        {
            if (stringRows[i].length <= j)
            {
                break;
            }
            else if (stringRows[i][j] === "1")
            {
                handleClickedElement(i + "-" + j);
            }
        }
    }

    generation = 1;
    updateGenerationText();
}

function resizeGrid()
{
    let newHeightTemp = <HTMLInputElement>document.getElementById("height"); 
    let newWidthTemp =  <HTMLInputElement>document.getElementById("width"); 
    let newHeight = Number(newHeightTemp.value);
    let newWidth = Number(newWidthTemp.value);

    if (newHeight === null ||  newHeight == NaN ||newHeight < 10 || newWidth === null ||  newWidth == NaN || newWidth < 10)
    {
        window.alert("Wrong input. The minimum size must be greater than 9.")
        return;
    }

    changeGridHeightAndWith(newHeight, newWidth);
    updateGridPixelSize();
}

function changeGridHeightAndWith(newHeight:number, newWidth:number)
{
    clearGame();
    rows = newHeight;
    cols = newWidth;
    let cgolPitchTemp = <CgolPitch>document.getElementsByTagName("cgol-pitch")[0];
    cgolPitchTemp.removeGrid();
    let firstElement = cgolPitchTemp.shadowElement.getElementById("firstElement");

    // need to set later to remove old grid with the old values
    cgolPitchTemp.setAttribute("width", newWidth.toString());
    console.log(cgolPitchTemp.width);
    cgolPitchTemp.setAttribute("height", newHeight.toString());
    cgolPitchTemp.createElement(firstElement);

}

function setTime()
{
    let newTime =  <HTMLInputElement>document.getElementById("timer"); 
    
    if (Number(newTime.value) === NaN || newTime.value === null || newTime.value === undefined)
    {
        window.alert("Wrong input. The time must be a number!");
        return;
    } 

    reproductionTime = Number(newTime.value);
}

function stopGame() 
{
    playing = false;
    clearTimeout(timer);
}

function clearGame() 
{
    generation = 0;
    updateGenerationText();

    if (playing)
    {
        clearTimeout(timer);
    }

    InitializeGame();
    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < cols; j++) 
        {
            var element = document.getElementById(i + "-" + j)!;
            element!.style.backgroundColor = "blue";
        }
    }
}

function play() 
{
    playing = true;
    nextGeneration();
    
    if (playing)
    {
        timer = setTimeout(play, reproductionTime);
    }   
}

function InitializeGame()
{
    field = new Array(rows);
    fieldTemp = new Array(rows);

    for (let i = 0; i < rows; i++) 
    {
        field[i] = new Array(rows);
        fieldTemp[i] = new Array(rows);
    
        for (let j = 0; j < cols; j++)
        {
            
            field[i][j] = new Item(ClickState.dead,  i + "-" + j, 0, false);
            fieldTemp[i][j] = new Item(ClickState.dead,  i + "-" + j, 0, false);
    
        }
    }
}

function oneStep() 
{
    nextGeneration();
    updateGenerationText();
}

function nextGeneration() 
{
    nothingChanged = true;

    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < cols; j++) 
        {
            checkRules(i, j);
        }
    }
    
    generation++;
    updateGenerationText();
    copyGridToTempGridAndResetTempGrid();
    changeColorsOfGrid();

    if (nothingChanged)
    {
        stopGame();
    }
}

function changeColorsOfGrid()
{
    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < cols; j++)
        {             
            var element = document.getElementById(i + "-" + j)!;

            if (field[i][j].number === 0)
            {
                if (field[i][j].livedOnce === false)
                {
                    element!.style.backgroundColor = "blue";
                }
                else
                {
                    element!.style.backgroundColor = "gray";
                }
            }
            else
            {
                element!.style.backgroundColor = "green";
                field[i][j].livedOnce = true;
                field[i][j].clickState = ClickState.alive;
            }
        }
    }
}

function copyGridToTempGridAndResetTempGrid() 
{
    for (var i = 0; i < rows; i++)
    {
        for (var j = 0; j < cols; j++) 
        {
            field[i][j].number = fieldTemp[i][j].number;
            field[i][j].clickState = fieldTemp[i][j].clickState;
            fieldTemp[i][j].number = 0;
            fieldTemp[i][j].clickState = ClickState.dead; 
        }
    }
}

function checkRules(row:number, col:number) 
{
    var countNeighbors = sumNeighbors(row, col);

    if (field[row][col].number === 1) 
    {
        if (countNeighbors < 2)
        {            
            if (fieldTemp[row][col].number === 1)
            {
                    nothingChanged = false;
            }

            fieldTemp[row][col].number = 0;
            fieldTemp[row][col].clickState = ClickState.dead;
        } 
        else if (countNeighbors === 2 || countNeighbors === 3) 
        {
            if (fieldTemp[row][col].number === 0)
            {
                    nothingChanged = false;
            }

            fieldTemp[row][col].number = 1;
            fieldTemp[row][col].livedOnce = true;
            fieldTemp[row][col].clickState = ClickState.alive;
        }
        else if (countNeighbors > 3) 
        {
            if (fieldTemp[row][col].number === 1)
            {
                    nothingChanged = false;
            }

            fieldTemp[row][col].number = 0;
            fieldTemp[row][col].clickState = ClickState.dead;
        }
    } 
    else if (field[row][col].number === 0 && countNeighbors === 3) 
    {
        if (fieldTemp[row][col].number === 0)
        {
                nothingChanged = false;
        }
        fieldTemp[row][col].number = 1;
        fieldTemp[row][col].livedOnce = true;
        fieldTemp[row][col].clickState = ClickState.alive;
    }
}
    
function sumNeighbors(row:number, col:number)
{
    let count:number = 0;

    for (let currentRow = row - 1; currentRow <= row + 1; currentRow++) 
    {
        for (let currentColumn = col -1; currentColumn <= col + 1; currentColumn++)
        {
            if (currentRow === row && currentColumn === col)
            {
                continue;
            }

            let rowTemp = currentRow;
            let columnTemp = currentColumn;

            if (currentRow < 0)
            {
                rowTemp = rows - 1;
            }
            else if (currentRow > rows - 1)
            {
                rowTemp = 0;
            }

            if (currentColumn < 0)
            {
                columnTemp = cols - 1;
            }
            else if (currentColumn > cols - 1)
            {
                columnTemp = 0;
            }

            if (field[rowTemp][columnTemp].number === 1) 
            {
                count++;
            }
        }
    }

    return count;
}