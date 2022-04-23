export class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vert) {
    if (!this.adjacencyList[vert]) {
      this.adjacencyList[vert] = [];
    }
  }

  addEdge(user1, user2) {
    this.adjacencyList[user1].push({ node: user2 });
  }
}
