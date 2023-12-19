/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

const express = require('express');
const port = process.env.PORT || 4200;
const app = express();
app.disable('x-powered-by');

class App {

    public app = express();

    constructor() {
        app.use(express.static(__dirname + '/data'));

        app.listen(port);
        console.log(`-----------listening to port no: ${port}-----------------`);
    }
}


export default new App();
