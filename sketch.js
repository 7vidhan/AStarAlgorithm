function removeFromArray(arr, elt){
  for(var i = arr.length-1; i>=0; i--){
    if(arr[i] == elt){
      arr.splice(i,1)
    }
  }
}

function heuristic(a,b){
  var d = dist(a.i, a.j, b.i, b.j);

  return d;
}

var cols = 120;
var rows = 120;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w,h;
var path=[]; 


function Spot(i,j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  // Wall Density
  if(random(1) < 0.5) {
    this.wall = true;
  }
  // Displaying the grid
  this.show = function (col){
    fill(0,50,100);
    if(this.wall){
      fill(255,0,0);
    }
    noStroke();
    ellipse(this.i*w + w/2, this.j*h + h/2, w/2, h/2);
    // rect(this.i*w, this.j*h, w-1, h-1);
  }

  this.addNeighbors = function(grid){
    var i = this.i;
    var j = this.j;

    if(i<cols-1)       { this.neighbors.push(grid[i+1][j]); }
    if(i>0)            { this.neighbors.push(grid[i-1][j]); }
    if(j<rows-1)       {this.neighbors.push(grid[i][j+1]); }
    if(j>0)            { this.neighbors.push(grid[i][j-1]); }
    if(i>0 && j>0)          {this.neighbors.push(grid[i-1][j-1]); }
    if(i<cols-1 && j>0)     {this.neighbors.push(grid[i+1][j-1]); }
    if(i>0 && j<rows-1)     {this.neighbors.push(grid[i-1][j+1]); }
    if(i<cols-1 && j<rows-1){this.neighbors.push(grid[i+1][j+1]); }
  }
}




function setup() {
  createCanvas(1500, 900);
  console.log("A*");

  w = width/cols;
  h = height/rows;

  // Making a 2D array
  for(var i=0; i<cols; i++){
    grid[i] = new Array(rows);
  }

  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  // Checkpoints defined here
  start = grid[0][0]; 
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}




// Drawing the canvas
function draw() {
  if(openSet.length > 0){

    var winner = 0;
    for(var i=0; i<openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }
    var current = openSet[winner];


    if(current === end){
      noLoop();
      console.log("DONE!");
    }

    removeFromArray(openSet, current);
    closedSet.push(current);
    
    var neighbors = current.neighbors;
    for (var i=0; i<neighbors.length; i++){
      var neighbor = neighbors[i];
      if(!closedSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + 1;
        
        var newPath = false;
        if(openSet.includes(neighbor)){
          if(tempG < neighbor.g){
            neighbor.g = tempG;
            newPath = true;
          }
        }
        else{
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

      if(newPath){
        neighbor.h = heuristic(neighbor,end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current
      }

      }
    }

  // We can Stop here
  } else {
    console.log("No Solution");
    noLoop();
    return;
  }

  background(0,50,100);

  // Laying the grid spots
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].show(color(255));
      
    }
  }

  // for(var i=0; i<closedSet.length; i++){
  //   closedSet[i].show(color(255,0,0));
  // }

  // for(var i=0; i<openSet.length; i++){
  //   // openSet[i].show(color(0,255,0));
  // }

  // Find the Path every frame
  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }
  
  for(var i=0; i<path.length; i++){
    // path[i].show(color(0,0,255));
  }

  noFill();
  stroke(100, 155, 255);
  strokeWeight(w/2);
  beginShape();
  for(var i=0; i<path.length; i++){
    vertex(path[i].i*w + w/2, path[i].j*h + h/2);
  }
  endShape();

}
