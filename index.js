#!/usr/bin/env node


//https://github.com/saagarjha/break/blob/e6bfd63cab1f5517cc622794149deae9cb0bee4e/break/SchoolLoop/SchoolLoopConstants.swift
let axios = require('axios');
let os = require('os')
//const ora = require('ora');
//const { AutoComplete, BasicAuth, Invisible, Input } = require('enquirer');
var base64 = require('base-64');


let pack = module.exports


// Litterly any token works







const sl = require('./school-loop')

class SchoolLoop {
  constructer(slSubdomain, auth) {

    let token = os.release()
    let devOS = os.type()
    let year = new Date().getFullYear()


    this.subdomain = slDomain;
    this.auth = base64.encode(auth)


    let SLuser = {
      method: 'get',
      url: `https://hmbhs.schoolloop.com/mapi/login?version=3&devToken=10.029383&devOS=darwin&year=2021`,
  headers: { 
    'Authorization': 'Basic Og=='
  }
};


    this.user = 



    this.user = axios(`https://${this.domain}/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`, { headers: { Authorization: `Basic ${this.auth}` }})
    .then(function (response) {
        console.log(response)
        return response
    })


  }





axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

}














var urlencode = require('urlencode');
let auth = `${urlencode('sjeffs24')}:${urlencode('jef228sc')}`


new SchoolLoop('hmbhs', auth)
//sl.schoolList().then(console.log)

//sl.user('hmbhs.schoolloop.com', auth).then((response) => { console.log(response.data.students)  })

//sl.courses('hmbhs.schoolloop.com', '1593846838236', auth).then((response) => { console.log(response.data) })

sl.grade('hmbhs.schoolloop.com', '1593846838236', '1593846839201', auth).then((response) => { console.log(response.data[0].trendScores)})