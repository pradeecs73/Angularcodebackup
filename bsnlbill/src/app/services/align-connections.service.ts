/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import { Numeric } from '../enum/enum';
import { ConnectionPtObj,HTMLNodeConnector } from '../models/models';
import { Connector } from '../opcua/opcnodes/connector';
import { sortParam, mergeSort } from '../utility/utility';
import { FacadeService } from '../livelink-editor/services/facade.service';

@Injectable({
  providedIn: 'root'
})
export class AlignConnectionsService {
  /*
  *
  * Variables are declared here
  */
  dx: number; /* min distance between vertical lines*/
  dy: number; /* min distance between horizontal lines*/
  inputPts: Array<ConnectionPtObj>; /* p3, p4 */
  outputPts: Array<ConnectionPtObj>; /* p2 */
  connectionPts: Array<ConnectionPtObj>;
  verticalPts: Array<ConnectionPtObj>;

  constructor(private readonly facadeService: FacadeService) {
    this.dx = 10;
    this.dy = 20;
  }
  /*
  *
  * Align connections
  */
  alignConnections() {
    this.connectionPts = [];
    this.verticalPts = [];
    this.alignVerticals();
  }
  /*
  *
  * Align verticals
  */
  private alignVerticals() {
    this.extractInputOutputs();
  }
  /*
  *
  * Extract input and output
  */
  private extractInputOutputs() {
    const connections:HTMLNodeConnector = this.facadeService.editorService.liveLinkEditor.connectorLookup;
    for (const key in connections) {
      if (connections.hasOwnProperty(key)) {
        const connection:Connector = connections[key];
        /* istanbul ignore next */
        this.connectionPts.push({
          x: connection?.plotPoints[1]?.x,
          y: connection?.plotPoints[1]?.y,
          id: connection.id, type: 'p2',
          quadrant: connection.quadrant
        });
        /* istanbul ignore next */
        this.connectionPts.push({
          x: connection?.plotPoints[Numeric.TWO]?.x,
          y: connection?.plotPoints[Numeric.TWO]?.y,
          id: connection.id,
          type: 'p3',
          quadrant: connection.quadrant
        });
        /* istanbul ignore next */
        this.verticalPts.push({
          x: connection?.plotPoints[Numeric.TWO]?.x,
          y: connection?.plotPoints[Numeric.TWO]?.y,
          id: connection.id,
          type: 'p3',
          quadrant: connection.quadrant
        });
      }
    }
    sortParam.p = 'x';
    this.connectionPts = mergeSort(this.connectionPts); /* sorts based on x */
    this.adjustThePlotPoints();
    sortParam.p = 'y';
    this.verticalPts = mergeSort(this.verticalPts); /* sorts based on x */
    this.adjustTheYPlotPoints();

  }
  /*
  *
  * adjust plot points
  */
  adjustThePlotPoints() {
    for (let index = 0; index < this.connectionPts.length - 1; index++) {
      const currentConnection = this.connectionPts[index];
      const nextConnection = this.connectionPts[index + 1];
      const xRange = currentConnection.x + this.dx;
      const threshold = Math.floor(xRange);
      if (threshold > Math.floor(nextConnection.x)) {
        const moveLength = xRange - nextConnection.x;
        nextConnection.x += moveLength;
        this.updateTheActualConnection(nextConnection);
      }
    }
  }
  /*
  *
  * Adjust the y plot points
  */
  adjustTheYPlotPoints() {
    for (let index = 0; index < this.verticalPts.length - 1; index++) {
      const currentConnection = this.verticalPts[index];
      const nextConnection = this.verticalPts[index + 1];
      const yRange = currentConnection.y + this.dy;
      const threshold = Math.floor(yRange);
      if (threshold > Math.floor(nextConnection.y)) {
        const moveLength = yRange - nextConnection.y;
        nextConnection.y += moveLength;
        this.updateTheVerticalActualConnection(nextConnection);
      }
    }
  }
  /*
  *
  * update the actual connection
  */
  updateTheActualConnection(newPtObj: ConnectionPtObj) {
    const connection:Connector = this.facadeService.editorService.liveLinkEditor.connectorLookup[newPtObj.id];
    switch (newPtObj.type) {
      case 'p2':
        connection.plotPoints[1].x = newPtObj.x; /* updating pt2  */
        break;
      case 'p3':
        connection.plotPoints[Numeric.TWO].x = newPtObj.x; /* updating pt3, pt4  */
        if (connection.plotPoints.length > Numeric.FOUR) {
          connection.plotPoints[Numeric.THREE].x = newPtObj.x;
        }
        break;
      default: break;
    }

    connection.buildCurveString();
    connection.updateActualPath();
  }
  /*
  *
  * update the vertical actual connection
  */
  updateTheVerticalActualConnection(newPtObj: ConnectionPtObj) {
    const connection:Connector = this.facadeService.editorService.liveLinkEditor.connectorLookup[newPtObj.id];
    connection.plotPoints[Numeric.TWO].y = newPtObj.y;
    connection.buildCurveString();
    connection.updateActualPath();
  }

}
