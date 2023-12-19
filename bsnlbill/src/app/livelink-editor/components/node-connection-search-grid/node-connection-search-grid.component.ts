/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { EntityState } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { FillingLineNodeType, Numeric, ObjectType, StrategyList, StrategyOperations } from '../../../enum/enum';
import { MatchingConnectionInterface, SelectedContextAnchor } from '../../../models/connection.interface';
import { FillingLineService } from '../../../services/filling-line-store.service';
import { FillingArea, FillingNode } from '../../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../../utility/constant';
import { findConnectionInAndOut } from '../../../utility/utility';

import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-node-connection-search-grid',
  templateUrl: './node-connection-search-grid.component.html',
  styleUrls: ['./node-connection-search-grid.component.scss']
})
export class NodeConnectionSearchGridComponent implements OnInit {
  /*
  *
  *  Variables are declared here
  *
  */
  interfaceSelected: string;
  @Input()
  connectionSearchContextMenu: SelectedContextAnchor;
  filteredDevicesAddedToGrid = Array(Numeric.FIVE).fill(null);
  matchingInterfaces = [];
  entities: EntityState<FillingArea | FillingNode>;

  showSearch = false;
  searchText: string;
  headerAreaHierarchy$: Observable<string>;

  constructor(
    protected readonly fillingLineService: FillingLineService,
    private readonly facadeService: FacadeService
  ) {
  }
  /*
  * When we click outside unselect
  *
  *
  */
  @HostListener('document:click', ['$event']) clickedOutside(event) {
    if (typeof (event.target.className) === ObjectType.OBJECT) {
      this.facadeService.editorService.toggleAnchorSelection(null, false, false);
    }
  }
  /*
  *
  * This life cycle hook is called when the component initializes
  *
  */
  ngOnInit(): void {
    this.headerAreaHierarchy$ = this.facadeService.editorService.getCurrentAreaHierarchy();
    this.getMatchingInterface();
    this.addHoverDisplayName();
  }
  /*
  *
  * when we select or deselect option
  *
  */
  radioButtonChecked(event, device) {
    if (event.target.checked) {
      const connectionNeededParams = this.getParameterForStrategy(this.connectionSearchContextMenu, device);
      this.facadeService.editorService.toggleAnchorSelection(null, false, false);
      this.callStrategy(connectionNeededParams.sourceParent, connectionNeededParams.targetParent, device, connectionNeededParams);
    }
    event.stopImmediatePropagation();
  }

  /*
  *
  * show/hide search option.
  *
  */
  toggleSearchIcon() {
    this.showSearch = !this.showSearch;
    this.replaceFixedArray(this.matchingInterfaces);
    this.searchText = '';
  }
  /*
  *
  * When we click on search
  *
  */
  onSearch(event) {
    const searchedText = (event.target.value).toLowerCase();
    const compatibleDevices = this.matchingInterfaces.filter(device => device.displayName.toLowerCase().includes(searchedText));
    this.replaceFixedArray(compatibleDevices);
  }
  /*
  *
  *  Lists the compatible interfaces in the table
  *
  */
  private replaceFixedArray(compatibleDevices: MatchingConnectionInterface[]) {
    const data = [...compatibleDevices];
    this.filteredDevicesAddedToGrid = Array(Numeric.FIVE).fill(null);
    this.filteredDevicesAddedToGrid.forEach((_, i) => {
      if (this.filteredDevicesAddedToGrid[i] === null && data?.length > 0) {
        this.filteredDevicesAddedToGrid[i] = data.pop();
      } else {
        this.filteredDevicesAddedToGrid[i] = {
          hideCheckBox: true,
          isSelected: false
        };
      }
    });
  }
  /*
  *
  * Show the hierarchy structure on hover
  *
  */
  private addHoverDisplayName() {
    const projectName = this.facadeService.dataService.getProjectName();
    this.matchingInterfaces.forEach(interfaceDetail => {
      if (interfaceDetail.parent !== ROOT_EDITOR) {
        interfaceDetail.hoverDisplayName =
          `${projectName} > ${this.facadeService.areaUtilityService.getAreaHierarchy(interfaceDetail.parent).areaName}
           > ${interfaceDetail.automationComponentName} > ${interfaceDetail.interfaceName}`;
      }
      return interfaceDetail;
    });
  }
  /*
  *
  * Find the matching interface
  *
  */
  private getMatchingInterface() {
    const {
      anchorDetails: {
        deviceId: currentAnchorDeviceId,
        interfaceData: {
          type
        }
      },
      isClient
    }
      = this.connectionSearchContextMenu;
    this.matchingInterfaces = this.facadeService.dataService.getMappedCompatibleInterfaceByType(type, isClient, currentAnchorDeviceId);
    this.replaceFixedArray(this.matchingInterfaces);
  }
  /*
  *
  * Get mapped clicked interface
  *
  */
  private getMappedClickedInterface(clickedNode) {
    let sourceDeviceId, sourceParent, sourceAcId;
    const { anchorDetails:
      { interfaceData: { id: clickedInterfaceId } }, isClient } = clickedNode;
    const currentAreaId = clickedNode.anchorDetails.parentNode.id;

    const connectedFrom = clickedNode.anchorDetails.parentNode.type;
    if (clickedNode.anchorDetails.parentNode.type === FillingLineNodeType.AREA) {
      sourceAcId = clickedNode.anchorDetails.interfaceData.automationComponentId;
      sourceDeviceId = clickedNode.anchorDetails.interfaceData.deviceId;
      const nodeDetails = this.facadeService.dataService.getNodeByID(sourceAcId);
      sourceParent = nodeDetails.parent;
    } else {

      const { anchorDetails: { parentNode: { deviceId, id, parent } } } = clickedNode;
      sourceDeviceId = deviceId;
      sourceAcId = id;
      sourceParent = parent;
    }
    return {
      sourceDeviceId,
      sourceParent,
      sourceAcId,
      clickedInterfaceId,
      isClient,
      connectedFrom,
      currentAreaId
    };
  }
  /*
  *
  * get parameter for strategy
  *
  */
  private getParameterForStrategy(clickedNode: SelectedContextAnchor, matchingDevice: MatchingConnectionInterface) {
    let {
      sourceDeviceId,
      sourceParent,
      sourceAcId,
      clickedInterfaceId,
      isClient,
      currentAreaId
    } = this.getMappedClickedInterface(clickedNode);
    let { automationComponentId: targetAcId,
      deviceId: targetDeviceId, interfaceId, parent: targetParent, type } = matchingDevice;
    let [clientInterfaceId, serverInterfaceId] = [clickedInterfaceId, clickedInterfaceId];
    if (!isClient) {
      [sourceAcId, targetAcId] = [targetAcId, sourceAcId];
      [sourceDeviceId, targetDeviceId] = [targetDeviceId, sourceDeviceId];
      [sourceParent, targetParent] = [targetParent, sourceParent];
    }
    if (matchingDevice.isClientInterface) {
      clientInterfaceId = interfaceId;
    } else {
      serverInterfaceId = interfaceId;
    }
    return {
      clientInterfaceId,
      serverInterfaceId,
      sourceAcId,
      sourceDeviceId,
      sourceParent,
      targetAcId,
      targetDeviceId,
      targetParent,
      type,
      currentAreaId
    };
  }
  /*
  *
  * call strategy
  *
  */
  private callStrategy(sourceAreaParent: string, targetDeviceParent: string, device: MatchingConnectionInterface, connectionNeededParams) {
    const areaHierarchy = this.facadeService.areaUtilityService.getCommonParent(sourceAreaParent, targetDeviceParent);
    const { sourceHierarchy, targetHierarchy,
      sourceAcId,
      targetAcId } =
      this.facadeService.areaUtilityService.getSourceTargetDevice(areaHierarchy,
        connectionNeededParams.sourceAcId,
        connectionNeededParams.targetAcId,
        device
      );
    areaHierarchy.sourceAreaHierarchy = sourceHierarchy;
    areaHierarchy.targetAreaHierarchy = targetHierarchy;
    const { connectionIn, connectionOut } = findConnectionInAndOut(areaHierarchy, sourceAcId, targetAcId);
    const scenario = this.facadeService.areaUtilityService.getScenario(areaHierarchy);
    const executeStrategy = () => {
      this.facadeService.strategyManagerService.executeStrategy(scenario, StrategyOperations.CONNECTION_BY_SEARCH, {
        ...connectionNeededParams, ...areaHierarchy, connectionIn, connectionOut
      });
    };
    const openPopup = () => {
      const currentEditor = this.facadeService.editorService.getEditorContext().id;
      const parentOfCommonParentRecursively = this.facadeService.areaUtilityService.validateCommonParentWithCurrentEditor(areaHierarchy.commonParent);
      /*
      *
      * Shows a confirmation popup
      *
      */
      if (currentEditor !== areaHierarchy.commonParent && parentOfCommonParentRecursively === currentEditor) {
        this.facadeService.overlayService.confirm({
          message: { content: [this.facadeService.translateService.instant('overlay.confirm.createConnection.message.content')] },
          header: this.facadeService.translateService.instant('overlay.confirm.createConnection.header'),
          successLabel: this.facadeService.translateService.instant('common.buttons.yes'),
          optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
          acceptCallBack: () => {
            executeStrategy();
          }
        });
      } else {
        executeStrategy();
      }
    };
    /*
    * Scenario : nested area / root or same area open a confirmation popup
    *
    *
    */
    if (scenario === StrategyList.NESTED_SIBLINGS_AREA_STRATEGY || scenario === StrategyList.ROOT_OR_SAME_AREA_STRATEGY) {
      openPopup();
    } else {
      /*
     *
      * Else execute strategy
     *
     */
      executeStrategy();
    }
  }

}

