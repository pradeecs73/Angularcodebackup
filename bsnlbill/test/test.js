// ------------------------------------------------------------------------
// Copyright © Siemens AG 2021-2021. All rights reserved. Confidential.
// ------------------------------------------------------------------------
/* eslint-disable prefer-arrow/prefer-arrow-functions */


const { $, element, browser, } = require("protractor");


var path = require('path');
var EC = protractor.ExpectedConditions;
fdescribe('App launch', function() {

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
});

afterEach(function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
});


//   fit('Launch with the home page loading and Create New Project', function(){

//         browser.ignoreSynchronization = true;
//         browser.get('http://localhost:4200/');
//         browser.manage().window().maximize();
//         click on the Create Project using its id
//         element(by.id('CreateButton')).click();

//         *****check whether the create button is enabled and clicked*****//
//         expect(element(by.id('CreateButton')).isDisplayed()).toBe(true);
       
//         Enter the Name
//         element(by.id('name')).sendKeys('New_proj');

//         check whether the project name was entered or not and then pass
//         expect(element(by.id('name')).isDisplayed()).toBe(true);
//         browser.sleep(1000)
      
//         Enter the Comment
//         element(by.id('comment')).sendKeys('This is a Dummy Project through Automation');


//         ******Check the comment is enabled and the desired comment is written or not*******//
//         expect(element(by.id('comment')).isDisplayed()).toBe(true);
//         expect(element(by.id('comment')).getText()).toEqual('This is a Dummy Project through Automation');
        
//         browser.sleep(1000);

//         Enter the Author Name
//         element(by.id('author')).sendKeys('Somya Shree');
//         ******Check the author is enabled and the author is written or not*******//
//         expect(element(by.id('author')).isDisplayed()).toBe(true);
    
//         browser.sleep(1000); 

//         Click on the Create Button to Create the project and save it
//         expect(element(by.id('save')).isEnabled()).toBe(true);
//         element(by.id('save')).click(); 
//         browser.sleep(3000);
//       });

//      fit('Import a File ', function() {
//      click on the Import Project using its ID
      
//        element(by.id('Importbutton')).click();
     
//        expect(element(by.id('Importbutton')).isDisplayed()).toBe(true)
       
//        var fileToUpload = 'Automation/fd.yaml',
       
//        absolutePath = path.resolve(__dirname, fileToUpload);

//        element(by.css('input[type="file"]')).sendKeys(absolutePath); 
//         var clearText = element(by.id('name'));
//         clearText.clear();
       

//         element(by.id('name')).sendKeys('Imp_proj'); 

//         expect(element(by.id('name')).isDisplayed()).toBe(true);
//         element(by.id('comment')).sendKeys('This is a new import'); 
//         element(by.id('ok')).click();
//         expect(true).toBe(true);

//         browser.sleep(1000);       
        
//       });
//       fit('Duplicate Project Name Entered During Import', function() {
       
//          element(by.id('Importbutton')).click();
         
//          expect(element(by.id('Importbutton')).isDisplayed()).toBe(true)
         
//          var fileToUpload = 'Automation/fd.yaml',
        
//          absolutePath = path.resolve(__dirname, fileToUpload);
//          browser.sleep(1000);
//          element(by.css('input[type="file"]')).sendKeys(absolutePath); 
//          browser.sleep(1000);
//           var clearText = element(by.id('name'));
//           clearText.clear();
//           browser.sleep(1000);
  
//           element(by.id('name')).sendKeys('Imp_proj'); 
//           browser.sleep(1000);
//           expect(element(by.id('name')).isDisplayed()).toBe(true);
//           browser.sleep(1000);
//           element(by.id('comment')).sendKeys('This is a new import'); 
//           element(by.id('ok')).click();
//           expect(true).toBe(true);
  
//           browser.sleep(1000);
  
//          check whether the project name already exists
//           expect(element(by.id('duplicateNameerror')).isDisplayed()).toBe(true)
//             .then( () => {
//               element(by.id('cancel')).click();
              
//             }).catch(e =>{
              
//             })   
//         });
//       fit('Open a project, Edit it and Close it', function() {
     
      
//        element(by.id('selection')).click();
//        expect(element(by.id('selection')).isDisplayed()).toBe(true);
//        browser.sleep(1000);

//       click on Open Project Icon
      
//        element(by.id('OpenButton')).click();
//        expect(element(by.id('selection')).isDisplayed()).toBe(true);

//        browser.sleep(1000);

    
//       });

//       fit('Edit the Opened Project', function() {
     
      
 
//        Click on Edit icon of opened project
      
//         element(by.id('editButton')).click();
//         expect(element(by.id('selection')).isDisplayed()).toBe(true);
 
//         browser.sleep(1000)
        
//        clear the name field
//         let editName = element(by.id('name'));
//         editName.clear();
 
//        provide a new name of the project
//         element(by.id('name')).sendKeys('Edit_proj'); 
//         expect(element(by.id('name')).isDisplayed()).toBe(true);
//        clear the comment
//         element(by.id('comment')).clear();
 
//        provide a new comment
//         element(by.id('comment')).sendKeys('This is an edited project'); 
//         expect(element(by.id('comment')).isDisplayed()).toBe(true);
//        clear the author
//         element(by.id('author')).clear();
 
//         provide the new author
//         element(by.id('author')).sendKeys('NewAuthor'); 
//         expect(element(by.id('author')).isDisplayed()).toBe(true);
 
//        click on save icon
//         expect(element(by.id('save')).isDisplayed()).toBe(true);
//         element(by.id('save')).click();
//         browser.sleep(1000)
//       });
//       fit('Close the Edited Project', function() {
//        click on the three dots to close the project
   
//       element(by.id('dotButton')).click();
//       expect(element(by.id('dotButton')).isDisplayed()).toBe(true);  
//        click on close project
//         element(by.xpath('//*[@id="dotButton"]/span/p-menu/div/ul/li[2]/a/span[2]')).click();
 
//        click on Yes to close the project
//         element(by.xpath('//*[@id="ok"]')).click();
        
//         browser.sleep(1000);
//        });
       
      
//       fit('Select a Project and Delete it', function() {
        
//        select a project
//        element(by.id('selection')).click();
//        expect(element(by.id('selection')).isDisplayed()).toBe(true);
//        browser.sleep(500);

//       click on delete Project Icon
//        element(by.id('DeleteButton')).click();
//        expect(element(by.id('DeleteButton')).isEnabled()).toBe(true);
//        browser.sleep(500);

       
//       click on Yes to delete the project
//        expect(element(by.xpath('//*[@id="ok"]')).isEnabled()).toBe(true);
//        element(by.xpath('//*[@id="ok"]')).click();
      
//        browser.sleep(1000);
//       });

//       fit('Open project and move to device view ', function() {
//      select a project 
//       element(by.xpath('//*[@id="selection"]/div[1]/div[2]')).click();
//       element(by.id('selection')).click();
//       expect(element(by.xpath('//*[@id="selection"]/div[1]/div[2]')).isDisplayed()).toBe(true);
//       browser.sleep(500);
//      click on Open Project Icon
 
//       element(by.id('OpenButton')).click();
//       expect(element(by.id('OpenButton')).isDisplayed()).toBe(true);

//       browser.sleep(500);
 
//       click on device view
//       expect(element(by.xpath('/html/body/app-root/app-layout/div/div[2]/div[1]/app-menu/div/p-menu/div/ul/li[2]/a/span[1]')).isDisplayed()).toBe(true);
//       element(by.xpath('/html/body/app-root/app-layout/div/div[2]/div[1]/app-menu/div/p-menu/div/ul/li[2]/a/span[1]')).click();
  
//       browser.sleep(500);
//     });
//     fit('Add the project to device view', function() {
//      Click on add new device 
//       expect(element(by.id('addButton')).isDisplayed()).toBe(true);
//       element(by.id('addButton')).click();

//      click on next in the pop-up window of Add new device

//      expect(element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-mechanism-selector/form/div[3]/div')).isDisplayed()).toBe(true);
//      element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-mechanism-selector/form/div[3]/div')).click();

//     clear the text field of Device Address
//      element(by.id('address')).clear();

//    enter the url
//     element(by.id('address')).sendKeys('opc.tcp://192.168.2.101:4840'); 
//     browser.sleep(500);

//    clear the name field of Device Name

//    click on next
//    expect(element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-details-selector/form/div[2]/div[2]/div')).isDisplayed()).toBe(true);
//    element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-details-selector/form/div[2]/div[2]/div')).click();

  
//    click on Add
//     browser.sleep(5000);
//     expect(element(by.id('Create')).isDisplayed()).toBe(true);
//     element(by.id("Create")).click()
      
//   wait for device to be added

//     browser.sleep(5000);
//    click on OK once the device is added
   
//    expect(element(by.id('ok')).isDisplayed()).toBe(true);
   
//    element(by.id('ok')).click();
//    browser.sleep(5000);

//   code to find the text after device is added
//    var text = element(by.id('new'));
  
//    if(text.isDisplayed())
//    {
//     console.log("Element found with text:")
//     expect(text.getText()).toBe('NEW');
//    }
//    else
//    {
//      console.log("Element Not Found")
//    }
//   Click on add new device 
//   expect(element(by.id('addButton')).isDisplayed()).toBe(true);
//   element(by.id('addButton')).click();
//  click on next in the pop-up window of Add new device
//   expect(element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-mechanism-selector/form/div[3]/div')).isDisplayed()).toBe(true);
//   element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-mechanism-selector/form/div[3]/div')).click();
//   element(by.id('address')).clear();
//   enter the url
//   element(by.id('address')).sendKeys('opc.tcp://192.168.2.102:4840'); 
//   browser.sleep(1000);
//  click on next
//   expect(element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-details-selector/form/div[2]/div[2]/div')).isDisplayed()).toBe(true);
//   element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-details-selector/form/div[2]/div[2]/div')).click();
//  click on Add
//   browser.sleep(5000);
//   expect(element(by.id('Create')).isDisplayed()).toBe(true);
//  element(by.id("Create")).click()
//  wait for device to be added
//  browser.sleep(5000);
// click on OK once the device is added
//  expect(element(by.id('ok')).isDisplayed()).toBe(true);
//  element(by.id('ok')).click();
//  browser.sleep(5000);
// code to find the text after device is added
// var text = element(by.id('new'));
  
// if(text.isDisplayed())
// {
//  console.log("Element found with text:")
//  expect(text.getText()).toBe('NEW');
// }
// else
// {
//   console.log("Element Not Found")
// }

// });

// fit('Delete Device from device view', async() => {
//   element(by.id('selectDevice')).click();
//   element(by.id('deleteIcon')).click();
//   browser.sleep(5000);
//   expect(element(by.xpath('//*[@id="ok"]')).isEnabled()).toBe(true);
//   element(by.xpath('//*[@id="ok"]')).click();

//   expect(element(by.id('addButton')).isDisplayed()).toBe(true);
//   element(by.id('addButton')).click();

// click on next in the pop-up window of Add new device

//  expect(element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-mechanism-selector/form/div[3]/div')).isDisplayed()).toBe(true);
//  element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-mechanism-selector/form/div[3]/div')).click();

//  clear the text field of Device Address
//  element(by.id('address')).clear();

// enter the url
// element(by.id('address')).sendKeys('opc.tcp://192.168.2.101:4840'); 
// browser.sleep(50000);

// click on next
// expect(element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-details-selector/form/div[2]/div[2]/div')).isDisplayed()).toBe(true);
// element(by.xpath('//*[@id="overlay"]/div/div/p-card/div/div[2]/div/devices-base-modal-dialog/div/div[1]/div/device-add-details-selector/form/div[2]/div[2]/div')).click();


// click on Add
// browser.sleep(5000);
// expect(element(by.id('Create')).isDisplayed()).toBe(true);
// element(by.id("Create")).click()
  
// wait for device to be added

// browser.sleep(5000);
// click on OK once the device is added

// expect(element(by.id('ok')).isDisplayed()).toBe(true);

// element(by.id('ok')).click();
// browser.sleep(5000);

// code to find the text after device is added
// var text = element(by.id('new'));

// if(text.isDisplayed())
// {
// console.log("Element found with text:")
// expect(text.getText()).toBe('NEW');
// }
// else
// {
//  console.log("Element Not Found")
// }

// });

// fit('Route to editor View', function() {

//   expect(element(by.xpath('/html/body/app-root/app-layout/div/div[2]/div[1]/app-menu/div/p-menu/div/ul/li[3]/a')).isDisplayed()).toBe(true);
//   element(by.xpath('/html/body/app-root/app-layout/div/div[2]/div[1]/app-menu/div/p-menu/div/ul/li[3]/a')).click();
//   browser.sleep(4000);
// });


fit('drag and drop', async() => {
 
  
  browser.ignoreSynchronization = true;
  browser.get('http://localhost:4200/');
  browser.manage().window().maximize();
  element(by.id('selection')).click();
  expect(element(by.id('selection')).isDisplayed()).toBe(true);
  browser.sleep(1000);

 // click on Open Project Icon
 
  element(by.id('OpenButton')).click();
  expect(element(by.id('selection')).isDisplayed()).toBe(true);

  browser.sleep(1000);
  //*****************************************/
  //Drag 1st Device
  const elem1 = element.all((by.className('ui-menuitem')));
  console.log("**********************************")
  elem1.get(2).click();
  expect(elem1.get(2).isDisplayed()).toBe(true)
  
  const elem = element.all((by.className('device-node')));
  browser.wait(EC.presenceOf(elem), 5000);
  expect(elem.get(0).isDisplayed()).toBe(true);
  elem.get(0).click();
  browser.sleep(2000)
  
  const tree = element.all((by.className('tree__root')))
  expect(tree.get(0).isDisplayed()).toBe(true);
  const treeList = tree.get(0);
  console.log('treeList',treeList);
  const drop =element(by.id('myCanvas'));

  browser.sleep(5000)
  
  await browser.actions().mouseMove(treeList.getWebElement()).perform();
  await browser.actions().mouseDown(treeList.getWebElement()).perform();
  await browser.actions().mouseMove({ x: 10, y: 0 }).perform();
  await browser.actions().mouseMove(drop.getWebElement()).perform();
  await browser.actions().mouseUp().perform();
  await browser.sleep(5000)

  //*****************************************/
  //Drag 2nd Device
  
  const elem2 = element.all((by.className('ui-menuitem')));
  elem2.get(2).click();
  expect(elem2.get(2).isDisplayed()).toBe(true)
  
  const ele = element.all((by.className('device-node')));
  browser.wait(EC.presenceOf(ele), 5000);
  expect(ele.get(2).isDisplayed()).toBe(true);
  ele.get(2).click();
  browser.sleep(2000)

  const tree1 = element.all((by.className('tree__root')))
  expect(tree1.get(1).isDisplayed()).toBe(true);
  const treeList1 = tree.get(1);
  console.log('treeList',treeList1);
  const drop1 =element(by.id('myCanvas'));

  browser.sleep(5000)

  await browser.actions().mouseMove(treeList1.getWebElement()).perform();
  await browser.actions().mouseDown(treeList1.getWebElement()).perform();
  await browser.actions().mouseMove({ x: 5, y: 5 }).perform();
  await browser.actions().mouseMove(drop1.getWebElement()).perform();
  await browser.actions().mouseUp().perform();
  await browser.sleep(5000)
  //*****************************************/

  // Draw the connection between client and server

// id="serverInf_l27vkinv"
// id="clientInf_l27vlx0u"

// var source_ele = element(by.id("serverInf_l27vkinv"))

// var target_ele = element(by.id("clientInf_l27vlx0u"))

const serverAnchor = element.all((by.className('anchor')));
 await browser.wait(EC.presenceOf(serverAnchor.get(0)), 50000);
  expect(serverAnchor.get(0).isDisplayed()).toBe(true);
 // serverAnchor.get(0).click();


  const clientAnchor = element.all((by.className('anchor-2')));
 await browser.wait(EC.presenceOf(clientAnchor.get(0)), 50000);
  expect(clientAnchor.get(0).isDisplayed()).toBe(true);
 // clientAnchor.get(0).click();

await browser.actions().dragAndDrop(serverAnchor.get(0).getWebElement(),clientAnchor.get(0).getWebElement()).perform();
expect(by.className('actual-connect-scrim'));

await browser.sleep(15000)







  //*********************************************** */
  // element(by.id('Establish_connectionButton')).click();
  // browser.sleep(60000);

  // element(by.id('ok')).click();
  // browser.sleep(2000);
  
  // element(by.id('goOnlineButton')).click();
  // browser.sleep(10000);

  // element(by.id('goOfflineButton')).click();
  // browser.sleep(5000);

});
  
});