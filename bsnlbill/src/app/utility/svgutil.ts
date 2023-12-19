/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
* Import statements
*
*/
import { ConnectorArributes, Numeric } from '../enum/enum';
import { ClientInterface, OpcInterface } from '../models/targetmodel.interface';
import { FillingArea, FillingNode } from '../store/filling-line/filling-line.reducer';
import { ANCHORCIRCLEID } from '../utility/constant';

/**
* @description get node props
* @param node
*
*/
const getNodeProps = (node :FillingNode) => {
    let rhsLength = node.clientInterfaces.length;
    let maskedAddress;
    /*
    * Node doesn't have client interfaces
    *
    */
    if (!node.clientInterfaces) {
        rhsLength = 0;
    }
    /*
    *init = server
    *
    */
    let lhsLength = node.serverInterfaces.length;
    /*
    * Node doesn't have server interfaces
    *
    */
    if (!node.serverInterfaces) {
        lhsLength = 0;
    }
    let maxRow = lhsLength;
    /*
    * When right hand side length is greater than left hand side length
    *
    */
    if(rhsLength > lhsLength)
    {
        maxRow = rhsLength;
    }
    /*
    *box size + padding
    *
    */
    const contentBoxSize = (Numeric.FIFTY);
    let selectClass = 'cls-2';
    /*
    * Node is selected
    *
    */
    if (node.selected) {
        selectClass = 'cls-2-selected';
    }
    let parentRect = (Numeric.TWOTWENTY + (maxRow - Numeric.TWO) * contentBoxSize);
    /*
    * max row is less than 1 for parent rect
    *
    */
    if(maxRow <= 1)
    {
        parentRect = Numeric.TWOTWENTY;
    }
    let footerTranslate = (Numeric.THREEEIGHTYFIVE + (maxRow - Numeric.TWO) * contentBoxSize);
    /*
    * max row is less than 1 for footer translate
    *
    */
    if(maxRow <= 1)
    {
        footerTranslate = Numeric.THREEEIGHTYFIVE;
    }
    /*
    * Node address inclues 'opc.tcp://0.0.0'
    *
    */
    if(node.address.includes('opc.tcp://0.0.0')){
        maskedAddress = 'opc.tcp://0.0.0:0000';
    }
    return {
        rhsLength, lhsLength, maxRow, selectClass, parentRect, footerTranslate, maskedAddress
    };
};
/**
* @description Svg for server interface
* @param inf
* @param boxY
*/
const serverInterface = (inf,boxY) =>{
    return  `
    <g transform='translate(219 ${boxY})' class='right-inf' id='box-${inf.id}'>
       <path id='interface-${inf.id}' transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
        <text transform='translate(432 272)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.name, Numeric.EIGHTEEN)}</tspan>
        </text>
        <text transform='translate(432 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.type, Numeric.FIFTEEN)}
            <title>${inf.type}</title>
            </tspan>
        </text>
        <text transform='translate(564 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>V1.0</tspan>
        </text>
        <g transform='translate(408 269)'>
            <path d='M7-14H5v.05A2.5,2.5,0,0,0,3.05-12H1v1H3.05A2.5,2.5,0,0,0,5-9.05V-9H7v2H8v5H7V-7H5v.05A2.5
            ,2.5,0,0,0,3.05-5H1v1H3.05A2.5,2.5,0,0,0,5-2.05V-2H7V0h6a2,2,0,0,0,1.995-1.851L15-2V-14a2,2,0,0,
            0-1.851-1.995L13-16H7v2H8v5H7ZM13-2H9V-14h4Z' transform='translate(15) rotate(180)' fill='#879baa' />
        </g>
        <g transform='translate(610 272)' id='${inf.id}' data-name='anchor' class='anchor' fill='#fff' stroke='#adbecb' stroke-width='2'>
            <circle id=${ANCHORCIRCLEID.SERVER_OUTER} class=${ConnectorArributes.OUTERCLS} cx='5.5' cy='5.5' r='5.5' stroke='none' />
            <circle id=${ANCHORCIRCLEID.SERVER_INNER} class=${ConnectorArributes.INNERCLS} cx='5.5' cy='5.5' r='4.5' fill='none' />
            <circle id='scrim' class='scrim' cx='5.5' cy='5.5' r='5.5' stroke='none' />
        </g>
    </g>
     `
}
/**
* @description Svg for client interface
* @param inf
* @param boxY
*/
const clientInterface = (inf,boxY) =>{
    return `
    <g id='box-${inf.id}' class='left-inf' transform='translate(0, ${boxY})'>
       <path id='interface-${inf.id}' transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
        <text transform='translate(432 272)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.name, Numeric.EIGHTEEN)}</tspan>
        </text>
        <text transform='translate(432 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.type, Numeric.FIFTEEN)}
            <title>${inf.type}</title>
            </tspan>
        </text>
        <text transform='translate(564 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>V1.0</tspan>
        </text>
        <g transform='translate(422 285) rotate(180)' class='left-inf-icon'>
            <path d='M7-14H5v.05A2.5,2.5,0,0,0,3.05-12H1v1H3.05A2.5,2.5,0,0,0,5-9.05V-9H7v2H8v5H7V-7H5v.05A2.5,2.5,0,0,0,
            3.05-5H1v1H3.05A2.5,2.5,0,0,0,5-2.05V-2H7V0h6a2,2,0,0,0,1.995-1.851L15-2V-14a2,2,0,0,
            0-1.851-1.995L13-16H7v2H8v5H7ZM13-2H9V-14h4Z' transform='translate(15) rotate(180)' fill='#879baa' />
        </g>
        <g id='${inf.id}' data-name='anchor' transform='translate(381 272)' class='anchor-2' fill='#fff' stroke='#adbecb' stroke-width='2'>
            <circle id=${ANCHORCIRCLEID.CLIENT_OUTER} class=${ConnectorArributes.OUTERCLS} cx='5.5' cy='5.5' r='5.5' stroke='none' />
            <circle  id=${ANCHORCIRCLEID.CLIENT_INNER} class=${ConnectorArributes.INNERCLS} cx='5.5' cy='5.5' r='4.5' fill='none' />
            <circle id='scrim' class='scrim' cx='5.5' cy='5.5' r='5.5' stroke='none' />
        </g>
    </g>
    `;
}
/**
* @description Node template for client interface
* @param dboxY
*
*/
const nodeTemplateClient = dboxY =>{
    return `
    <g class='item2 resp-dummy' data-name='item2'  transform='translate(0, ${dboxY})'>
       <path transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
    </g>`;
}
/**
* @description svg for html node
* @param node
*
*/
export function buildNode(node: FillingNode): string {
    /*
    * resp = client
    *
    */
    const { rhsLength, lhsLength, maxRow, selectClass, parentRect, footerTranslate, maskedAddress } = getNodeProps(node);
    return `
    <g id='Node' data-drag='diagram:diagram' data-drag-type='diagram' transform='translate(-386 -177)'>
        <g transform='translate(386 177)' id='parent-rect' fill='none' stroke='#adbecb' stroke-width='1'>
            <rect width='450' class='${selectClass}' height='${parentRect}' rx='3' stroke='none' />
            <rect x='0.5' y='0.5' width='449' height='${parentRect - 1}' rx='2.5' fill='none' />
        </g>
        <g  class='footer'>
            <text transform='translate(403 ${footerTranslate})' fill='#21292c' font-size='12' font-family='SiemensSans-Roman, Siemens Sans'>
                <tspan x='0' y='0'>${maskedAddress??node.address}</tspan>
            </text>
        </g>
        <g class='sub-header'>
            <text transform='translate(408 246)' fill='#21292c' font-size='14' font-family='SiemensSans-Bold, Siemens Sans' font-weight='700'>
                <tspan x='0' y='0'>Client interfaces</tspan>
            </text>
            <text transform='translate(626 247)' fill='#21292c' font-size='14' font-family='SiemensSans-Bold, Siemens Sans' font-weight='700'>
                <tspan x='0' y='0'>Server interfaces</tspan>
            </text>
        </g>
        ${(() => {
            let box = '';
            const noInitInf = lhsLength;
            let noDummies = (maxRow - noInitInf);
            if(maxRow <= 1 ){
                noDummies=(Numeric.TWO - noInitInf);
            }
            let boxY = 0;
            /*
            * if node has server interfaces
            *
            */
            if (node.serverInterfaces) {
                for (let index = 0; index < noInitInf; index++) {
                    const inf = node.serverInterfaces[index];
                    // 35 box size, 3 padding;
                    boxY = index * (Numeric.FIFTY);
                    box = box + serverInterface(inf,boxY);
                }
            }
            /*
            * if no of dummies is less than or equal to 0
            *
            */
            if (noDummies <= 0) {
                return box;
            }
            const lastInitInf = noInitInf * (Numeric.FIFTY);
            let dboxY = 0;
            for (let i = 0; i < noDummies; i++) {
                dboxY = lastInitInf + (i * (Numeric.FIFTY));
                box = box + nodeTemplateServer(dboxY) ;
            }

            return box;
        })()}

        ${(() => {
            let box = '';

            const noRespInf = rhsLength;
            let noDummies = (maxRow - noRespInf);
            /*
            * maxRow is less than or equal to 1
            *
            */
            if(maxRow <= 1 ){
                noDummies=(Numeric.TWO - noRespInf);
            }
            let boxY = 0;
            /*
            * if node has server interfaces
            *
            */
            if (node.clientInterfaces) {
                for (let index = 0; index < noRespInf; index++) {
                    const inf = node.clientInterfaces[index];
                    // 35 box size, 3 padding;
                    boxY = index * (Numeric.FIFTY);
                    box = box + clientInterface(inf,boxY);
                }
            }
            /*
            * if no of dummies is less than or equal to 0
            *
            */
            if (noDummies <= 0) {
                return box;
            }
            const lastRespInf = noRespInf * (Numeric.FIFTY);
            let dboxY = 0;
            for (let i = 0; i < noDummies; i++) {
                dboxY = lastRespInf + (i * (Numeric.FIFTY));
                box = box + nodeTemplateClient(dboxY);
            }
            return box;

        })()}

        <g class='Device-header' id='Device-header'>
            <g transform='translate(386 177)' class='header-box' fill='#f5f8fa' stroke='#adbecb' stroke-width='1'>
                <path d='M3,0H447a3,3,0,0,1,3,3V40a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V3A3,3,0,0,1,3,0Z' stroke='none' />
                <path d='M3,.5H447A2.5,2.5,0,0,1,449.5,3V39a.5.5,0,0,1-.5.5H1A.5.5,0,0,1,.5,39V3A2.5,2.5,0,0,1,3,.5Z' fill='none' />
            </g>
            <text transform='translate(430 202)' class='head-text' fill='#21292c' font-size='14' font-family='SiemensSans-Bold, Siemens Sans' font-weight='700'>
                <tspan x='0' y='0'>${node.name}</tspan>
            </text>
            <g transform='translate(400 187)' class='head-icon-div'>
                <g transform='translate(-0.467 -0.378)'>
                    <path class='head-icon'  fill='#21292c'
                    d='M13.714,12.29l4.16,4.16-4.16,4.16-4.16-4.16Zm0,1.588L11.142,16.45l2.571,2.572ZM6.707,
                    4.073l6.24,6.24-6.24,6.24-6.24-6.24Zm0,1.588L2.056,10.313l4.651,4.651ZM13.714.378l4.16,4.16L13.714,
                    8.7l-4.16-4.16Zm0,1.588L11.142,4.538,13.714,7.11Z'/>
                </g>
            </g>
            <text transform='translate(538 202)' class='head-sub-text' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
                <tspan x='0' y='0'>${ellipsisText(node.deviceName,Numeric.TWENTYFIVE)}<title>${node.deviceName}</title></tspan>
            </text>
            <image width='25' image='25' transform='translate(775,187)' class='hide head-state-icon-available' href='assets/icons/PlantObjectOnlineAvailable_24.svg'/>
            <image width='25' image='25' transform='translate(775,187)' class='hide head-state-icon-unavailable' href='assets/icons/PlantObjectNotReachableIncompatible_24.svg'/>
        </g>
    </g>
    `;
}
/**
   * Function to trim the given the text to a specified length
   * @param deviceName
   * @param stringLength 
   * @returns Name after truncating the string to specified length
   */
export function ellipsisText(deviceName: string, stringLength : number): string{
    let deviceNames = deviceName;
        if(deviceName && deviceName.length > stringLength){
            deviceNames =  `${deviceName.substring(0,stringLength)}...`
        }
    return deviceNames;
}
/**
* @description style for html node
*
*
*/
export function nodeStyles(): string {

    return `
    .cls-1 {
        filter: url(#AI_GaussianBlur_4);
    }

    .cls-18{
        fill: #fff;
    }
    .cls-2 {
        fill: #fff;
        stroke: #adbecbe5;
    }

    .cls-2-selected{
        fill: #fff;
        stroke: #0f789b;
    }
    .cls-15,
    .cls-16,
    .cls-3 {
        fill: none;
        stroke: #adbecb;
        stroke-miterlimit: 10;
    }

    .cls-16{
        fill: #fff;
    }

    .cls-3 {
        stroke-width: 1.48px;
    }

    .cls-4 {
        fill: #fff;
    }

    .cls-5 {
        font-size: 12px;
    }

    .cls-10,
    .cls-13,
    .cls-21,
    .cls-26,
    .cls-28,
    .cls-5,
    .cls-9 {
        fill: #231f20;
    }

    .cls-10,
    .cls-13,
    .cls-18,
    .cls-21,
    .cls-26,
    .cls-5,
    .cls-9 {
        font-family: SiemensSans-Roman, Siemens Sans;
    }

    .cls-6 {
        letter-spacing: -0.02em;
    }

    .cls-7 {
        letter-spacing: 0em;
    }

    .cls-8 {
        fill: #adbecb;
    }

    .cls-9 {
        font-size: 9px;
    }

    .cls-10 {
        font-size: 10px;
    }

    .cls-11 {
        letter-spacing: 0.02em;
    }

    .cls-12 {
        letter-spacing: 0em;
    }

    .cls-13 {
        font-size: 13px;
        letter-spacing: -0.03em;
        dominant-baseline: mathematical;
        cursor:pointer;
    }

    .cls-14 {
        letter-spacing: 0em;
    }

    .cls-16 {
        stroke-width: 0.64px;
    }

    .cls-17 {
        fill: #56606a;
    }

    .cls-18,
    .cls-21 {
        font-size: 14px;
    }

    .cls-19 {
        letter-spacing: 0.03em;
    }

    .cls-20 {
        fill: #788790;
    }

    .cls-22 {
        letter-spacing: -0.03em;
    }

    .cls-23 {
        letter-spacing: -0.01em;
    }

    .cls-24 {
        letter-spacing: 0em;
    }

    .cls-25 {
        letter-spacing: -0.02em;
    }

    .cls-26 {
        font-size: 18px;
    }

    .cls-27 {
        letter-spacing: -0.03em;
    }
    .hide{
        display:none;
    }
`;
}
/**
* @description style for anchor styles
*
*
*/
const anchorStyles = () => {
    return `
    .scrim {
        fill: transparent;
      }

      .outer-circle {
        fill: #004669;
      }

      .outer-circle-actual-con {
        stroke-width: 3px;
        stroke: #21292c;
      }

      .outer-actual-con-hover {
        stroke: #21292c;
      }

      .actual-connect-scrim {
        fill: #adbecb; !important;
      }

      .actual-scrim-selected {
        fill: #004669; !important;
      }

      .actual-inner-circle {
        stroke: #fff;
        stroke-width: 8px;
      }

      .actual-outer-circle {
        stroke-width: 8px;
        stroke: #004669;;
      }

      .actual-success-outer-circle {
        stroke-width: 7px;
        stroke: #009a49;
      }

      .actual-fail-outer-circle {
        stroke-width: 7px;
        stroke: #dc0031;
      }

      .online-outer-circle {
        stroke-width: 7px;
        stroke: #faa50A;;
      }

      .success-scrim {
        fill: #fff !important;
      }

      .outer-success-scrim {
        stroke-width: 3px;
        stroke: #009a49;;
      }

      .outer-online-success-scrim {
        stroke-width: 3px;
        stroke: #faa50A;
      }

      .outer-online-failure-scrim {
        stroke-width: 3px;
        stroke: #dc0031;;
      }

      .outer-no-connection{
        stroke: lightgray;
      }

      .no-connection{
        fill: transparent;
      }
      .outer-fail-circle {
        stroke-width: 3px;
        stroke: #dc0031;
      }
      .fail-scrim {
        fill: #fff !important;
      }
      .outer-online-error-scrim {
        stroke-width: 3px;
        stroke: #dc0031;
      }`;
};
/**
* @description style for node header
*
*
*/
const nodeHeaderStyles = () => {
    return `
    .cls-2-online {
        fill: white;
        stroke: #faa50A !important;
        stroke-width: 2.5px;
      }
      .node-header-online{
        fill: #faa50A;
        stroke: #eb780a; !important;
        stroke-width: 2.5px;
      }
      .node-header-offline{
        fill: #f5f8fa;
        stroke: #adbecb !important;
        // stroke-width: 2.5px;
      }
      .node-header-unavailable{
        fill: #9A8A7C;
        stroke: #73645A; !important;
        stroke-width: 2.5px;
      }
      .cls-2-unavailable {
        fill: white;
        stroke: #73645A; !important;
        stroke-width: 2.5px;
      }
      .head-offline{
        fill : #21292c;
      }
      .head-online {
        fill: #fff;
      }
    `;
};
/**
* @description style for connector
*
*
*/
export function connectorStyles(): string {
    return `${ anchorStyles() + nodeHeaderStyles() }
    *{
        cursor: default;
     }
    .connector {
        &:hover {
          cursor: pointer;
        }
      }
      .connector-handle {
        fill: #000;
      }
      .connector-path {
        stroke: #21292c;
        stroke-width: 2;
        fill: none;
      }
      .connector-path-fail {
        stroke: #dc0031;;
        stroke-width: 2;
        fill: none;
      }
      .connector-path-outline {
        stroke: #fff;
        stroke-width: 7;
        fill: none;
      }
      .connector-path-outline-no-connection{
        stroke-width: 0;
        fill: none;
      }
      .connector-path-proposed {
        stroke: #adbecb;
        stroke-width: 2;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
      .connector-path-outline-proposed {
        stroke: #fff;
        stroke-width: 7;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
      .connector-path-select-proposed {
        stroke: #adbecb;;
        stroke-width: 2px;
        fill: none;
      }
      .connector-path-proposed-hover {
        stroke: #3296b9;;
        stroke-width: 2;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
      .connector-path-outline-proposed-hover {
        stroke: #3296b9;;
        stroke-width: 2;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
      .connector-path-outline-select-proposed-hovered {
        stroke: #3296b9;;
        stroke-width: 2px;
        fill: none;
      }
      .connector-path-select-proposed-hovered {
        stroke: #3296b9;;
        stroke-width: 2px;
        fill: none;
      }
      //row select of proposed
      .connector-path-row-select {
        stroke: #004669;
        stroke-width: 2;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
      .connector-path-select-proposed-row-select {
        stroke: #004669;
        stroke-width: 2px;
        fill: none;
      }
      .connect-path-success {
        stroke: #009a49;
        stroke-width: 2;
        fill: none;
      }
      .connect-path-online{
        stroke: #faa50A;;
        stroke-width: 2;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
      .connector-path-outline {
        stroke: #fff;
        stroke-width: 7;
        fill: none;
      }
      .connector-path-outline-no-connection{
        stroke-width: 0;
        fill: none;
      }
      .connecting-path-outline {
        stroke: #2387aa;
        stroke-width: 5;
        fill: none;
        stroke-dasharray: 10px;
        animation: line-anim 1s ease forwards infinite;
      }
      .connect-path-no-connection{
        stroke: transparent;
        fill: none;
      }
      .con-path-selected {
        stroke: #fff;
        stroke-width: 2;
        fill: none;
      }
      .con-path-outline-selected {
        stroke: #004669;
        stroke-width: 5px;
        fill: none;
      }
      .con-path-outline-success-selected {
        stroke: #009a49;
        stroke-width: 5px;
        fill: none;
      }
      .con-path-outline-fail-selected {
        stroke: #dc0031;
        stroke-width: 5px;
        fill: none;
      }
      .con-path-online-selected {
        stroke: #fff;
        stroke-width: 2;
        fill: none;
      }
      .con-path-outline-online-selected {
        stroke: #faa50A;
        stroke-width: 5px;
        fill: none;
      }
      .connection-path-outline-select-proposed {
        stroke: #fff;
        stroke-width: 7px;
        fill: none;
      }
      .con-path-outline-online-error-selected {
        stroke: #dc0031;
        stroke-width: 5px;
        fill: none;
      }
      .connect-path-online-error{
        stroke: #dc0031;
        stroke-width: 2;
        fill: none;
        stroke-dasharray: 1, 6;
        stroke-linecap: round;
      }
    `;
}
/**
* @description get area props
* @param area
*
*/
const getAreaProps = (area: FillingArea)=> {
    let rhsLength = area.clientInterfaces.length;
    /*
    * area doesn't have client interfaces
    *
    */
    if (!area.clientInterfaces) {
        rhsLength = 0;
    }
    /*
    *init = server
    *
    */
    let lhsLength = area.serverInterfaces.length;
    if (!area.serverInterfaces) {
        lhsLength = 0;
    }
    let maxRow = lhsLength;
    /*
    * if right hand side length is greater than left hand side
    *
    */
    if(rhsLength > lhsLength)
    {
        maxRow = rhsLength;
    }
    /*
    *box size + padding
    *
    */
    const contentBoxSize = (Numeric.FIFTY);
    let selectClass = 'cls-2';
    /*
    * If area is selected
    *
    */
    if (area.selected) {
        selectClass = 'cls-2-selected';
    }
    let parentRect = (Numeric.TWOTWENTY + (maxRow - Numeric.TWO) * contentBoxSize);
    /*
    * max row is less than or equal to 1
    *
    */
    if(maxRow <= 1)
    {
        parentRect = Numeric.TWOTWENTY;
    }
    return {
        rhsLength, lhsLength, maxRow, selectClass, parentRect
    };
};
/**
* @description Svg for area server interface
* @param boxY
* @param inf
*/
const areaServerInterfaces = (boxY,inf) =>{
    return  `
    <g transform='translate(219 ${boxY})' class='right-inf' id='box-${inf.id}'>
       <path id='interface-${inf.id}' transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
        <text transform='translate(432 272)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.name, Numeric.EIGHTEEN)}</tspan>
        </text>
        <text transform='translate(432 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.type, Numeric.FIFTEEN)}
            <title>${inf.type}</title>
            </tspan>
        </text>
        <text transform='translate(564 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>V1.0</tspan>
        </text>
        <g transform='translate(408 269)'>
            <path  transform='translate(15) rotate(180)' fill='#879baa'
            d='M7-14H5v.05A2.5,2.5,0,0,0,3.05-12H1v1H3.05A2.5,2.5,0,0,0,5-9.05V-9H7v2H8v5H7V-7H5v.05A2.5,
            2.5,0,0,0,3.05-5H1v1H3.05A2.5,2.5,0,0,0,5-2.05V-2H7V0h6a2,2,0,0,0,1.995-1.851L15-2V-14a2,2,0,
            0,0-1.851-1.995L13-16H7v2H8v5H7ZM13-2H9V-14h4Z'/>
        </g>
        <g transform='translate(610 272)' id='${inf.id}' data-name='anchor' class='anchor' fill='#fff' stroke='#adbecb' stroke-width='2'>
            <circle id=${ANCHORCIRCLEID.SERVER_OUTER} class=${ConnectorArributes.OUTERCLS} cx='5.5' cy='5.5' r='5.5' stroke='none' />
            <circle id=${ANCHORCIRCLEID.SERVER_INNER} class=${ConnectorArributes.INNERCLS} cx='5.5' cy='5.5' r='4.5' fill='none' />
            <circle id='scrim' class='scrim' cx='5.5' cy='5.5' r='5.5' stroke='none' />
        </g>
    </g>`;
}
/**
* @description template for area client interface
* @param dboxY
*
*/
const areaClientInterfaceTemplate = dboxY =>{
    return   `<g class='item2 resp-dummy' data-name='item2'  transform='translate(0, ${dboxY})'>
       <path transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
    </g>`;
}
/**
* @description svg for area client interface
* @param boxY
* @param inf
*/
const areaClientInterfaces = (boxY,inf) =>{
    return  `
    <g id='box-${inf.id}' class='left-inf' transform='translate(0, ${boxY})'>
       <path id='interface-${inf.id}' transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
        <text transform='translate(432 272)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.name, Numeric.EIGHTEEN)}</tspan>
        </text>
        <text transform='translate(432 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>${trimText(inf.type, Numeric.FIFTEEN)}
            <title>${inf.type}</title>
            </tspan>
        </text>
        <text transform='translate(564 292)' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>V1.0</tspan>
        </text>
        <g transform='translate(422 285) rotate(180)' class='left-inf-icon'>
            <path  transform='translate(15) rotate(180)' fill='#879baa'
            d='M7-14H5v.05A2.5,2.5,0,0,0,3.05-12H1v1H3.05A2.5,2.5,0,0,0,5-9.05V-9H7v2H8v5H7V-7H5v.05A2.5,
            2.5,0,0,0,3.05-5H1v1H3.05A2.5,2.5,0,0,0,5-2.05V-2H7V0h6a2,2,0,0,0,1.995-1.851L15-2V-14a2,2,0,
            0,0-1.851-1.995L13-16H7v2H8v5H7ZM13-2H9V-14h4Z'/>
        </g>
        <g id='${inf.id}' data-name='anchor' transform='translate(381 272)' class='anchor-2' fill='#fff' stroke='#adbecb' stroke-width='2'>
            <circle id=${ANCHORCIRCLEID.CLIENT_OUTER} class=${ConnectorArributes.OUTERCLS} cx='5.5' cy='5.5' r='5.5' stroke='none' />
            <circle  id=${ANCHORCIRCLEID.CLIENT_INNER} class=${ConnectorArributes.INNERCLS} cx='5.5' cy='5.5' r='4.5' fill='none' />
            <circle id='scrim' class='scrim' cx='5.5' cy='5.5' r='5.5' stroke='none' />
        </g>
    </g>
    `;
}

/**
* @description Node template for server interface
* @param dboxY
*
*/
const nodeTemplateServer = dboxY =>
    `<g class='item2 init-dummy' transform='translate(219, ${dboxY})'>
       <path transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
    </g>`;

/**
* @description svg for area
* @param area
*
*/
export function buildArea(area: FillingArea): string {
    const { lhsLength, maxRow, parentRect, rhsLength, selectClass } = getAreaProps(area);
    return `
    <g id='Node' data-drag='diagram:diagram' data-drag-type='diagram' transform='translate(-386 -177)'>
        <g transform='translate(386 177)' id='parent-rect' fill='none' stroke='#adbecb' stroke-width='1'>
            <rect width='450' class='${selectClass}' height='${parentRect}' rx='3' stroke='none' />
            <rect x='0.5' y='0.5' width='449' height='${parentRect - 1}' rx='2.5' fill='none' />
        </g>
        <g class='sub-header'>
            <text transform='translate(408 246)' fill='#21292c' font-size='14' font-family='SiemensSans-Bold, Siemens Sans' font-weight='700'>
                <tspan x='0' y='0'>Client interfaces</tspan>
            </text>
            <text transform='translate(626 247)' fill='#21292c' font-size='14' font-family='SiemensSans-Bold, Siemens Sans' font-weight='700'>
                <tspan x='0' y='0'>Server interfaces</tspan>
            </text>
        </g>
        ${(() => {
            let box = '';
            const noInitInf = lhsLength;
            let noDummies = (maxRow - noInitInf);
            if(maxRow <= 1 ){
                noDummies=(Numeric.TWO - noInitInf);
            }
            let boxY = 0;
            /*
            * If area is has server interfaces
            *
            */
            if (area.serverInterfaces) {
                for (let index = 0; index < noInitInf; index++) {
                    const inf = area.serverInterfaces[index];
                    // 35 box size, 3 padding;
                    boxY = index * (Numeric.FIFTY);
                    box = box +areaServerInterfaces(boxY,inf);
                }
            }
            /*
            * If dummies is less than or equal to 0
            *
            */
            if (noDummies <= 0) {
                return box;
            }
            const lastInitInf = noInitInf * (Numeric.FIFTY);
            let dboxY = 0;
            for (let i = 0; i < noDummies; i++) {
                dboxY = lastInitInf + (i * (Numeric.FIFTY));
                box = box  + nodeTemplateServer(dboxY)
            }

            return box;
        })()}

        ${(() => {
            let box = '';

            const noRespInf = rhsLength;
            let noDummies = (maxRow - noRespInf);
            if(maxRow <= 1 ){
                noDummies=(Numeric.TWO - noRespInf);
            }
            let boxY = 0;
            /*
            * If area is has client interfaces
            *
            */
            if (area.clientInterfaces) {
                for (let index = 0; index < noRespInf; index++) {
                    const inf = area.clientInterfaces[index];
                    // 35 box size, 3 padding;
                    boxY = index * (Numeric.FIFTY);
                    box = box +areaClientInterfaces(boxY,inf) ;
                }
            }
            /*
            * If dummies is less than or equal to 0
            *
            */
            if (noDummies <= 0) {
                return box;
            }
            const lastRespInf = noRespInf * (Numeric.FIFTY);
            let dboxY = 0;
            for (let i = 0; i < noDummies; i++) {
                dboxY = lastRespInf + (i * (Numeric.FIFTY));
                box = box + areaClientInterfaceTemplate(dboxY);
            }
            return box;

        })()}

        <g class='Device-header' id='Device-header'>
            <g transform='translate(386 177)' class='header-box' fill='#f5f8fa' stroke='#adbecb' stroke-width='1'>
                <path d='M3,0H447a3,3,0,0,1,3,3V40a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0V3A3,3,0,0,1,3,0Z' stroke='none' />
                <path d='M3,.5H447A2.5,2.5,0,0,1,449.5,3V39a.5.5,0,0,1-.5.5H1A.5.5,0,0,1,.5,39V3A2.5,2.5,0,0,1,3,.5Z' fill='none' />
            </g>
            <text transform='translate(430 202)' class='head-text' fill='#21292c' font-size='14' font-family='SiemensSans-Bold, Siemens Sans' font-weight='700'>
                <tspan x='0' y='0'>${ellipsisText(area.name,Numeric.TEN)}<title>${area.name}</title></tspan>
            </text>
            <text transform='translate(538 202)' class='head-sub-text' fill='#21292c' font-size='14' font-family='SiemensSans-Roman, Siemens Sans'>
            <tspan x='0' y='0'>[Area]</tspan>
        </text>
            <g transform='translate(400 187)' class='head-icon-div'>
                <g transform='translate(-0.467 -0.378)'>
                    <path class='head-icon'  fill='#21292c'
                    d='M13.714,12.29l4.16,4.16-4.16,4.16-4.16-4.16Zm0,1.588L11.142,16.45l2.571,2.572ZM6.707,4.073l6.24,
                    6.24-6.24,6.24-6.24-6.24Zm0,1.588L2.056,10.313l4.651,4.651ZM13.714.378l4.16,4.16L13.714,
                    8.7l-4.16-4.16Zm0,1.588L11.142,4.538,13.714,7.11Z'/>
                </g>
            </g>
            <image width='25' image='25' transform='translate(775,187)' class='hide head-state-icon-available' href='assets/icons/PlantObjectOnlineAvailable_24.svg'/>
            <image width='25' image='25' transform='translate(775,187)' class='hide head-state-icon-unavailable' href='assets/icons/PlantObjectNotReachableIncompatible_24.svg'/>
        </g>
    </g>
    `;
}
/**
* @description Trim text if the length of text is greater than threshold
* @param text
* @param threshold
*/
function trimText(text, threshold) {
    text = text ?? '';
    /*
    * If text length is less than threshold
    *
    */
    if (text.length <= threshold) {
        return text;
    }
    /*
    * If text length is greater than threshold
    *
    */
    else {
        return text.substr(0, threshold).concat('...');
    }
}
/**
* @description Svg for server interface panel
* @param interfaceData
* @param deviceName
*
*/
export function buildServerInterfacePanel(interfaceData: ClientInterface | OpcInterface , _deviceName: string): string {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
        <g transform="translate(-380 -237)" class="device-node">
            <g class="server-inferface-panel" id="box-${interfaceData.id}">
            <path id='interface-${interfaceData.id}' transform='translate(400 253)' fill='#ebf0f5' d='M0 0 L 200 0  L 200 48 L0 48 z'/>
            <g transform="translate(385 246)" id="${interfaceData.id}" class="left-inf-anchor" fill="#fff" stroke="#adbecb" stroke-width="2">
                <circle id=${ANCHORCIRCLEID.CLIENT_OUTER} class=${ConnectorArributes.OUTERCLS} cx='5.5' cy='5.5' r='5.5' stroke='none' />
                <circle  id=${ANCHORCIRCLEID.CLIENT_INNER} class=${ConnectorArributes.INNERCLS} cx='5.5' cy='5.5' r='4.5' fill='none' />
                <circle id='scrim' class='scrim' cx='5.5' cy='5.5' r='5.5' stroke='none' />
            </g>

            </g>
        </g>
    </svg>
    `;
}
/**
* @description Svg for client interface panel
* @param interfaceData
* @param deviceName
*
*/
export function buildClientInterfacePanel(interfaceData: ClientInterface | OpcInterface , _deviceName: string): string {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
        <g transform="translate(-600 -237)" class="device-node">
            <g class="client-inferface-panel" id="box-${interfaceData.id}">

                <g transform="translate(610 246)" id="${interfaceData.id}" class="right-inf-anchor" fill="#adbecb" stroke="#21292c" stroke-width="2">
                    <circle id=${ANCHORCIRCLEID.SERVER_OUTER} class=${ConnectorArributes.OUTERCLS} cx='5.5' cy='5.5' r='5.5' stroke='none' />
                    <circle id=${ANCHORCIRCLEID.SERVER_INNER} class=${ConnectorArributes.INNERCLS} cx='5.5' cy='5.5' r='4.5' fill='none' />
                    <circle id='scrim' class='scrim' cx='5.5' cy='5.5' r='5.5' stroke='none' />
                </g>
            </g>
        </g>
    </svg>
    `;
}
