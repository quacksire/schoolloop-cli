#!/usr/bin/env node
/*jslint node this variable*/

//https://github.com/saagarjha/break/blob/e6bfd63cab1f5517cc622794149deae9cb0bee4e/break/SchoolLoop/SchoolLoopConstants.swift
let axios = require('axios');
let os = require('os')
//const ora = require('ora');
//const { AutoComplete, BasicAuth, Invisible, Input } = require('enquirer');
var base64 = require('base-64');


let pack = module.exports;


// Litterly any token works


let token = os.release();
let devOS = os.type();
let year = new Date().getFullYear();


let urlencode = require('urlencode');


let sl = require('./school-loop');





async function slstuff(slclass) {
    
    let SLuser = {
        method: 'get',
        url: `https://${slclass.subdomain}.schoolloop.com/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`,
        headers: {
            'Authorization': `Basic ${slclass.auth}`
        }
    };
    slclass.user = await axios(SLuser).then((response) => { return response.data })
    slclass.user.studentID = slclass.user.students[0].studentID
    //console.log(slclass.user)
    
    
    let SLcourses = {
        method: 'get',
        url: `https://${slclass.subdomain}.schoolloop.com/mapi/report_card?studentID=${slclass.user.studentID}`,
        headers: {
            'Authorization': `Basic ${slclass.auth}`
        }
    }
    slclass.courses = await axios(SLcourses).then((response) => { return response.data })
    console.log(slclass.courses)
    
    
    


    


    
    

    return slclass
}
class SchoolLoop {
    constructor(slSubdomain, auth) {


        this.subdomain = slSubdomain;
        this.auth = base64.encode(auth)

        

        slstuff(this)//.then((this) => )
        
        
        
        //console.log(this.user)

    }
}














let auth = `${urlencode('sjeffs24')}:${urlencode('jef228sc')}`


new SchoolLoop('hmbhs', auth)
//sl.schoolList().then(console.log)

//sl.user('hmbhs.schoolloop.com', auth).then((response) => { console.log(response.data.students)  })

//sl.courses('hmbhs.schoolloop.com', '1593846838236', auth).then((response) => { console.log(response.data) })

//sl.grade('hmbhs.schoolloop.com', '1593846838236', '1593846839201', auth).then((response) => { console.log(response.data[0].trendScores)})