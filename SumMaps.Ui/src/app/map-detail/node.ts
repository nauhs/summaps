export class Node {
    id: String;
    summary: String;
    parent: Node;
    children: Node[];
    offset: any;
    width: number;
    height: number;
    branch: number;
    branchDepth: number;
    selected: boolean;
    constructor() {
    }
    samePlaceSameShape(n: Node): boolean {
        return (n.width === this.width) &&
            (n.height === this.height) &&
            (n.offset.top === this.offset.top) &&
            (n.offset.left === this.offset.left)
    }
}