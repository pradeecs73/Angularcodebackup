/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
* Imports for the service
*/ 
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import uniqid from 'uniqid';
import { Observable } from 'rxjs';
import { ClearFillingLine, CreateArea, CreateAreaList, CreateNode, CreateNodeList, DeleteNode, DeselectAllDevice, SelectDevice,
   UpdateArea, UpdateNode,DeleteArea} from '../store/filling-line/filling-line.actions';
import { FillingArea, FillingNode, FillingLineState } from '../store/filling-line/filling-line.reducer';
import { AppState } from '../store/app.reducer';
import { AutomationComponent,  } from '../models/targetmodel.interface';
import { FillingLineNodeType,Numeric } from '../enum/enum';
import { Area } from '../models/models';
import { isNullOrEmpty } from '../utility/utility';
import { ROOT_EDITOR } from '../utility/constant';
import { FacadeService } from '../livelink-editor/services/facade.service';
@Injectable({
  /*
    * 'root' refers service is provided at root level
    */
    providedIn: 'root'
  })
export class FillingLineService{
    /* Variables are declared here
    */
    constructor(private readonly store: Store<AppState>,
     private readonly facadeService: FacadeService) { }
      /* Get filling line
      */
    getFillingLine(): Observable<FillingLineState>
    {
      return this.store.select('fillingLine');
    }
    /* Get filling node data
    */
    getFillingNodeData(x:number, y:number, acData:AutomationComponent,parentNode:string,adapterType?:string): FillingNode {
        acData = { ...acData };

        const fillLineNode: FillingNode = {
          x,
          y,
          id: acData.id,
          element: null,
          selected: false,
          state: acData.state,
          deviceId: acData.deviceId,
          clientInterfaces: acData.clientInterfaces,
          serverInterfaces: acData.serverInterfaces,
          address: acData.address,
          name :acData.name,
          deviceName:acData.deviceName,
          adapterType:adapterType,
          type : FillingLineNodeType.NODE,
          parent :parentNode??ROOT_EDITOR
        };
        return fillLineNode;
    }
    /* Get filling area data
    */
    getFillingAreaData(areaData:Area,parentNode:string,editorYCoordinate?:number,areaNumber?:number):FillingArea
    {
      let fillingArea={} as FillingArea;
      if(isNullOrEmpty(areaData))
      {
        areaData.x=15;
        areaData.y=editorYCoordinate;
        areaData.id=uniqid('area_');
        if(!areaNumber)
        {
          const datetime=Date.now().toString();
          areaNumber= Number(datetime.substring(datetime.length-Numeric.FOUR));
        }
        areaData.name=`Area ${areaNumber}`;
        fillingArea.repositionRequired=true;
      }
      fillingArea= {
       ...areaData,
       ...fillingArea,
        type : FillingLineNodeType.AREA,
        //nodeIds :[],
        element : null,
        parent : parentNode??ROOT_EDITOR,
        serverInterfaces:this.facadeService.dataService.getServerInterfaceList(areaData) || [],
        clientInterfaces:this.facadeService.dataService.getClientInterfaceList(areaData)||[]
      };
      return fillingArea;
    }
    /* Create filling node data
    */
    createFillingNodeData(x:number, y:number,acData:AutomationComponent,parentContext:string,adapterType?:string)
    {
      const fillLineNode:FillingNode=this.getFillingNodeData(x, y, acData,parentContext,adapterType);
      this.facadeService.dataService.updateInterface(fillLineNode);
      this.store.dispatch(new CreateNode(fillLineNode));
    }
    /* Create node list
    */
    createNodeList(nodes:Array<FillingNode>)
    {
      this.store.dispatch(new CreateNodeList(nodes));
    }
    /* Get updated node data
    */
    getUpdatedNodeData(id:string,changes:Partial<FillingNode>) : Update<FillingNode>
    {
      const changeNodeData: Update<FillingNode> = { id: id, changes: changes };
      return changeNodeData;
    }
    /* Create filling line  
    */
    clearFillingLine():void {
      this.store.dispatch(new ClearFillingLine());
    }
    /* Delete node
    */
    deleteNode(deviceId): void {
      this.store.dispatch(new DeleteNode(deviceId));
    }
    /* update node
    */
    updateNode(id:string,changes:Partial<FillingNode>)
    {
      this.store.dispatch(new UpdateNode(id, changes));
    }
    /* select device
    */
    selectDevice(id: string):void {
      this.store.dispatch(new SelectDevice(id, { selected: true }));
    }
    /* deselected device
    */
    deselectDevices(deselectedDevices:Array<Update<FillingNode>>):void
    {
        this.store.dispatch(new DeselectAllDevice(deselectedDevices));
    }

    // updateMousePosition(node:OPCNode)
    // {
    //   this.store.dispatch(new UpdateMousePosition(node.id, { x: node.x, y: node.y }));
    // }
    /* Create filling area data
    */
    createFillingAreaData(parent:string,areaNumber:number,editorYCoordinate:number,area ={} as Area)
    {
      const fillingArea:FillingArea=this.getFillingAreaData(area,parent,editorYCoordinate,areaNumber);
      this.facadeService.dataService.addArea(fillingArea);
      this.store.dispatch(new CreateArea(fillingArea));
    }
    /* Create area list
    */
    createAreaList(areas:Array<FillingArea>)
    {
      this.store.dispatch(new CreateAreaList(areas));
    }
    /* update area
    *
    */
    updateArea(id:string,changes:Partial<FillingArea>)
    {
      this.store.dispatch(new UpdateArea(id, changes));
    }
    /* Delete area
    */
    deleteArea(areaId): void {
      this.store.dispatch(new DeleteArea(areaId));
    }

}
