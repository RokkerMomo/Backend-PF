"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.special = void 0;
const special = (req, res) => {
    let Vimeo = require('vimeo').Vimeo;
    let client = new Vimeo("1b1ad06c540f3a4faa567f68f013749aa36c3486", "H/K+8oyYiMRANuebFFiyUQp/A5gBa0EH1uhtAaIDCL4b5qiHovXXb8oNRApzZh06sMQzL53XIkNi8dDbBJ9ul7wJ/Iiii6zVbX/XDNfmUbsRkNm/MiFIPxBsLODSPIb2", "f2e3766a4980ffc819915beb0addecf6");
    let file_name = 'C:/Users/Fernando/Documents/ShareX/Screenshots/2025-02/msedge_dUy2gk0eT5.mp4';
    client.upload(file_name, {
        'name': 'Test1',
        'description': 'The description goes here.'
    }, function (uri) {
        console.log('Your video URI is: ' + uri);
    }, function (bytes_uploaded, bytes_total) {
        var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2);
        console.log(bytes_uploaded, bytes_total, percentage + '%');
    }, function (error) {
        console.log('Failed because: ' + error);
    });
    client.request({
        method: 'GET',
        path: '/tutorial'
    }, function (error, body, status_code, headers) {
        if (error) {
            console.log(error);
        }
        console.log(body);
    });
    return res.json({ msg: `Hey ${req.body.email}!` });
};
exports.special = special;
