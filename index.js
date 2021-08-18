#!/usr/bin/env node

let axios = require('axios');
let os = require('os')
//const ora = require('ora');
//const { AutoComplete, BasicAuth, Invisible, Input } = require('enquirer');
var base64 = require('base-64');
var urlencode = require('urlencode');

let pack = module.exports


// Litterly any token works
let token = os.release()
let devOS = os.type()
let year = new Date().getFullYear()

pack.schoolList = () => {

    axios('https://anything-can-go-here.schoolloop.com/mapi/schools')
        .then(function(response) {
        
            return response.data
            
        })

}

pack.user = (slDomain, slUsername, slPassword) => {


    let auth = `${urlencode(username)}:${urlencode(password)}`
    auth = base64.encode(auth)
    axios(`https://${school.domainName}/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`, {
        headers: {
            Authorization: `Basic ${auth}`,
        }
    })
    .then(function (response) {
        return response
    })

}

