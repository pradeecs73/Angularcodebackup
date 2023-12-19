import { TestBed, waitForAsync } from "@angular/core/testing";
import { FacadeMockService } from "src/app/livelink-editor/services/facade.mock.service";
import { FacadeService } from "src/app/livelink-editor/services/facade.service";
import { HTMLNode, HTMLNodeService } from "./htmlNode";
import { FillingNode, FillingArea } from "src/app/store/filling-line/filling-line.reducer";
import { NodeAnchor } from "./node-anchor";
import { BaseType } from "d3";
import { ConnectorType, FillingLineNodeType, Numeric } from "src/app/enum/enum";
import { fillingAreaMockData } from "mockData/mockFillingLineData";
import { OPCNode } from "./opcnode";

fdescribe('Html node', () => {
    let facadeMockService;
    let htmlNode;
    class dummyHtmlNode extends HTMLNode {
        updateFillingLineData(fillingNodeData: FillingNode | FillingArea | Partial<FillingNode | FillingArea>) {
            throw new Error("Method not implemented.");
        }


    }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
              { provide: FacadeService, useValue: facadeMockService }
            ]
          });
          facadeMockService=new FacadeMockService();
          facadeMockService = new FacadeMockService();
          htmlNode = new dummyHtmlNode(facadeMockService);
    }));

    it('expect html node to be created',()=>{
        expect(htmlNode).toBeDefined();
    });

    it('updateAnchors',()=>{
        htmlNode.inputs = [{
            deviceId: 'device12345',
            update :()=>{}
          } as unknown as NodeAnchor];
        htmlNode.outputs = [{
            deviceId: 'device12345',
            update :()=>{}
          } as unknown as NodeAnchor];

        spyOn(htmlNode.inputs[0], 'update');
        spyOn(htmlNode.outputs[0], 'update');
        htmlNode.updateAnchors();
       expect(htmlNode.inputs).toBeDefined();
       expect(htmlNode.inputs[0].update).toHaveBeenCalled();
       expect(htmlNode.outputs[0].update).toHaveBeenCalled();
    })

    it('testCollision with e1 and e2 defined',()=>{
        facadeMockService.commonService.selectedZoomPercent =Numeric.TWENTYFIVE;
        spyOn(htmlNode,'getBoundingBox').and.returnValue({e1: {left:10,right:20,top:10,bottom:10},e2:{left:10,right:20,top:10,bottom:10}})
        const res  = htmlNode.testCollision({} as unknown as BaseType,{} as unknown as BaseType);
        expect(htmlNode.getBoundingBox).toHaveBeenCalled();
        expect(htmlNode.testCollision).toBeDefined();
        expect(res).toBeTrue();

        facadeMockService.commonService.selectedZoomPercent =Numeric.FIFTY;
        const res1 = htmlNode.testCollision({} as unknown as BaseType,{} as unknown as BaseType);
        expect(htmlNode.testCollision).toBeDefined();
        expect(res1).toBeTrue();

        facadeMockService.commonService.selectedZoomPercent =Numeric.SEVEN;
        const res2 = htmlNode.testCollision({} as unknown as BaseType,{} as unknown as BaseType);
        expect(htmlNode.testCollision).toBeDefined();
        expect(res2).toBeTrue();
    })

    it('testCollission with e1 undefined',()=>{
        facadeMockService.commonService.selectedZoomPercent =Numeric.TWENTYFIVE;
        spyOn(htmlNode,'getBoundingBox').and.returnValue({e1: undefined,e2:{left:10,right:20,top:10,bottom:10}})
        const res  = htmlNode.testCollision({} as unknown as BaseType,{} as unknown as BaseType);
        expect(htmlNode.getBoundingBox).toHaveBeenCalled();
        expect(htmlNode.testCollision).toBeDefined();
        expect(res).toBeFalse();
    })

    it('getProximity for e1 greater than e2',()=>{
        spyOn(htmlNode,'getBoundingBox').and.returnValue({e1: {left:10,right:20,top:10,bottom:10},e2:{left:8,right:20,top:8,bottom:10}});
        const res = htmlNode.getProximity({} as unknown as BaseType,{} as unknown as BaseType)
        expect(htmlNode.getBoundingBox).toHaveBeenCalled();
        expect(htmlNode.getProximity).toBeDefined();
        expect(res).toEqual({top: undefined, left: 2});
    })

    it('getProximity for e2 greater than e1',()=>{
        spyOn(htmlNode,'getBoundingBox').and.returnValue({e2: {left:10,right:20,top:13,bottom:10},e1:{left:8,right:20,top:8,bottom:10}});
        const res = htmlNode.getProximity({} as unknown as BaseType,{} as unknown as BaseType)
        expect(htmlNode.getBoundingBox).toHaveBeenCalled();
        expect(htmlNode.getProximity).toBeDefined();
        expect(res).toEqual({top: -5, left: undefined});
    })

    it('restrictionValidation',()=>{
        spyOn(htmlNode,'setZoomScalerFacorForLowZoom');
        htmlNode.restrictionValidation(10,10,10);
        expect(htmlNode.restrictIsValid).toBeFalsy();
        htmlNode.restrictionValidation(10,10,0.75);
        expect(htmlNode.restrictIsValid).toBeTruthy();
        htmlNode.restrictionValidation(10,10,undefined);
        expect(htmlNode.restrictIsValid).toBeFalsy();
    })

    it('setZoomScalerFacorForLowZoom',()=>{
        htmlNode.x = 3;
        htmlNode.setZoomScalerFacorForLowZoom(-1,10);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeTruthy();

        htmlNode.x = 5;
        htmlNode.y = 20;
        htmlNode.setZoomScalerFacorForLowZoom(1,0);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeTruthy();

        htmlNode.x = 4000;
        htmlNode.y = 40;
        htmlNode.setZoomScalerFacorForLowZoom(1,0);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeTruthy();

        htmlNode.x = 10;
        htmlNode.y = 30;
        htmlNode.setZoomScalerFacorForLowZoom(1,0);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeFalsy();
    })

    it('setZoomScalerFacorForHighZoom',()=>{
        htmlNode.x = 3;
        htmlNode.setZoomScalerFacorForHighZoom(-1,10);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeTruthy();

        htmlNode.x = 2000;
        htmlNode.y = 20;
        htmlNode.setZoomScalerFacorForHighZoom(1,0);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeTruthy();

        htmlNode.x = 4000;
        htmlNode.y = 5;
        htmlNode.setZoomScalerFacorForHighZoom(1,0);
        expect(htmlNode.setZoomScalerFacorForLowZoom).toBeDefined();
        expect(htmlNode.restrictIsValid).toBeTruthy();
    })

    it('getAllNodeConnectors',()=>{
        htmlNode.inputs = [{
            deviceId: 'device12345',
            connectors :[],
            update :()=>{}
          } as unknown as NodeAnchor];
        htmlNode.outputs = [{
            deviceId: 'device12345',
            connectors :[],
            update :()=>{}
          } as unknown as NodeAnchor]
        const connectors=htmlNode.getAllNodeConnectors();
        expect(htmlNode.getAllNodeConnectors()).toBeDefined();
        expect(connectors).not.toBe(undefined);
        expect(connectors).toBeInstanceOf(Array);
    })

    it('getAllSubConnectors',()=>{
        htmlNode.inputs = [{
            deviceId: 'device12345',
            connectors :[{type:ConnectorType.SUBCONNECTOR}],
            update :()=>{}
          } as unknown as NodeAnchor];
        htmlNode.outputs = [{
            deviceId: 'device12345',
            connectors :[{type:ConnectorType.SUBCONNECTOR}],
            update :()=>{}
          } as unknown as NodeAnchor];

        const subConnectors=htmlNode.getAllSubConnectors();
        expect(htmlNode.getAllSubConnectors()).toBeDefined();
        expect(subConnectors).not.toBe(undefined);
        expect(subConnectors).toBeInstanceOf(Array);
    })

    it('getBoundingBox',()=>{
        htmlNode.getBoundingBox(document.createElement('div') as unknown as BaseType,document.createElement('div') as unknown as BaseType);
    })

});

fdescribe('html Node service', () => {
    let htmlNodeService;
    let facadeMockService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: FacadeService, useValue: facadeMockService }
        ],
      });
      facadeMockService=new FacadeMockService();
      htmlNodeService = new HTMLNodeService(facadeMockService);
    }));
    it('Html node service to be created', () => {
        expect(htmlNodeService).toBeTruthy();
    });

    it('addAnchors',()=>{
        const node = {
            serverInterfaces : fillingAreaMockData.serverInterfaces,
            clientInterfaces : fillingAreaMockData.clientInterfaces,
            element : document.createElement('doc')
        }
        const anchors=htmlNodeService.addAnchors(node,true);
        expect(htmlNodeService.addAnchors(node,true)).toBeDefined();
        expect(anchors).not.toBe(undefined);
        expect(anchors).toBeInstanceOf(Array);
    })

    it('updateAreaElement',()=>{
        spyOn(htmlNodeService,'onDragToFillingLine');
        spyOn(htmlNodeService,'onClickHtmlNode');
        htmlNodeService.updateAreaElement({} as unknown as HTMLNode);
        expect(htmlNodeService.onDragToFillingLine).toHaveBeenCalled();
        expect(htmlNodeService.onClickHtmlNode).toHaveBeenCalled();
    })

    it('handleFillingLineOnMove',()=>{

        const event1 = {
            target : {
                parentNode : {
                    parentNode : {} as unknown as Element
                }
            },
            dx : 10,
            dy : 10,
            currentTarget : {
                classList : { contains : ()=>{return true}},
                getAttribute: () => {return null},
                setAttribute : () => {},
                style : {
                    webkitTransform : '',
                    transform: ''
                }
            } as unknown as Element
        }
        htmlNodeService.handleFillingLineOnMove(event1,{restrictionValidation:()=>{return true}} as unknown as HTMLNode);
        expect(event1).toBeDefined();
        expect(htmlNodeService.handleFillingLineOnMove).toBeDefined();

        const event = {
            target : {
                parentNode : {
                    parentNode : {} as unknown as Element
                }
            },
            dx : 10,
            dy : 10,
            currentTarget : {
                classList : { contains : ()=>{return false}},
                getAttribute: () => {return null},
                setAttribute : () => {},
                style : {
                    webkitTransform : '',
                    transform: ''
                }
            } as unknown as Element
        }
        htmlNodeService.handleFillingLineOnMove(event,{restrictionValidation:()=>{return false}} as unknown as HTMLNode);
        expect(event1).toBeDefined();
        expect(htmlNodeService.handleFillingLineOnMove).toBeDefined();

        htmlNodeService.handleFillingLineOnMove(event,{restrictionValidation:()=>{return true}} as unknown as HTMLNode);
        expect(event1).toBeDefined();
        expect(htmlNodeService.handleFillingLineOnMove).toBeDefined();
    })

    it('handleFillingLineOnEnd',()=>{
        const event = {
            currentTarget: {
                classList : {
                    contains : () => { return true}
                }
            },
            target : {
                classList : {
                    remove : () =>{}
                },
                remove : () =>{}
            }
        }
        facadeMockService.editorService.liveLinkEditor.editorNodes = [{type:FillingLineNodeType.NODE,deviceId:'12345'}] as unknown as Array<HTMLNode>;
        htmlNodeService.handleFillingLineOnEnd(event,{updateAnchors:()=>{}} as unknown as HTMLNode);
        spyOn(event.target,'remove');
        event.target.remove();
        expect(facadeMockService.alignConnectionService.alignConnections).toHaveBeenCalled();
        expect(htmlNodeService.handleFillingLineOnEnd).toBeDefined();
        expect(event.target.remove).toHaveBeenCalled();
    })

    it('handleNonSelectedNodeMove',()=>{
        facadeMockService.commonService.currentZoomScaleFactor = 0.75;
        let event = {
            target : {
                parentNode: {
                    parentNode : document.createElement('doc') as unknown as BaseType
                }
            },
            dx: 10,
            dy : 10,
            currentTarget : {
                farthestViewportElement: {
                    parentElement: {
                        children : ['a']
                    }
                }
            }
        }
        const node = {
            x : 10,
            y:  10,
            updateAnchors : ()=>{}
        }
        htmlNodeService.handleNonSelectedNodeMove(event,node);
        expect(event).toBeDefined();
        expect(htmlNodeService.handleNonSelectedNodeMove).toBeDefined();
        expect(node.updateAnchors).toBeDefined();

        facadeMockService.commonService.currentZoomScaleFactor = 2;
        htmlNodeService.handleNonSelectedNodeMove(event,node);
        expect(event).toBeDefined();
        expect(htmlNodeService.handleNonSelectedNodeMove).toBeDefined();
        expect(node.updateAnchors).toBeDefined();
    })

    it('dragNodeToFillingLine',()=>{
        Object.getOwnPropertyDescriptor(facadeMockService.commonService,'setMousePosition').value.and.returnValue({x: 10, y: 10})
        const event = {
            interaction : {
                start: ()=>{},
                pointerIsDown: true,
                interacting : ()=>{ return false}
            },
            target : {
                style : {
                    cursor : 'MOVE'
                }
            },
            currentTarget : {
                parentElement : {
                    children : [{children : [{
                        classList : {
                            contains : () => {return true}
                        }
                    }]}]
                },
                farthestViewportElement: {
                    querySelectorAll : () => {return ['a']}
                }
            }
        }
        htmlNodeService.dragNodeToFillingLine(event)
        expect(event).toBeDefined();
        expect(htmlNodeService.dragNodeToFillingLine).toBeDefined();
    })

    it('checkNodeProximity',()=>{
        htmlNodeService.movingNode = document.createElement('doc') as unknown as BaseType;
        facadeMockService.editorService.liveLinkEditor.editorNodes = [{type:FillingLineNodeType.NODE,deviceId:'12345',id:'test',testCollision : ()=>{return true}}] as unknown as Array<HTMLNode>;
        htmlNodeService.checkNodeProximity({type:FillingLineNodeType.NODE,deviceId:'12345',id:'test123',updateAnchors:()=>{}} as unknown as OPCNode);
        expect(facadeMockService.editorService.liveLinkEditor.editorNodes).toBeDefined();
        expect(htmlNodeService.checkNodeProximity).toBeDefined();
    })

    it('selectNode',()=>{
        htmlNodeService.selectNode({id:'test',updateFillingLineData:()=>{}} as unknown as HTMLNode)
        expect(facadeMockService.editorService.deselectAllNodes).toHaveBeenCalled();
    })

    it('deselectMultipleNodes',()=>{
        const currentElement = {
            parentElement : {
                querySelectorAll:()=>{ return [{
                    classList:{remove :()=>{}},
                    querySelector: () => {return {classList: {remove :()=>{}}}}
                }]}
            }
        }
        htmlNodeService.deselectMultipleNodes(currentElement);
       expect(currentElement).toBeDefined();
       expect(facadeMockService.editorService.selectedNode).toBeInstanceOf(Function);
    })

  });

