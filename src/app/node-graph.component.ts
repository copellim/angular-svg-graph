import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

export interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-node-graph',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      width="500"
      height="300"
      #svgContainer
      (mousedown)="startConnection($event)"
      (mousemove)="drawConnection($event)"
      (mouseup)="endConnection()"
    >
      <circle
        *ngFor="let node of nodes"
        [attr.cx]="node.x"
        [attr.cy]="node.y"
        [attr.r]="radius"
        fill="blue"
        (mousedown)="startDragging($event, node)"
      ></circle>
      <line
        *ngFor="let edge of edges"
        [attr.x1]="edge.x1"
        [attr.y1]="edge.y1"
        [attr.x2]="edge.x2"
        [attr.y2]="edge.y2"
        stroke="black"
      ></line>
      <line
        *ngIf="isDrawing"
        [attr.x1]="drawStartPoint.x"
        [attr.y1]="drawStartPoint.y"
        [attr.x2]="drawEndPoint.x"
        [attr.y2]="drawEndPoint.y"
        stroke="gray"
      ></line>
    </svg>
  `,
  styles: ``,
})
export class NodeGraphComponent {
  nodes = [
    { x: 50, y: 50 },
    { x: 150, y: 100 },
    { x: 250, y: 50 },
  ];

  edges: Edge[] = [];
  isDrawing = false;
  drawStartPoint = { x: 0, y: 0 };
  drawEndPoint = { x: 0, y: 0 };
  selectedNode = null;
  radius = 25;

  @ViewChild('svgContainer') svgContainer?: ElementRef;

  startDragging(event: MouseEvent, node: any): void {
    event.preventDefault();
    this.selectedNode = node;
  }

  startConnection(event: MouseEvent): void {
    if (this.selectedNode) {
      this.isDrawing = true;
      this.drawStartPoint = this.getSVGPoint(event);
      this.drawEndPoint = this.drawStartPoint;
    }
  }

  drawConnection(event: MouseEvent): void {
    if (this.isDrawing) {
      this.drawEndPoint = this.getSVGPoint(event);
    }
  }

  endConnection(): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      const endNode = this.getNodeAtPoint(this.drawEndPoint);
      if (endNode) {
        const edge = {
          x1: this.drawStartPoint.x,
          y1: this.drawStartPoint.y,
          x2: endNode.x,
          y2: endNode.y,
        };
        this.edges.push(edge);
      }
      this.selectedNode = null;
    }
  }

  getSVGPoint(event: MouseEvent): { x: number; y: number } {
    const svgRect = this.svgContainer?.nativeElement.getBoundingClientRect();
    return { x: event.clientX - svgRect.left, y: event.clientY - svgRect.top };
  }

  getNodeAtPoint(point: { x: number; y: number }): any | null {
    return this.nodes.find((node) => this.distance(point, node) < this.radius); // Consideriamo il nodo come target se la distanza è inferiore a 10
  }

  distance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }
}
