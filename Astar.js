function astar(board, name, heuristic) {

    //console.log("start a star")
    //console.log(board)

    let nodes = board.nodes
    let start = board.start["id"]
    let target = board.target["id"]

    //console.log(start)
    //console.log(target)
    //console.log(nodes)

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
      //nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      if (currentNode.id === target) {
        return "success!";
      }
      updateNeighbors(nodes, currentNode, board.boardArray, target, name, start, heuristic);
    }
    
    console.log(nodes)
    
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
    //console.log("Closest Node:")
    //console.log(currentClosest)
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }


  function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
    //console.log("In the function updateNeightbors")
    let neighbors = getNeighbors(node.id, nodes, boardArray);
    //console.log(neighbors)

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

  //polu4ava6 current node, target, i trqbva da kaje6 kak 6te stigne6, kalkulira dist g, na targert est (raboti), 
  function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
    //console.log("updateNode")

    //console.log("currentNode")
    //console.log(currentNode)
    //console.log("target")
    //console.log(targetNode)
  
    //ne raboti
    let distance = g(currentNode, targetNode);
    if (!targetNode.heuristicDistance) targetNode.heuristicDistance = h(targetNode, actualTargetNode);

    //console.log(targetNode.heuristicDistance)
    //console.log(distance)

    // targetNode.weight is the weigth of the obstacle we have to pass trought
    let distanceToCompare = distance + targetNode.weight;
    if (distanceToCompare < targetNode.distance) {
      targetNode.distance = distanceToCompare;
      targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
      targetNode.previousNode = currentNode.id;
      //targetNode.path = distance[1];
      //targetNode.direction = distance[2];
    }
  }


  //include the diagonals as they are correct movements
  /*
  function getDistance(nodeOne, nodeTwo) {
    let currentCoordinates = nodeOne.id.split("-");
    let targetCoordinates = nodeTwo.id.split("-");
    let x1 = parseInt(currentCoordinates[0]);
    let y1 = parseInt(currentCoordinates[1]);
    let x2 = parseInt(targetCoordinates[0]);
    let y2 = parseInt(targetCoordinates[1]);
    if (x2 < x1 && y1 === y2) {
      if (nodeOne.direction === "up") {
        return [1, ["f"], "up"];
      } else if (nodeOne.direction === "right") {
        return [2, ["l", "f"], "up"];
      } else if (nodeOne.direction === "left") {
        return [2, ["r", "f"], "up"];
      } else if (nodeOne.direction === "down") {
        return [3, ["r", "r", "f"], "up"];
      } else if (nodeOne.direction === "up-right") {
        return [1.5, null, "up"];
      } else if (nodeOne.direction === "down-right") {
        return [2.5, null, "up"];
      } else if (nodeOne.direction === "up-left") {
        return [1.5, null, "up"];
      } else if (nodeOne.direction === "down-left") {
        return [2.5, null, "up"];
      }
    } else if (x2 > x1 && y1 === y2) {
      if (nodeOne.direction === "up") {
        return [3, ["r", "r", "f"], "down"];
      } else if (nodeOne.direction === "right") {
        return [2, ["r", "f"], "down"];
      } else if (nodeOne.direction === "left") {
        return [2, ["l", "f"], "down"];
      } else if (nodeOne.direction === "down") {
        return [1, ["f"], "down"];
      } else if (nodeOne.direction === "up-right") {
        return [2.5, null, "down"];
      } else if (nodeOne.direction === "down-right") {
        return [1.5, null, "down"];
      } else if (nodeOne.direction === "up-left") {
        return [2.5, null, "down"];
      } else if (nodeOne.direction === "down-left") {
        return [1.5, null, "down"];
      }
    }
    if (y2 < y1 && x1 === x2) {
      if (nodeOne.direction === "up") {
        return [2, ["l", "f"], "left"];
      } else if (nodeOne.direction === "right") {
        return [3, ["l", "l", "f"], "left"];
      } else if (nodeOne.direction === "left") {
        return [1, ["f"], "left"];
      } else if (nodeOne.direction === "down") {
        return [2, ["r", "f"], "left"];
      } else if (nodeOne.direction === "up-right") {
        return [2.5, null, "left"];
      } else if (nodeOne.direction === "down-right") {
        return [2.5, null, "left"];
      } else if (nodeOne.direction === "up-left") {
        return [1.5, null, "left"];
      } else if (nodeOne.direction === "down-left") {
        return [1.5, null, "left"];
      }
    } else if (y2 > y1 && x1 === x2) {
      if (nodeOne.direction === "up") {
        return [2, ["r", "f"], "right"];
      } else if (nodeOne.direction === "right") {
        return [1, ["f"], "right"];
      } else if (nodeOne.direction === "left") {
        return [3, ["r", "r", "f"], "right"];
      } else if (nodeOne.direction === "down") {
        return [2, ["l", "f"], "right"];
      } else if (nodeOne.direction === "up-right") {
        return [1.5, null, "right"];
      } else if (nodeOne.direction === "down-right") {
        return [1.5, null, "right"];
      } else if (nodeOne.direction === "up-left") {
        return [2.5, null, "right"];
      } else if (nodeOne.direction === "down-left") {
        return [2.5, null, "right"];
      }
    } else if (x2 < x1 && y2 < y1) {
      if (nodeOne.direction === "up") {
        return [1.5, ["f"], "up-left"];
      } else if (nodeOne.direction === "right") {
        return [2.5, ["l", "f"], "up-left"];
      } else if (nodeOne.direction === "left") {
        return [1.5, ["r", "f"], "up-left"];
      } else if (nodeOne.direction === "down") {
        return [2.5, ["r", "r", "f"], "up-left"];
      } else if (nodeOne.direction === "up-right") {
        return [2, null, "up-left"];
      } else if (nodeOne.direction === "down-right") {
        return [3, null, "up-left"];
      } else if (nodeOne.direction === "up-left") {
        return [1, null, "up-left"];
      } else if (nodeOne.direction === "down-left") {
        return [2, null, "up-left"];
      }
    } else if (x2 < x1 && y2 > y1) {
      if (nodeOne.direction === "up") {
        return [1.5, ["f"], "up-right"];
      } else if (nodeOne.direction === "right") {
        return [1.5, ["l", "f"], "up-right"];
      } else if (nodeOne.direction === "left") {
        return [2.5, ["r", "f"], "up-right"];
      } else if (nodeOne.direction === "down") {
        return [2.5, ["r", "r", "f"], "up-right"];
      } else if (nodeOne.direction === "up-right") {
        return [1, null, "up-right"];
      } else if (nodeOne.direction === "down-right") {
        return [2, null, "up-right"];
      } else if (nodeOne.direction === "up-left") {
        return [2, null, "up-right"];
      } else if (nodeOne.direction === "down-left") {
        return [3, null, "up-right"];
      }
    } else if (x2 > x1 && y2 > y1) {
      if (nodeOne.direction === "up") {
        return [2.5, ["f"], "down-right"];
      } else if (nodeOne.direction === "right") {
        return [1.5, ["l", "f"], "down-right"];
      } else if (nodeOne.direction === "left") {
        return [2.5, ["r", "f"], "down-right"];
      } else if (nodeOne.direction === "down") {
        return [1.5, ["r", "r", "f"], "down-right"];
      } else if (nodeOne.direction === "up-right") {
        return [2, null, "down-right"];
      } else if (nodeOne.direction === "down-right") {
        return [1, null, "down-right"];
      } else if (nodeOne.direction === "up-left") {
        return [3, null, "down-right"];
      } else if (nodeOne.direction === "down-left") {
        return [2, null, "down-right"];
      }
    } else if (x2 > x1 && y2 < y1) {
      if (nodeOne.direction === "up") {
        return [2.5, ["f"], "down-left"];
      } else if (nodeOne.direction === "right") {
        return [2.5, ["l", "f"], "down-left"];
      } else if (nodeOne.direction === "left") {
        return [1.5, ["r", "f"], "down-left"];
      } else if (nodeOne.direction === "down") {
        return [1.5, ["r", "r", "f"], "down-left"];
      } else if (nodeOne.direction === "up-right") {
        return [3, null, "down-left"];
      } else if (nodeOne.direction === "down-right") {
        return [2, null, "down-left"];
      } else if (nodeOne.direction === "up-left") {
        return [2, null, "down-left"];
      } else if (nodeOne.direction === "down-left") {
        return [1, null, "down-left"];
      }
    }
  }*/


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
