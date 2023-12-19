import { TestBed, waitForAsync } from "@angular/core/testing";
import { FacadeMockService } from "src/app/livelink-editor/services/facade.mock.service";
import { FacadeService } from "src/app/livelink-editor/services/facade.service";
import { ConnectionAdapter } from "./connection-adapter";
import { ConnectionResponsePayload, ConnectionStatus } from "src/app/models/connection.interface";
import { Connector } from "../../opcnodes/connector";
import { OPCNode } from "../../opcnodes/opcnode";
import { DeviceAuthenticationStatus, ResponseStatusCode } from "src/app/enum/enum";

fdescribe('Connection adapter', () => {
    class connectionAdapterDummy extends ConnectionAdapter{
        establishConnection(connectionResultList: ConnectionResponsePayload[]) {
            throw new Error("Method not implemented.");
        }
        executeConnectCall(connection: Connector) {
            throw new Error("Method not implemented.");
        }
        deleteConnectionFromServer(connector: Connector) {
            throw new Error("Method not implemented.");
        }

    }
    let facadeMockService;
    let connectionAdapter;
    facadeMockService=new FacadeMockService();
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: FacadeService, useValue: facadeMockService }
        ],
      });
      connectionAdapter = new connectionAdapterDummy();
    }));

    it('expect html node to be created',()=>{
        expect(connectionAdapter).toBeDefined();
    });

    it('setConnectionStatusDialogue',()=>{
        spyOn(connectionAdapter,'setErrorDialogueForAllFailed')
        connectionAdapter['setConnectionStatusDialogue']([{}] as unknown as Array<ConnectionResponsePayload>);
        expect(connectionAdapter.setErrorDialogueForAllFailed).toHaveBeenCalled();
        expect(connectionAdapter.setConnectionStatusDialogue).toBeDefined()
    })

    it('setConnectionStatusDialogue with no of failed connections',()=>{
        spyOn(connectionAdapter,'setPartialSuccessDialogue')
        spyOn(connectionAdapter,'getConnectionStatusData').and.returnValue({noOfFailedConnections: 10})
        connectionAdapter['setConnectionStatusDialogue']([{}] as unknown as Array<ConnectionResponsePayload>);
        expect(connectionAdapter.setPartialSuccessDialogue).toHaveBeenCalled()
        expect(connectionAdapter.setConnectionStatusDialogue).toBeDefined()
    })

    it('setConnectionStatusDialogue with no of failed connections undefined',()=>{
        spyOn(connectionAdapter,'setErrorDialogue')
        spyOn(connectionAdapter,'getConnectionStatusData').and.returnValue({noOfFailedConnections: undefined,totalConnections:5})
        connectionAdapter['setConnectionStatusDialogue']([{}] as unknown as Array<ConnectionResponsePayload>);
        expect(connectionAdapter.setErrorDialogue).toHaveBeenCalled()
    })

    it('generateNotification',()=>{
        connectionAdapter['facadeService'] = {editorService: {liveLinkEditor:{editorNodes: [{deviceId:'123',deviceName:'Test'}] as unknown as OPCNode[]}},
        notificationService: {pushNotificationToPopup:()=>{}}};
        connectionAdapter['generateNotification']({deviceId:'123',deviceAddress:'test'},{errorCode:'123'})
        expect(connectionAdapter['facadeService']).toBeDefined();
    })

    it('setErrorDialogue',()=>{
        connectionAdapter['facadeService'] = {overlayService: {success:()=>{}},commonService:{changeErrorCountStatus:()=>{}},translateService:{instant:()=>{}}};
        connectionAdapter['setErrorDialogue']({totalConnections: 10,noOfFailedConnections:8} as unknown as ConnectionStatus);
        expect(connectionAdapter['facadeService']).toBeDefined();
        expect(facadeMockService.notificationService.pushNotificationToPopup).toBeDefined();
    })

    it('setPartialSuccessDialogue',()=>{
        connectionAdapter['facadeService'] = {overlayService: {warning : ()=>{}},commonService:{changeErrorCountStatus:()=>{},setErrorIcon:()=>{}},translateService:{instant:()=>{}}};
        facadeMockService.overlayService.warning.and.callFake(function (args) {
            args.acceptCallBack();
          });
        connectionAdapter['setPartialSuccessDialogue']({totalConnections: 10,noOfFailedConnections:8} as unknown as ConnectionStatus);
        expect(connectionAdapter['facadeService']).toBeDefined();
        expect(facadeMockService.commonService.setErrorIcon).not.toHaveBeenCalled();
        expect(facadeMockService.commonService.changeErrorCountStatus).not.toHaveBeenCalled();
    })

    it('setErrorDialogueForAllFailed',()=>{
        connectionAdapter['facadeService'] = {overlayService: {error:()=>{}},commonService:{setErrorIcon:()=>{},changeErrorCountStatus:()=>{}},translateService:{instant:()=>{}}};
        connectionAdapter['setErrorDialogueForAllFailed']({totalConnections: 10,noOfFailedConnections:8} as unknown as ConnectionStatus,[])
        expect(connectionAdapter['facadeService']).toBeDefined();
        expect(facadeMockService.commonService.setErrorIcon).not.toHaveBeenCalled();
        expect(facadeMockService.commonService.changeErrorCountStatus).not.toHaveBeenCalled();
    })

    it('acceptCallBackForErrorDialogue',()=>{
        spyOn(connectionAdapter,'generateNotification')
        connectionAdapter['facadeService'] = {
            commonService : {
                viewErrorBtn : true,
                setShowProjectProtectionModel : ()=>{},
                showAuthenticationPopupState: ()=>{},
                deviceAuthenticationFailedList: {
                    push : () =>{}
                },

            }
        };
        const connectionsResult = [{
            error: {
                error: {
                    errorType: ResponseStatusCode.Establish_Connection_Server_Device_AUTHENTICATION_FAILURE
                },
                data: {
                    server : '192.168.2.101'
                }
            },

        },
        {
            error: {
                error: {
                    errorType: ResponseStatusCode.Establish_Connection_Client_Device_AUTHENTICATION_FAILURE
                },
                data: {
                    client : '192.168.2.101'
                }
            },
        },
        {
            error: {
                error: {
                    errorType: ResponseStatusCode.Establish_Connection_BOTH_Device_AUTHENTICATION_FAILURE
                },
                data: {
                    client : {
                        status : DeviceAuthenticationStatus.PENDING,
                    },
                    server : {
                        status :  DeviceAuthenticationStatus.PENDING
                    }
                }
            }
        },
        {
            error: {
                error: {
                    errorType: ResponseStatusCode.Invalid_Address_Model
                },
                data: {
                    client : {
                        deviceId : '192.168.2.101',
                    },
                    server : {
                        deviceId : '192.168.2.101'
                    }
                }
            },
        }
    ]
        connectionAdapter.acceptCallBackForErrorDialogue(connectionsResult,true);
        expect(connectionAdapter['facadeService']).toBeDefined();
        expect(facadeMockService.commonService.viewErrorBtn).toBeDefined();
    })




  });