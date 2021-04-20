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
  let newBoard;

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
    newBoard = new Board($("#m").val(), $("#n").val())//new Board(height, width)
    //newBoard.initialise();    
    newBoard.createGrid(false);


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
    obsticles=$("#obsticles").val()
    ids = obsticles.split(" ");
    ids.forEach(async function(obsticle_id) {
      obsticle_id = obsticle_id.trim()
      if(document.getElementById(obsticle_id) != null){
        document.getElementById(obsticle_id).className = "obsticle"
        newBoard.nodes[obsticle_id].status = "wall"
      }
    })

    //low risk
    lowR=$("#lowR").val()
    ids = lowR.split(" ");
    ids.forEach(async function(lowR_id) {
      lowR_id = lowR_id.trim()
      if(document.getElementById(lowR_id) != null){
        document.getElementById(lowR_id).className = "lowR"
        newBoard.nodes[lowR_id].weight = 1
      }
    })

    //mid risk
    midR=$("#midR").val()
    ids = midR.split(" ");
    ids.forEach(async function(midR_id) {
      midR_id = midR_id.trim()
      if(document.getElementById(midR_id) != null){
        document.getElementById(midR_id).className = "midR"
        newBoard.nodes[midR_id].weight = 2
      }
    })

    //high risk
    highR=$("#highR").val()
    ids = highR.split(" ");
    ids.forEach(async function(highR_id) {
      highR_id = highR_id.trim()
      if(document.getElementById(document.getElementById(highR_id)) != null){
        document.getElementById(highR_id).className = "highR"
        newBoard.nodes[highR_id].weight = 3
      }
    })
    }

    onCellClick()

  });
  
  $("#startAlgorithm").click(()=>{
    heightAdjustment(newBoard)
    astar(newBoard, null, null)
    node = newBoard["target"]
    console.log(node)
    while(node !== newBoard["start"]){
    	$("#" + node["id"]).removeClass("unvisited")
    	$("#" + node["id"]).addClass("visited")
    	node = newBoard.nodes[node["previousNode"]]
    }
  })
  
});

function onCellClick(){
  $('td').click(function(){
    if(!$(this).hasClass("start") && !$(this).hasClass("target") 
            && !$(this).hasClass("obsticle") && !$(this).hasClass("lowR")
            && !$(this).hasClass("midR") && !$(this).hasClass("highR")){
      if($(this).hasClass("firstAlt")){
        $(this).removeClass("firstAlt");
        $(this).addClass("secondAlt");
      }
      else if($(this).hasClass("secondAlt")){
        $(this).removeClass("secondAlt");
        $(this).addClass("thirdAlt");
      }
      else if($(this).hasClass("thirdAlt")){
        $(this).removeClass("thirdAlt");
        $(this).addClass("forthAlt");
      }
      else if($(this).hasClass("forthAlt")){
        $(this).removeClass("forthAlt");
      }
      else{
        $(this).addClass("firstAlt");
      }
    }
  })
}

function heightAdjustment(newBoard){
  height=$("#alt").val()
  for(let node in newBoard.nodes) {
    if(height <= 40 && $("#" + node).hasClass("forthAlt")){
      newBoard.nodes[node].status = "wall"
    }
    if(height <= 30 && $("#" + node).hasClass("thirdAlt")){
      newBoard.nodes[node].status = "wall"
    }
    if(height <= 20 && $("#" + node).hasClass("secondAlt")){
      newBoard.nodes[node].status = "wall"
    }
    if(height <= 10 && $("#" + node).hasClass("firstAlt")){
      newBoard.nodes[node].status = "wall"
    }
  }
}


