function Board(height, width) {
    this.height = height;
    this.width = width;
    this.start = null;
    this.target = null;
    this.object = null;
    this.boardArray = [];
    this.nodes = {};
    this.nodesToAnimate = [];
    this.objectNodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.objectShortestPathNodesToAnimate = [];
    this.wallsToAnimate = [];
    this.mouseDown = false;
    this.pressedNodeStatus = "normal";
    this.previouslyPressedNodeStatus = null;
    this.previouslySwitchedNode = null;
    this.previouslySwitchedNodeWeight = 0;
    this.keyDown = false;
    this.algoDone = false;
    this.currentAlgorithm = null;
    this.currentHeuristic = null;
    this.numberOfObjects = 0;
    this.isObject = false;
    this.buttonsOn = false;
    this.speed = "fast";
  }
  
  Board.prototype.initialise = function() {
    this.createGrid();
    //this.addEventListeners();
    //this.toggleTutorialButtons();
  };
  
  Board.prototype.createGrid = function(withoutStartAndEnd = true) {
    let tableHTML = "";
    for (let r = 0; r < this.height; r++) {
      let currentArrayRow = [];
      let currentHTMLRow = `<tr id="row ${r}">`;
      for (let c = 0; c < this.width; c++) {
        let newNodeId = `${r}-${c}`, newNodeClass, newNode;
        if (withoutStartAndEnd && r === Math.floor(this.height / 2) && c === Math.floor(this.width / 4)) {
          newNodeClass = "start";
          this.start = `${newNodeId}`;
        } else if (withoutStartAndEnd && r === Math.floor(this.height / 2) && c === Math.floor(3 * this.width / 4)) {
          newNodeClass = "target";
          this.target = `${newNodeId}`;
        } else {
          newNodeClass = "unvisited";
        }
        newNode = new Node(newNodeId, newNodeClass);
        currentArrayRow.push(newNode);
        currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
        this.nodes[`${newNodeId}`] = newNode;
      }
      this.boardArray.push(currentArrayRow);
      tableHTML += `${currentHTMLRow}</tr>`;
    }
    let board = document.getElementById("board");
    board.innerHTML = tableHTML;
  };

  function Node(id, status) {
    this.id = id;
    this.status = status;
    this.previousNode = null;
    this.path = null;
    this.direction = null;
    this.storedDirection = null;
    this.distance = Infinity; //g
    this.totalDistance = Infinity; //f
    this.heuristicDistance = null; //h
    this.weight = 0; 
    this.relatesToObject = false;
    this.overwriteObjectRelation = false;
  
    this.otherid = id;
    this.otherstatus = status;
    this.otherpreviousNode = null;
    this.otherpath = null;
    this.otherdirection = null;
    this.otherstoredDirection = null;
    this.otherdistance = Infinity;
    this.otherweight = 0;
    this.otherrelatesToObject = false;
    this.otheroverwriteObjectRelation = false;
  }


$(document).ready(function() {
    $("#submit").click(function(){
    if(!$("#m").val().match(/^\d+$/) || $("#m").val() <= 0 || $("#m").val() > 50){
      console.log("not a number m")
    }
    else if(!$("#n").val().match(/^\d+$/) || $("#n").val() <= 0 || $("#n").val() > 50){
      console.log("not a number")
    }
    else{
      //console.log("Loading page")
    //let navbarHeight = $("#navbarDiv").height();
    //console.log(navbarHeight)
    //let textHeight = $("#mainText").height() + $("#algorithmDescriptor").height();
    //let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
    //let width = Math.floor($(document).width() / 25);
    console.log($("#m").val())
    let newBoard = new Board($("#m").val(), $("#n").val())//new Board(height, width)
    //newBoard.initialise();    
    newBoard.createGrid(false);

    console.log(newBoard)


    // start node
    start_node_id = $("#startingPoint").val()
    console.log(`start node: ${newBoard.nodes[start_node_id]}`)
    document.getElementById(start_node_id).className = "start"
    newBoard.start = newBoard.nodes[start_node_id]


    // end node
    end_node_id = $("#endPoint").val()
    console.log(`target node: ${newBoard.nodes[end_node_id]}`)
    document.getElementById(end_node_id).className = "target"
    newBoard.target = newBoard.nodes[end_node_id]
    
    //obsticles
    obsticle_id = "2-2"
    document.getElementById(obsticle_id).className = "obsticle"
    newBoard.wallsToAnimate.push(obsticle_id)
    newBoard.nodes[obsticle_id].status = "wall"

    console.log(newBoard)

    astar(newBoard, null, null)
    node = newBoard["target"]
    console.log(node)
    while(node !== newBoard["start"]){
    	$("#" + node["id"]).removeClass("unvisited")
    	$("#" + node["id"]).addClass("visited")
    	node = newBoard.nodes[node["previousNode"]]
    }
    }
  });
});



