// @flow
import Pen, {type Point2D} from './Pen';
import {maxFreq, minFreq} from 'config/constants';

export default class FrequencyGraph {
  pen: Pen;
  startCoordinate: Point2D;
  graphSize: Point2D;
  dataArray :Uint8Array;
  maxValue: number;
  maxValueAverageBin: number;
  maxValues: Array<number>;
  labels: {[frequency: string]: number} // storing x values for each label
  axis: Array<Array<string | number>>;
  maxFreq: number;
  minFreq: number;
  binWidth: number;

  constructor (_pen: Pen, _start: Point2D, _size: Point2D) {
    this.pen = _pen;
    this.startCoordinate = _start;
    this.graphSize = _size;

    this.minFreq = minFreq;
    this.maxFreq = maxFreq;
    this.maxValue = 10.0;
    this.maxValueAverageBin = 5;
    this.maxValues = [];
    this.dataArray = [];
    this.labels = {};
    this.axis = [];
  }

  update (newDataArray: Uint8Array): void {
    this.dataArray = newDataArray;
    this.binWidth = this.graphSize.x / this.dataArray.length;
    this.maxValues.push(this.dataArray.slice().sort().reverse()[0]);

    if (this.maxValues.length > this.maxValueAverageBin) {
      this.maxValues.shift();
    }

    this.maxValue = this.maxValues.reduce((sum, cur) => (sum + cur), 0.0);
    this.maxValue /= this.maxValues.length;
    this.maxValue = Math.max(this.maxValue, 0.01);
  }

  addLabel (frequency: number, verbose = '') {
    if (verbose === '') {
      verbose = `${frequency}`;
    }

    console.log(verbose);

    if (frequency <= maxFreq && frequency >= minFreq) {
      const parameter = (frequency - this.minFreq) / (this.maxFreq - this.minFreq);
      this.labels[`${verbose}`] = this.startCoordinate.x + this.graphSize.x * parameter;
    }
  }

  addAxis (frequency: number, color = 'rgb(255, 0, 0, 0.2)') {
    if (frequency <= maxFreq && frequency >= minFreq) {
      const parameter = (frequency - this.minFreq) / (this.maxFreq - this.minFreq);
      this.axis.push = [color, this.startCoordinate.x + this.graphSize.x * parameter];
    }
  }

  draw (targetFreq: ?number) {
    this.pen.stroke('rgb(200, 200, 200)');
    this.pen.beginPath();

    const startPoint: Point2D = {
      x: this.startCoordinate.x,
      y: this.startCoordinate.y + this.graphSize.y,
    };

    if (typeof targetFreq === 'number') {
      const x: number = this.startCoordinate.x + (targetFreq - minFreq) / (maxFreq - minFreq) * this.graphSize.x;
      this.pen.text('T', x, this.startCoordinate.y + this.graphSize.y + 30);
      this.pen.stroke('rgba(255, 0, 0, 0.3)');
      this.pen.drawLine(x, this.startCoordinate.y, x, this.startCoordinate.y + this.graphSize.y);
    }

    this.pen.stroke('rgba(255, 255, 255, 0.3)');
    this.pen.fill('rgba(0, 0, 0, 0)');
    this.pen.moveTo(startPoint);
    this.dataArray.map((data, index) => {
      const x = index * this.binWidth + this.startCoordinate.x;
      const y = this.startCoordinate.y + (1 - Math.min(data / this.maxValue, 1.0)) * this.graphSize.y;
      this.pen.lineTo({x, y});
    });
    this.pen.endPath();

    // labels
    Object.keys(this.labels).map((key) => {
      this.pen.text(key, this.labels[key], this.startCoordinate.y + this.graphSize.y + 30);
    });
  }
}
