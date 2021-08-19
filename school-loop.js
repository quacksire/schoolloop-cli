let axios = require('axios');
let os = require('os')
//const ora = require('ora');
//const { AutoComplete, BasicAuth, Invisible, Input } = require('enquirer');
var base64 = require('base-64');


let pack = module.exports


// Litterly any token works
let token = os.release()
let devOS = os.type()
let year = new Date().getFullYear()




class SchoolLoop {
  constructer(slDomain, auth) {
    this.domain = slDomain;
    this.auth = base64.encode(auth)
    this.user = axios(`https://${slDomain}/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`, { headers: { Authorization: `Basic ${auth}` }})
    .then(function (response) {
        console.log(response)
        return response
    })


  }





}
pack.schoolList = () => {

    return axios('https://anything-can-go-here.schoolloop.com/mapi/schools').then((response) => { return response.data})
        

}

pack.user = (slDomain, auth) => {


    auth = base64.encode(auth)
    return axios(`https://${slDomain}/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`, {
        headers: {
            Authorization: `Basic ${auth}`,
        }
    })
    .then(function (response) {
        return response
    })

}


pack.courses = (slDomain, slUserID, auth) => {

    auth = base64.encode(auth)
    return axios(`https://${slDomain}/mapi/report_card?studentID=${slUserID}`, {
        headers: {
            Authorization: `Basic ${auth}`,
        }
    })

}


pack.grade = (slDomain, slUserID, slperiodID, auth) => {

    auth = base64.encode(auth)
    return axios(`https://${slDomain}/mapi/progress_report?studentID=${slUserID}&periodID=${slperiodID}`, {
        headers: {
            Authorization: `Basic ${auth}`,
        }
    })

}


//1593846838236

