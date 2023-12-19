import { connector } from 'mockData/connector';
import { subConnection } from 'mockData/projectData';
import { TreeNode } from 'primeng/api';
import * as utility from '../../../src/app/utility/utility';
import { AccessType, ConnectionAttributes, ConnectorCreationMode, ConnectorType, DeviceAttributes, FillingLineNodeType, NodeAnchorType, ProjectState, SubConnectorCreationMode } from '../enum/enum';
import { AreaHierarchy } from '../models/area.interface';
import { Connection, ConnectionObjectDetails, SidePanelInterfaceDetails, SubConnection, SubConnectionIdList, SubConnectionPayload } from '../models/connection.interface';
import { ConfiguredConnectionObj } from '../models/models';
import { AreaInterface, DeviceConfig, ISidePanel, Properties, RelatedEndPointInterface } from '../models/targetmodel.interface';
import { Connector } from '../opcua/opcnodes/connector';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { SubConnector } from '../opcua/opcnodes/subConnector';
import { ProjectDataService } from '../shared/services/dataservice/project-data.service';
import { CONNECTIONLISTROWID, ROOT_EDITOR } from './constant';
fdescribe('utility service suite', () => {
    const dataService = {
        getDeviceByAddress(){
            return 'abcde';
        },
        getAutomationComponent(){
            return 'test'
        },
        getClientInterface(){
            return 'FillingToMixing'
        },
        getDevice(){
            return 'addreess'
        }, 
        getArea(_el) {
            return {
                serverInterfaceIds: [{
                    automationComponentId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n'
                }]
            }
        }
    }as unknown as ProjectDataService;
    let connectors = {
        type : ConnectorType.SUBCONNECTOR,
        isInput: true,
        inputAnchor : {
            parentNode: {
                type : FillingLineNodeType.AREA,
                deviceId: 'abcde',
                name : 'test',
                id : '12345',
                clientInterfaces : [{
                    id : '1234'
                }],
            },
            interfaceData: {
                id: '1234',
                name: 'FillingToMixing',
                deviceId : 'abcde',
                automationComponentId : 'BottleFilling_LiquidMixing'
            }
        },
        outputAnchor: {
            parentNode :{
                type : FillingLineNodeType.NODE,
                deviceId : '12345',
                name : 'abcde',
                serverInterfaces : [{
                    id : 'testt'
                }]

            } as unknown as OPCNode,
            interfaceData: {
                name :'defgi',
                id: 'testt'
            },

        }
    } as unknown as Connector;
    it('log', ()=>{
        spyOn(window.console, 'log').and.callThrough();
        utility.log('abcde');
        expect(window.console.log).toHaveBeenCalled();
    })

    it('mergeSort', ()=>{
        let unsortedAray1 = [{
            x: 10,
            y: 10,
            id: "9883279c-cba8-416a-a88a-2451a773de77_Qm90dGxlRmlsbGluZw==__408fa78d-3d52-4dca-9b28-eb9f83b2eee5_TGlxdWlkTWl4aW5n__FillToMix_Type",
            type: 'pt2',
            quadrant: 2
        },
        {
            x: 120,
            y: 10,
            id: "9883279c-cba8-416a-a88a-2451a773de77_Qm90dGxlRmlsbGluZw==__408fa78d-3d52-4dca-9b28-eb9f83b2eee5_TGlxdWlkTWl4aW5n__FillToMix_Type",
            type: 'pt3',
            quadrant: 3
        }
    ]
    const res1 = utility.mergeSort(unsortedAray1);
        expect(res1).toBeDefined();
    })

    it('mergeSort', ()=>{
        let unsortedAray1 = [{
            id: "9883279c-cba8-416a-a88a-2451a773de77_Qm90dGxlRmlsbGluZw==__408fa78d-3d52-4dca-9b28-eb9f83b2eee5_TGlxdWlkTWl4aW5n__FillToMix_Type",
            quadrant: 2,
            type: "p2",
            x: 516.8124389648438,
            y: 217.07501220703125
        },
        {
            id: "9883279c-cba8-416a-a88a-2451a773de77_Qm90dGxlRmlsbGluZw==__408fa78d-3d52-4dca-9b28-eb9f83b2eee5_TGlxdWlkTWl4aW5n__FillToMix_Type",
            quadrant: 2,
            type: "p2",
            x: 663.6124877929688,
            y: 112.22502136230469
        }
    ]
    utility.sortParam.p = 'x';
    const res1 = utility.mergeSort(unsortedAray1);
        expect(res1).toBeDefined();
    })

    it('isNullOrEmpty for empty string',()=>{
        const res = utility.isNullOrEmpty('');
        expect(res).toBeTruthy();

        const res1 = utility.isNullOrEmpty({});
        expect(res1).toBeTruthy();

    })

    it('isNullOrUnDefined',()=>{
        const res = utility.isNullOrUnDefined(undefined);
        expect(res).toBeTruthy();
        const res3 = utility.isNullOrUnDefined(null);
        expect(res3).toBeTruthy();
    })

    it('isEmpty',()=>{
        const res = utility.isEmpty(null);
        expect(res).toBeTruthy();

        const res1 = utility.isEmpty({'a':10});
        expect(res1).toBeFalsy();

        const res2  = utility.isEmpty({});
        expect(res2).toBeTruthy();
    });

    it('getConnectionData',()=>{
        const res = utility.getConnectionData(connectors,'abcde');
        expect(res).toBeDefined();
    })

    it('getConnectData',()=>{
        connectors.outputAnchor.parentNode.type = FillingLineNodeType.AREA;
        const res = utility.getConnectData(connectors.inputAnchor,dataService as unknown as ProjectDataService,connectors.outputAnchor);
        expect(res).toBeDefined();

        const res1 = utility.getConnectData(connectors.inputAnchor,dataService as unknown as ProjectDataService,undefined);
        expect(res1).toBeDefined();
    })

    it('getRelatedEndPointData',()=>{
        const result = {
            address : 'test',
            automationComponent : 'test',
            functionalEntity : 'test'
        } as unknown as RelatedEndPointInterface;
        const res = utility.getRelatedEndPointData('test','test','test');
        expect(res).toEqual(result);
    })

    it('updateSubConnectionList',()=>{
        const existingSubConnection = {
            clientIds : ['a','b','c'],
            serverIds : ['d','e','f']
        }
        const updateSubConnection = {
            clientIds : ['a','b','c'],
            serverIds : ['d','e','f']
        }
        const result = {
            clientIds : ['a','b','c','a','b','c'],
            serverIds : ['d','e','f','d','e','f']
        }
        const res = utility.updateSubConnectionList(existingSubConnection,updateSubConnection);
        expect(res).toEqual(result)

        const res1 = utility.updateSubConnectionList(null,null);
        expect(res1).toEqual({clientIds:[],serverIds:[]})
    })

    it('getConnectDataFromSubConnector',()=>{
        const result = {
            areaId: "abcde",
            automationComponent: undefined,
            automationComponentId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n",
            deviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==",
            interfaceId: "FillingToMixing",
            interfaceName: undefined,
            serverDeviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA=="
        }
        const mockConnection={
            id: 'area_b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__area_b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type',
            in: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==__BottleFilling__FillingToMixing',
            out: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__LiquidMixing__FillingToMixing',
            selected: false,
            creationMode: ConnectorCreationMode.MANUAL,
            hasSubConnections: false,
            areaId: 'ROOT',
            acIds: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc='
          } as unknown as Connection;
        const res = utility.getConnectDataFromSubConnector({areaId:'abcde'} as unknown as SubConnector,mockConnection,false,dataService );
        expect(res).toEqual(result);
    })

    it('getConnectionObject',()=>{
        const res = utility.getConnectionObject(connector as unknown as Connector,dataService);
        expect(res).toBeDefined();
    })

    it('getSubConnectionDetails',()=>{
        const result = {
            acId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=",
            areaId: "area_l8alnjdn",
            deviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==",
            hTMLNodeId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=",
            interfaceId: "FillingToMixing",
            interfaceType: "FillToMix_Type"
        }
        const res = utility.getSubConnectionDetails(subConnection as unknown as SubConnection);
    })

    it('getInterfaceDetails',()=>{
        let res;
        res = utility.getInterfaceDetails(connector as unknown as Connector,NodeAnchorType.INPUT);

        connector.type = ConnectorType.SUBCONNECTOR;
        res = utility.getInterfaceDetails(connector as unknown as Connector,NodeAnchorType.INPUT);

        connector.isInput =true;
        res = utility.getInterfaceDetails(connector as unknown as Connector,NodeAnchorType.INPUT);

        connector.type = ConnectorType.CONNECTOR;
        res =utility.getInterfaceDetails(connector as unknown as Connector,NodeAnchorType.OUTPUT);

        expect(res).toBeDefined();
    })

    it('getConnectionNameAndAcId',()=>{
        connector.inputAnchor.parentNode.type = FillingLineNodeType.AREA
        const res = utility.getConnectionNameAndAcId(connector as unknown as Connector,NodeAnchorType.INPUT,dataService)
        expect(res).toEqual({acId: undefined,
            connectionName: "undefined__undefined__123"})
    })

    it('getSubConnectionObject',()=>{
        let subconnector = {
            id : 'test',
            svgGlobal :{
                x :10,
                y:20
            },
            areaId:'a12_123',
            isInput : false,
            creationMode : ConnectorCreationMode.MANUAL,
            connectionId :'1234',
            inputAnchor : {
                parentNode: {
                    type : FillingLineNodeType.AREA,
                    deviceId: 'abcde',
                    name : 'test',
                    id : '12345',
                    clientInterfaces : [{
                        id : '1234'
                    }],
                },
                interfaceData: {
                    id: '1234',
                    name: 'FillingToMixing',
                    deviceId : 'abcde',
                    automationComponentId : 'BottleFilling_LiquidMixing'
                }
            },
            outputAnchor: {
                parentNode :{
                    type : FillingLineNodeType.NODE,
                    deviceId : '12345',
                    name : 'abcde',
                    serverInterfaces : [{
                        id : 'testt'
                    }]

                } as unknown as OPCNode,
                interfaceData: {
                    name :'defgi',
                    id: 'testt'
                },

            }
        } as unknown as SubConnector;
        let res;
        res = utility.getSubConnectionObject(subconnector);
        expect(res).toBeDefined();

        subconnector.isInput = true;
        res = utility.getSubConnectionObject(subconnector);
        expect(res).toBeDefined();

        delete subconnector.svgGlobal['x'];
        delete subconnector.svgGlobal['y'];
        delete subconnector['connectionId'];
        res = utility.getSubConnectionObject(subconnector);
        expect(res).toBeDefined();
    })

    it('getSubConnection',()=>{
        const payload = {
            acId : '123',
            acName : 'ABC',
            deviceId : '12345r',
            interfaceId : '2345688',
            subConnectionId: '12345678',
            connectionId : '23456',
            areaId :'123456',
            isClientInterface: true,
            interfaceExposedMode: ConnectorCreationMode.MANUAL
        } as unknown as  SubConnectionPayload;
        const result = {
            acId: "123",
            areaId: "123456",
            connectionId: "23456",
            creationMode: "Manual",
            data: "12345r__ABC__2345688",
            id: "12345678",
            isclient: true,
            x: 0,
            y: 0
        } as unknown as SubConnection;
       const res =  utility.getSubConnection(payload);
        expect(res).toEqual(result);
    })

    it('getUniqueInterfaceByAcId',()=>{
        const res = utility.getUniqueInterfaceByAcId([] as unknown as ISidePanel[],{} as unknown as ISidePanel)
        expect(res).toBeDefined();
    })

    it('getclientInterfaceDetails',()=>{
        const res = utility.getclientInterfaceDetails({} as unknown as SidePanelInterfaceDetails)
        expect(res).toBeDefined();
    })

    it('getserverInterfaceDetails',()=>{
        const res = utility.getserverInterfaceDetails({} as unknown as SidePanelInterfaceDetails)
        expect(res).toBeDefined();
    })

    it('getIntefaceExposeModeInOnline',()=>{
        const payload = {interfaceExposedMode: SubConnectorCreationMode.MANUAL} as unknown as AreaInterface;
        const res = utility.getIntefaceExposeModeInOnline(payload);
        expect(res).toEqual(SubConnectorCreationMode.MANUALONLINE)
    })

    it('generateInitialConnectionObject',()=>{
        const res = utility.generateInitialConnectionObject();
        expect(res).toBeDefined();
    })

    it('exposedInterfaceByConnectionList',()=>{
        const isSidePanel = [{
            automationComponentId : 'abcde'
        }] as unknown as ISidePanel[];
        const res = utility.exposedInterfaceByConnectionList(isSidePanel,'abcde');
        expect(res).toEqual(isSidePanel)
    })

    it('getConnectionId',()=>{
        const res = utility.getConnectionId(['a'],'a','abc');
        expect(res).toEqual('abc')

        const res1 = utility.getConnectionId(['a','b'],'c','abc');
        expect(res1).toEqual('a')
    })

    it('findConnectionInAndOut',()=>{
        const areaHierarchyDetails = {
            sourceAreaHierarchy : ['a','b'],
            commonParent : 'a',
            targetAreaHierarchy : ['a','b']
        }
        const res = utility.findConnectionInAndOut(areaHierarchyDetails,'abc','abc')
        expect(res).toEqual({connectionIn: "abc",connectionOut: "abc"})
    })

    it('isRootToArea',()=>{
        const source = {
            sourceAreaHierarchy:[ROOT_EDITOR]

        }

        const target = {
            targetAreaHierarchy:[ROOT_EDITOR]

        }
        const res = utility.isRootToArea(source as unknown as AreaHierarchy);
        expect(res).toBeDefined();

        // const res1 = utility.isRootToArea(target as unknown as AreaHierarchy);
        // expect(res1).toBeDefined();

    })

    it('getSourceTargetDevice',()=>{
        const res =utility.getSourceTargetDevice({},{},'a','b',{isClientInterface: true});
        expect(res).toBeDefined();
    })

    it('breadcrumbForArea',()=>{
        const res = utility.breadcrumbForArea({id:'test',parent:'testtt'} as unknown as TreeNode)
        expect(res).toBeDefined();
    })

    it('fetchSystemVar',()=>{
        const res = utility.fetchSystemVar([{name: ConnectionAttributes.SYSTEM}] as unknown as Array<Properties>)
        expect(res).toEqual({name: ConnectionAttributes.SYSTEM} as unknown as Properties)
    })

    it('fetchConnect',()=>{
        const res = utility.fetchConnect([{name: DeviceAttributes.CONNECT}] as unknown as Array<Properties>)
        expect(res).toEqual({name: DeviceAttributes.CONNECT} as unknown as Properties)
    })

    it('fetchDiagnose',()=>{
        const res = utility.fetchDiagnose([{name: ConnectionAttributes.DIAGNOSE}] as unknown as Array<Properties>)
        expect(res).toEqual({name: ConnectionAttributes.DIAGNOSE} as unknown as Properties)
    })

    it('fetchPartner',()=>{
        const res = utility.fetchPartner([{name: ConnectionAttributes.PARTNER}] as unknown as Array<Properties>)
        expect(res).toEqual({name: ConnectionAttributes.PARTNER} as unknown as Properties)
    })

    it('fetchDisconnect',()=>{
        const res = utility.fetchDisconnect([{name: DeviceAttributes.DISCONNECT}] as unknown as Array<Properties>)
        expect(res).toEqual({name: DeviceAttributes.DISCONNECT} as unknown as Properties)
    })

    it('getConnectionID',()=>{
        const res = utility.getConnectionID('a','b','c');
        expect(res).toEqual('a__b__c')
    })

     it('getSubConnectionID',()=>{
        const res = utility.getSubConnectionID('a','b','c');
        expect(res).toEqual('a__b__c')
    })

    it('getOutputAnchorDeviceId',()=>{
        const result = utility.getOutputAnchorDeviceId(connector as unknown as Connector)
        expect(result).toEqual('1234')
    })

    it('getConfiguredConenctionOnj',()=>{
        const result = utility.getConfiguredConenctionOnj(connector as unknown as Connector)
        expect(result).toBeDefined()
    })

    it('createConnectionObject',()=>{
        const connectionObjectDetails={
            soureDeviceId: 'abcde',
            connectionIn :ROOT_EDITOR,
            clientInterfaceId : 'test',
            targetDeviceId : 'abcd',
            connectionOut : 'area',
            serverInterfaceId : 'test12',
            creationMode : ConnectorCreationMode.MANUAL,
            commonParent: 'arae',
            clientAcId : 'abc',
            serverAcId: 'def'
        }
        const result1 =
        {
            "in": "abcde__ROOT__test",
            "out": "abcd__area__test12",
            "id": "abc__area__undefined",
            "selected": false,
            "creationMode": "Manual",
            "areaId": "arae",
            "hasSubConnections": false,
            "acIds": "abc__def",
            subConnections:undefined
        };

        const result = utility.createConnectionObject(connectionObjectDetails as unknown as ConnectionObjectDetails);
        expect(result).toEqual(result1 as unknown as Connection)
    })

    it('getInputAnchorDeviceId',()=>{
        const result = utility.getInputAnchorDeviceId(connector as unknown as Connector)
        expect(result).toEqual('1234')
    })

    it('getTagEventName',()=>{
        const result = utility.getTagEventName('a','b','c','d');
        expect(result).toEqual('a.b.c.tag.d')
    })

    it('getConnectionEventName',()=>{
        const result = utility.getConnectionEventName('a','b','c','d');
        expect(result).toEqual('a.b.c.connection.d')
    })

    it('getDeviceInterfaceName',()=>{
        const result = utility.getDeviceInterfaceName('a','b','c',);
        expect(result).toEqual('a.b.c')
    })

    it('getConnectionMonitorKey',()=>{
        const result = utility.getConnectionMonitorKey('a','b','c',);
        expect(result).toEqual('a_b_c')
    })

    it('isInstanceOfConfiguredConnection',()=>{
        const result = utility.isInstanceOfConfiguredConnection({status : 'test'} as unknown as ConfiguredConnectionObj)
        expect(result).toBeTruthy();
    })

    it('isConnectionListClickEvent',()=>{
        let clickEvent = {
            target : {
                parentNode : {
                    id : CONNECTIONLISTROWID,
                    nodeName :'TR'
                }
            }
        }
        const result = utility.isConnectionListClickEvent(clickEvent)
        expect(result).toBeTruthy();

        clickEvent.target.parentNode.id = 'test';
        const result1 = utility.isConnectionListClickEvent(clickEvent)
        expect(result1).toBeTruthy();

    })

    it('isDeviceAdded',()=>{
        const res = utility.isDeviceAdded('test',[{address : 'test'}] as unknown as  Array<DeviceConfig>);
        expect(res).toBeTrue();
    })

    it('getUniqueElement',()=>{
        const res  = utility.getUniqueElement([],'test');
    })

    it('padLeadingZeros',()=>{
        const res = utility.padLeadingZeros('192.168.2.101',1);
        expect(res).toBeDefined();
    })

    it('getHostPartFromIp',()=>{
        const res = utility.getHostPartFromIp('192.168.2.101');
        expect(res).toBeDefined();
    })

    it('validateAddressLength',()=>{
        const res = utility.validateAddressLength('192.168.2.101');
        expect(res).toBeTruthy();
    })

    it('validateFromAddressRange',()=>{
        const res = utility.validateFromAddressRange('192.168.2.101','192.168.2.104')
        expect(res).toBeFalsy();
    })

    it('validateFiled',()=>{
        const formcontrol = {
            get(test){
                return {touched: true}
            },
            controls : {
                test : {
                    valid : true
                }
            }
        }
        const res = utility.validateField(formcontrol,'test');
        expect(res).toBeTruthy();
    })

    it('validateAddress',()=>{
        const res = utility.validateAddress('192.168.2.101','192.168.2.104');
        expect(res).toBeFalse();
    })

    it('isFormFieldHasError',()=>{
        const formControl = {
            controls : {
                test : {
                    valid : false
                }
            },
            get(test){
                return {touched: true,errors:{
                    invalid : false
                }}
            },
        }
        const res = utility.isFormFieldHasError(formControl,'test','invalid')
    })

    it('sortEditorHTMLNodesCoordinate',()=>{
        const area = [
            {
              name: 'Area1',
              id: '12345',
              x: 10,
              y: 20,
              clientInterfaceIds: [],
              serverInterfaceIds: [],
              nodeIds: [],
              connectionIds: []
            }
          ]
        const res = utility.sortEditorHTMLNodesCoordinate(area);
        expect(res).toEqual([20])
    })

    it('getSessionIDFromCookie',()=>{
        Object.defineProperty(window.document, 'cookie', {
            writable: true,
            value: 'myCookie=omnomnom',
          });
        const res = utility.getSessionIDFromCookie();

    })


    it('validateDragDropAccess',()=>{
        const result = utility.validateDragDropAccess(ProjectState.OFFLINE,AccessType.WRITE);
        expect(result).toBeTruthy();

        const result1 = utility.validateDragDropAccess(ProjectState.ONLINE,AccessType.WRITE);
        expect(result1).toBeFalsy();
    })

    it('isExposedConnectionPresentInServerInterface', () => {
        const areaDetails = dataService.getArea('');
        const _result = utility.isExposedConnectionPresentInServerInterface(areaDetails, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
        expect(_result).toBeTrue();
    })
})