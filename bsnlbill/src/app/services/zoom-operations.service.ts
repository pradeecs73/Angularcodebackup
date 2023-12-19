/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { FillingLineNodeType, Numeric, ZoomFactors, numConstants } from '../enum/enum';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { PlantArea } from '../opcua/opcnodes/area';
import { Subject } from 'rxjs';
import { SubConnectionZoomData } from '../models/models';
import { select } from '../../app/vendors/d3.module';

@Injectable({
  providedIn: 'root'
})
export class ZoomOperationsService {

  constructor(private readonly facadeService: FacadeService) {
    this.zoomSubscription();
   }

  selectedZoomPercent = Numeric.ONEHUNDRED;
  zoomPercentChange: boolean;
  currentZoomScaleFactor = 1;
  fitToHeightScaling=Numeric.POINTSIX;
  zoomChangeValue = false;

  private readonly subConnectionZoomChange = new Subject();
  subConnectionZoomChangeObs = this.subConnectionZoomChange.asObservable();

  private readonly zoomPercent = new Subject();
  zoomPercentObs = this.zoomPercent.asObservable();

  /*
  *
  * Method to increase the zoom percent when user click zoom plus icon
  *
  */

  public setZoomIn(zoomPercent):void{

    this.selectedZoomPercent = Number(this.selectedZoomPercent);
    if (this.selectedZoomPercent < numConstants.NUM_100) {
      this.selectedZoomPercent = this.selectedZoomPercent + Numeric.TWENTYFIVE;
    } else if (this.selectedZoomPercent > numConstants.NUM_100 && this.selectedZoomPercent !== Numeric.FOURHUNDRED) {
      this.selectedZoomPercent = this.selectedZoomPercent + numConstants.NUM_200;
    } else {
      this.selectedZoomPercent = this.selectedZoomPercent + numConstants.NUM_100;
    }

    this.changeZoomPercent(zoomPercent);
    this.setSubconnectionAllignment({ zoomPercent:zoomPercent, zoomChangeValue: !this.zoomChangeValue });
    this.facadeService.drawService.resizeCanvas();

  }

  /*
  *
  * Method to decrease the zoom percent when user click zoom minus icon
  *
  */

  public setZoomOut(zoomPercent):void{

    this.selectedZoomPercent = Number(this.selectedZoomPercent);
    if (this.selectedZoomPercent <= Numeric.ONEHUNDRED) {
      this.selectedZoomPercent = this.selectedZoomPercent - Numeric.TWENTYFIVE;
    } else if (this.selectedZoomPercent <= Numeric.FOURHUNDRED && this.selectedZoomPercent !== Numeric.TWOHUNDERD) {
      this.selectedZoomPercent = this.selectedZoomPercent - Numeric.TWOHUNDERD;
    }
    else {
      this.selectedZoomPercent = this.selectedZoomPercent - Numeric.ONEHUNDRED;
    }
    this.changeZoomPercent(zoomPercent);
    this.setSubconnectionAllignment({ zoomPercent:zoomPercent, zoomChangeValue: !this.zoomChangeValue });

    this.facadeService.drawService.resizeCanvas();

  }

  /*
  *
  * Method to adjust the x value of the nodes if it is outside the editor
  *
  */

  public adjustNodesInEditorForSelectedZoom(zoomPercent):void{

    if(this.selectedZoomPercent === Numeric.ONE || this.selectedZoomPercent === Numeric.THREE){
      this.facadeService.editorService.liveLinkEditor.editorNodes.forEach(node => {
        if (node.x > Numeric.FIVEFIFTY) {
          this.zoomPercentChange = true;
          node.x = Numeric.FIVEFIFTY;
          this.facadeService.editorService.updateHTMLNode(node);
          if (node.type === FillingLineNodeType.NODE) {
            this.facadeService.opcNodeService.updateNodeMoveData(node as OPCNode);
          }
          else {
            this.facadeService.plantAreaService.updateNodeMoveData(node as PlantArea);
          }

          node.updateAnchors();
          this.zoomPercentChange = false;
        }
      });

        this.updateNodeOnFitWidthAndScreen();
     }

    this.changeZoomPercent(zoomPercent);
    this.setSubconnectionAllignment({ zoomPercent: zoomPercent, zoomChangeValue: !this.zoomChangeValue });
    this.facadeService.drawService.resizeCanvas();

  }


 /*
  *
  * Method to sort nodes in the editor based on y value
  *
  */
  private updateNodeOnFitWidthAndScreen():void{
    if(this.selectedZoomPercent === Numeric.ONE){
      const sortedArrayEditorNodes=[...this.facadeService.editorService.liveLinkEditor.editorNodes].sort((a,b)=>a.y - b.y);
      this.facadeService.editorService.liveLinkEditor.editorNodes=sortedArrayEditorNodes;
      this.reassignNodeYvalueEliminatingExtraSpace();
      }
  }

   /*
  *
  * Method to find the MaxY value of the Editor after Sorting
  *
  */

  reassignNodeYvalueEliminatingExtraSpace(){

    for(let i=0;i<this.facadeService.editorService.liveLinkEditor.editorNodes.length-1;i++){

      const Yrange=(this.facadeService.editorService.liveLinkEditor.editorNodes[i+1].y -
        this.facadeService.editorService.liveLinkEditor.editorNodes[i].y) > Math.abs(Numeric.TWOEIGHTY);

      if(Yrange){
          this.zoomPercentChange = true;
          this.facadeService.editorService.liveLinkEditor.editorNodes[i+1].y = this.facadeService.editorService.liveLinkEditor.editorNodes[i].y+Numeric.TWOEIGHTY;
          const node= this.facadeService.editorService.liveLinkEditor.editorNodes[i+1];
          this.facadeService.editorService.updateHTMLNode(node);
          if (node.type === FillingLineNodeType.NODE) {
            this.facadeService.opcNodeService.updateNodeMoveData(node as OPCNode);
          }
          else {
            this.facadeService.plantAreaService.updateNodeMoveData(node as PlantArea);
          }

          node.updateAnchors();
          this.zoomPercentChange = false;

          const maxY=this.facadeService.editorService.liveLinkEditor.editorNodes[this.facadeService.editorService.liveLinkEditor.editorNodes.length-1].y;
          const HeightScaling=maxY/Numeric.THREEHUNDRED;
          const finalHeightScalingValue=this.estimateFitToHeightScaling(HeightScaling);
          this.fitToHeightScaling=finalHeightScalingValue;

       }

    }

  }

  /*
  *
  * Method to find the Scaling Y Value for fit to screen
  *
  */
    private  estimateFitToHeightScaling(HeightScaling):Numeric{
      const HeightScalingArray=[Numeric.ONE,Numeric.POINTNINETHREE,Numeric.POINTEIGHTFIVE,Numeric.POINTSEVENEIGTH,
        Numeric.POINTSEVEN,Numeric.POINTSIXTHREE,Numeric.POINTFIVEFIVE,Numeric.POINTFOUREIGHT,Numeric.POINTFOUR,Numeric.POINTTHREETHREE];

        const scalingValue0=HeightScaling <= Numeric.ONE;
        const scalingValue1=HeightScaling > Numeric.ONE && HeightScaling <= Numeric.ONEPOINTTWOFIVE;
        const scalingValue2=HeightScaling > Numeric.ONEPOINTTWOFIVE && HeightScaling <= Numeric.ONEPOINTFIVE;
        const scalingValue3=HeightScaling > Numeric.ONEPOINTFIVE && HeightScaling <= Numeric.ONEPOINTSEVENFIVE;
        const scalingValue4=HeightScaling > Numeric.ONEPOINTSEVENFIVE && HeightScaling <= Numeric.TWO
        const scalingValue5=HeightScaling > Numeric.TWO && HeightScaling <= Numeric.TWOPOINTTWOFIVE;
        const scalingValue6=HeightScaling > Numeric.TWOPOINTTWOFIVE && HeightScaling <= Numeric.TWOPOINTFIVE;
        const scalingValue7=HeightScaling > Numeric.TWOPOINTFIVE && HeightScaling <= Numeric.THREEPOINTTWOFIVE;
        const scalingValue8=HeightScaling > Numeric.THREEPOINTTWOFIVE && HeightScaling <= Numeric.FOUR;
        const scalingValue9=HeightScaling >  Numeric.FOUR;

        const scalingRangArray=[scalingValue0,scalingValue1,scalingValue2,scalingValue3,
          scalingValue4,scalingValue5,scalingValue6,scalingValue7,scalingValue8,scalingValue9];

        const scalingIndex=scalingRangArray.findIndex(scalevalue=>scalevalue===true);
        return HeightScalingArray[scalingIndex];

    }

 /*
  *
  *Function is used to set zoom percent
  *
  */

   public setZoomPercent():Numeric{

        let zoomPercent;
        this.selectedZoomPercent = Number(this.selectedZoomPercent);
        if (this.selectedZoomPercent === Numeric.TWENTYFIVE) {
            zoomPercent = Numeric.POINTTWENTYFIVE;
        } else if (this.selectedZoomPercent === Numeric.FIFTY) {
            zoomPercent = Numeric.POINTFIFTY;
        } else if (this.selectedZoomPercent === Numeric.SEVENTYFIVE) {
            zoomPercent = Numeric.POINTSEVENTFIVE;
        } else if (this.selectedZoomPercent === Numeric.ONEHUNDRED) {
            zoomPercent = Numeric.ONE;
        } else if (this.selectedZoomPercent === Numeric.TWOHUNDERD) {
            zoomPercent = Numeric.ONEPOINTTWOFIVE;
        } else if (this.selectedZoomPercent === Numeric.FOURHUNDRED) {
            zoomPercent = Numeric.ONEPOINTFIVE;
        } else if (this.selectedZoomPercent === Numeric.THREE) {
            zoomPercent = Numeric.TWO; //scaleX
        } else if (this.selectedZoomPercent === Numeric.ONE) {
            zoomPercent = Numeric.ELEVEN;
        } else {
            zoomPercent = Numeric.ONEPOINTSEVENFIVE;
        }

        return zoomPercent;

    }

  /* Event emmiter to set subconnection alignment*/

  setSubconnectionAllignment(value: SubConnectionZoomData) {
    this.subConnectionZoomChange.next(value);
  }

 /*Event emmiter to change zoom percent*/

     changeZoomPercent(value: number) {
      this.zoomPercent.next(value);
    }

  /* Function to draw canvas online and offline*/

  public drawCanvasForOnlineAndOffline():void{
    const zoomPercentOnLoad=this.setZoomPercent()
    this.changeZoomPercent(zoomPercentOnLoad);
  }

 private zoomSubscription():void{
    this.zoomPercentObs.subscribe(zoom => {
      if (zoom) {
        const zoomValue = Number(zoom);
        if (zoomValue < 1) {
          this.currentZoomScaleFactor = zoomValue;
        }
        else {
          this.currentZoomScaleFactor = 1;
        }

        if (zoomValue === ZoomFactors.FITTOWIDTH) {
          this.facadeService.editorService.liveLinkEditor.workspace.node().setAttribute('transform', `scale(0.85, 0.9)`);
        } else if (zoomValue === ZoomFactors.FITTOSCREEN) {
          //scale x and y to small
          this.facadeService.editorService.liveLinkEditor.workspace.node().setAttribute('transform', `scale(0.85,${this.fitToHeightScaling})`);
        } else {
          // scale X
          this.facadeService.editorService.liveLinkEditor.workspace.node().setAttribute('transform', `scale(${zoomValue})`);
          if (zoomValue < 1) {
            // to redefine the rect after zoom out
            select('.plant-view-workspace .grid .restrict').attr('width', '200%');
            select('.plant-view-workspace .grid .restrict').attr('height', '200%');
          }
        }
      }
    });
  }

}
