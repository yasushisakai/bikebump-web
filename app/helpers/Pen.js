// @flow
export type Point2D = {
    x: number;
    y: number;
}
export default class Pen {
    static red: string = '208, 2, 27';
    static yellow: string = '248, 231, 28';
    static white: string = '240, 240, 240';
    static black: string= '17, 17, 17';
    static clear: string= 'rgba(0, 0, 0, 0)';

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    mouseX: number;
    mouseY: number;
    isNofill: boolean;
    isNoStroke: boolean;
    width: number;
    height: number;

    constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = ((this.canvas.getContext('2d'): any): CanvasRenderingContext2D);
        this.mouseX = this.mouseY = 0;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.font = '14px "Helvetica Neue", Helvetica, Arial, sans-serif';
        this.ctx.strokeStyle = Pen.clear;
        this.ctx.fillStyle = Pen.clear;
        this.ctx.lineWidth = 0.5;
        this.strokeWeight(2);
    }

    drawLine (sx: number, sy: number, ex: number, ey: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(ex, ey);
        this.ctx.stroke();
    }

    resize () {
        this.ctx = ((this.canvas.getContext('2d'): any): CanvasRenderingContext2D);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    drawLinePoints (start: Point2D, end: Point2D): void {
        this.drawLine(start.x, start.y, end.x, end.y);
    }

    addPoints (point1: Point2D, point2: Point2D): Point2D {
        return { x: point1.x + point2.x, y: point1.y + point2.y };
    }

    drawRectangle (start: Point2D, size: Point2D): void {
        const a: Point2D = start;
        const c: Point2D = this.addPoints(start, size);
        const b: Point2D = { x: a.x, y: c.y };
        const d: Point2D = { x: c.x, y: a.y };
        this.beginPath();
        this.moveTo(a);
        this.lineTo(b);
        this.lineTo(c);
        this.lineTo(d);
        this.lineTo(a);
        this.endPath();
    }
    clear (): void {
        this.fill(Pen.clear);
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    stroke (color: string | CanvasGradient | CanvasPattern): void {
        this.ctx.strokeStyle = color;
    }

    strokeWeight (width: number): void {
        this.ctx.lineWidth = width;
    }

    fill (color: string | CanvasGradient | CanvasPattern): void {
        this.ctx.fillStyle = color;
    }

    text (text: string, x: number, y: number): void {
        const tempStyle = this.ctx.strokeStyle;
        this.fill(`rgb(${Pen.white})`);
        this.ctx.fillText(text, x, y);
        // this.ctx.strokeText(text, x, y);
        this.fill(tempStyle);
    }

    noStroke (): void {
        this.ctx.strokeStyle = Pen.clear;
    }

    noFill (): void {
        this.ctx.fillStyle = Pen.clear;
    }

    updateMouse (event: MouseEvent): void {
        const { x, y } = this.getMouseCoordinates(event);
        this.mouseX = x;
        this.mouseY = y;
    }

    distance (sx: number, sy: number, ex: number, ey: number): number {
        return Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2));
    }

    drawPolyline (points: Array<Point2D>): void {
        if (points.length < 2) return;
        this.beginPath();
        points.map((point, index) => {
            if (index === 0) {
                this.moveTo(point);
            } else {
                this.lineTo(point);
            }
        });
        this.lineTo(points[0]);
        // this.endPath();
    }

    convertArrayToPoints (ary: Array<Array<number>>): Array<Point2D> {
        return ary.map((coord) => ({ x: coord[0], y: coord[1] }));
    }

    moveTo ({ x, y }: Point2D): void {
        this.ctx.moveTo(x, y);
    }

    lineTo ({ x, y }: Point2D): void {
        this.ctx.lineTo(x, y);
    }

    beginPath (): void {
        this.ctx.beginPath();
    }
    endPath (): void {
        this.ctx.stroke();
        this.ctx.fill();
    }

    drawVerticalAxis (x: number, height: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);

        this.ctx.stroke();
        // if(!this.isNoFill)context.fill()
    }

    drawCircle (x: number, y: number, radius: number): void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    getMouseCoordinates (event: MouseEvent): { x: number, y: number } {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }
}
