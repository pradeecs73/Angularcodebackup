/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AddProjectProtectionComponent } from '../../../devices/components/add-project-protection/add-project-protection.component';
import { DeviceAuthDialogComponent } from '../../../devices/components/device-auth-dialog/device-auth-dialog.component';
import { DevicesBaseModalDialogComponent } from '../../../devices/components/devices-base-modal-dialog/devices-base-modal-dialog.component';
import { CreateEditProjectComponent } from '../../../home/components/create-edit-project/create-edit-project.component';
import { ImportProjectComponent } from '../../../home/components/import-project/import-project.component';
import { PasswordValidationComponent } from '../password-validation/password-validation.component';
import { PasswordPopupComponent } from '../../../project-settings/components/password-popup/password-popup.component';
/*
* Object which contains all the components that are dynamically loaded
*
*/
export const formOverLayMap =
{   
    /* Import project */
    'import' : { component : ImportProjectComponent, closeEvent :'hide', saveEvent:'onProjectImported'},
    /* Create edit project */
    'create-edit' : {component : CreateEditProjectComponent,closeEvent :'hide',saveEvent:'onProjectAdded',data:'projects'},
    /* Add protected device*/
    'devices-add-dialog' : {component : DevicesBaseModalDialogComponent ,closeEvent :'hide',saveEvent : 'onAddingDeviceToMain' },
    /* Set/Change Read and write password*/
    'password-validation' : {component : PasswordValidationComponent ,closeEvent :'hide',saveEvent : 'test',customActionEvent: 'passwordVerification'},
    /* Set write password */
    'write-password' : {component : PasswordPopupComponent ,closeEvent :'hide',saveEvent : 'onSettingWritePassword' },
    /* Authentication the protected device */
    'device-login-auth' : {component : DeviceAuthDialogComponent ,closeEvent :'hide',saveEvent : 'onLoginEvent', customActionEvent: 'skipDeviceEvent' },
    /* Add project protection */
    'add-project-protection' : {component : AddProjectProtectionComponent ,closeEvent :'hide',saveEvent : 'onSubmitEvent'},
};
