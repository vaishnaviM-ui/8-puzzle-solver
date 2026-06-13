// Binary Min-Heap Priority Queue for pathfinding search optimization
export class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(element, priority) {
    this.heap.push({ element, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.sinkDown(0);
    }
    return top.element;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < length && this.heap[leftChild].priority < this.heap[smallest].priority) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild].priority < this.heap[smallest].priority) {
        smallest = rightChild;
      }

      if (smallest === index) break;
      this.swap(smallest, index);
      index = smallest;
    }
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
