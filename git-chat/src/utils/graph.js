class Queue {
  constructor() {
    this.values = [];
  }
  enqueue(capital, weight) {
    this.values.push({ capital, weight });
    this.sort();
  }
  dequeue() {
    return this.values.shift();
  }
  sort() {
    this.values.sort((x, y) => x.weight - y.weight);
  }
}

export class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vert) {
    if (!this.adjacencyList[vert]) {
      this.adjacencyList[vert] = [];
    }
  }
  addEdge(capitalVert1, capitalVert2, weight) {
    this.adjacencyList[capitalVert1].push({ node: capitalVert2, weight });
    this.adjacencyList[capitalVert2].push({ node: capitalVert1, weight });
  }

  dijkstra(source, target) {
    const paths = new Queue();
    const distances = {};
    const prev = {};
    let shortest;
    let result = [];
    for (let capitalVert in this.adjacencyList) {
      if (capitalVert === source) {
        distances[capitalVert] = 0;
        paths.enqueue(capitalVert, 0);
      } else {
        distances[capitalVert] = Infinity;
        paths.enqueue(capitalVert, Infinity);
      }
      prev[capitalVert] = null;
    }
    while (paths.values.length) {
      shortest = paths.dequeue();

      if (shortest.capital === target) {
        while (prev[shortest.capital]) {
          result.push(shortest.capital);
          shortest.capital = prev[shortest.capital];
        }
        break;
      }
      if (shortest.capital || distances[shortest.capital] !== Infinity) {
        for (let neighbor in this.adjacencyList[shortest.capital]) {
          let nextStop = this.adjacencyList[shortest.capital][neighbor];
          let target = distances[shortest.capital] + nextStop.weight;
          let nextNeighbor = nextStop.node;
          if (target < distances[nextNeighbor]) {
            distances[nextNeighbor] = target;
            prev[nextNeighbor] = shortest.capital;
            paths.enqueue(nextNeighbor, target);
          }
        }
      }
    }

    return {
      path: result.concat(shortest.capital).reverse(),
      distance: distances[target],
    };
  }
}
