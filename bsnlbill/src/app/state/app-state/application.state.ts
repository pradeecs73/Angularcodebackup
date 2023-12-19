/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
* Imports for application state
*/
import { TreeNode } from 'primeng/api';
import { PanelDataType } from '../../models/monitor.interface';
import { BaseConnector } from '../../opcua/opcnodes/baseConnector';
import { Connector } from '../../opcua/opcnodes/connector';
import { HTMLNode } from '../../opcua/opcnodes/htmlNode';
import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { AbstractState, State } from '../state';

export abstract class ApplicationState implements State<AbstractState>{

    constructor(protected facadeService: FacadeService) {
    }

    /*changes application status*/
    public abstract changeStatus(context: AbstractState);
    /*returns status*/
    public abstract status();
    /*establish connection */
    abstract establishConnection();
    /*save project */
    abstract saveProject();
    /*drop node */
    abstract dropNode();
    /* drop interface */
    abstract dropInterface();
    /* drop node to tree */
    abstract dropNodeToTree();
    /* drag from tree menu */
    abstract dragFromTreeMenu();
    /* drag node */
    abstract dragNode();
    /* show delete connection option */
    abstract showDeleteConnectionOption(connector:BaseConnector);
    /*show delete ac option */
    abstract showDeleteACOption();
    /* menu change */
    abstract menuChange(event);
    /*delete connection */
    abstract deleteConnection(connector:Connector);
    /* delete editor node */
    abstract deleteEditorNode(node:HTMLNode);
    /* update connector style */
    abstract updateConnectorState(connector:BaseConnector);
    /* style node */
    abstract styleNode(node:OPCNode);
    /* style connector */
    abstract styleConnector(connector:BaseConnector);
    /* delete connection online and project */
    abstract deleteConnectionInonlineAndProject(connector:BaseConnector);
    /* create area */
    abstract createArea(parentAreaID:string);
    /* delete area */
    abstract deleteArea(nodeData:TreeNode);
    /* ungroup area */
    abstract unGroupArea(node: TreeNode);
    /* reorder area */
    abstract reOrderArea(event: { dragNode: TreeNode, dropNode: TreeNode, index: number, originalEvent, accept },selectedItems:TreeNode[]);
    /* navigate route */
    abstract navigateRoute();
    /* show connection delete option */
    abstract showConnectionDeleteOption();
    /* show device unavailable */
    abstract showDeviceUnavailable(panelData:PanelDataType);
    /* draw canvas */
    abstract drawCanvas(myCanvas);
    /* is online */
    abstract isOnline();
}
