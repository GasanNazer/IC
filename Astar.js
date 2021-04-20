function astar(board, name, heuristic) {

    let nodes = board.nodes
    let start = board.start["id"]
    let target = board.target["id"]

    if (!start || !target || start === target) {
      return false;
    }
    nodes[start].distance = 0;
    nodes[start].totalDistance = 0;
    nodes[start].direction = "left"; //up

    // open list(lista abierta)
    let unvisitedNodes = Object.keys(nodes);

    while (unvisitedNodes.length) {
      let currentNode = closestNode(nodes, unvisitedNodes);

      while (currentNode.status === "wall" && unvisitedNodes.length) {
        currentNode = closestNode(nodes, unvisitedNodes)
      }
      if (currentNode.distance === Infinity) return false;
      currentNode.status = "visited";
      if (currentNode.id === target) {
        return "success!";
      }
      updateNeighbors(nodes, currentNode, board.boardArray, target, name, start, heuristic);
    }
    
}


function closestNode(nodes, unvisitedNodes) {
    let currentClosest, index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
        currentClosest = nodes[unvisitedNodes[i]];
        index = i;
      } else if (currentClosest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
        if (currentClosest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
          currentClosest = nodes[unvisitedNodes[i]];
          index = i;
        }
      }
    }
    
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }


  function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
    let neighbors = getNeighbors(node.id, nodes, boardArray);

    for (let neighbor of neighbors) {
      if (target) {
        updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
      } else {
        updateNode(node, nodes[neighbor]);
      }
    }
  }

  // chech if this is working
  function getNeighbors(id, nodes, boardArray) {
    let coordinates = id.split("-");
    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);
    let neighbors = [];
    let potentialNeighbor;
    //down
    if (boardArray[x - 1] && boardArray[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    //up
    if (boardArray[x + 1] && boardArray[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    //left
    if (boardArray[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    //right
    if (boardArray[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }

    // diagonal down left
    if (boardArray[x - 1] && boardArray[x - 1][y - 1]) {
      potentialNeighbor = `${(x - 1).toString()}-${(y - 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }

    // diagonal up left
    if (boardArray[x + 1] && boardArray[x + 1][y - 1]) {
      potentialNeighbor = `${(x + 1).toString()}-${(y - 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }

    // diagonal down right 
    if (boardArray[x - 1] && boardArray[x - 1][y + 1]) {
      potentialNeighbor = `${(x - 1).toString()}-${(y + 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }

    // diagonal up right
    if (boardArray[x + 1] && boardArray[x + 1][y + 1]) {
      potentialNeighbor = `${(x + 1).toString()}-${(y + 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    return neighbors;
  }
 
  function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
    
    let distance = g(currentNode, targetNode);
    if (!targetNode.heuristicDistance) targetNode.heuristicDistance = h(targetNode, actualTargetNode);


    // targetNode.weight is the weigth of the obstacle we have to pass trought
    let distanceToCompare = distance + targetNode.weight;
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
      targetNode.previousNode = currentNode.id;
    }
  }


  //heuristing using Euclidian distance
  function h(nodeOne, nodeTwo) {
    return dist(nodeOne, nodeTwo);
  }
  
  function g(nodeOne, nodeTwo){
    return nodeOne.distance + dist(nodeOne, nodeTwo)
  }
  
  function dist(nodeOne, nodeTwo){
    let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
    let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
    let xOne = nodeOneCoordinates[0];
    let xTwo = nodeTwoCoordinates[0];
    let yOne = nodeOneCoordinates[1];
    let yTwo = nodeTwoCoordinates[1];
  
    let xChange = Math.pow(xOne - xTwo, 2);
    let yChange = Math.pow(yOne - yTwo, 2);
  
    return Math.sqrt(xChange + yChange);
  }

  function manhattanDistance(nodeOne, nodeTwo) {
    let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
    let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
    let xOne = nodeOneCoordinates[0];
    let xTwo = nodeTwoCoordinates[0];
    let yOne = nodeOneCoordinates[1];
    let yTwo = nodeTwoCoordinates[1];
  
    let xChange = Math.abs(xOne - xTwo);
    let yChange = Math.abs(yOne - yTwo);
  
    return (xChange + yChange);
  }
