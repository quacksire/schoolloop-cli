#!/usr/bin/env node
/*jslint node this variable*/

//https://github.com/saagarjha/break/blob/e6bfd63cab1f5517cc622794149deae9cb0bee4e/break/SchoolLoop/SchoolLoopConstants.swift
let axios = require('axios');
let os = require('os')


const ora = require('ora');
const loginSpinner = ora('Logging In...').start();


const { AutoComplete, BasicAuth, Invisible, Input, Select } = require('enquirer');
let base64 = require('base-64');
let urlencode = require('urlencode');

var figlet = require('figlet');



// Litterly any token works
let token = os.release();
let devOS = os.type();
let year = new Date().getFullYear();


const Conf = require('conf');
const config = new Conf();
//config.clear()



let sl = require('./school-loop');





async function slstuff() {
    
    //console.log(slclass.user)
    
    
    let SLcourses = {
        method: 'get',
        url: `https://${config.get('slDomain')}/mapi/report_card?studentID=${config.get('slUser.studentID')}`,
        headers: {
            'Authorization': `Basic ${config.get('auth')}`
        }
    }
    let courses = await axios(SLcourses).then((response) => { return response.data })
    
    
    
    
    let classList = [];
    courses.forEach((classes) => {
        classList.push(`${classes.period} - ${classes.courseName} [${classes.teacherName}]`)//////////////////////////////////----------------------
    
    
    
    })
    
    
    
    const prompt = new Select({
        name: 'color',
        message: 'Pick a flavor',
        choices: classList
    });
    
    

    prompt.run()
    


    
    

    
}
class SchoolLoop {
    constructor(slSubdomain, auth) {


        this.subdomain = slSubdomain;
        this.auth = base64.encode(auth)

        

        slstuff(this)//.then((this) => )
        
        
        
        //console.log(this.user)

    }
}



function login() {
    /// Login Flow
    loginSpinner.stop()
    loginSpinner.clear()
    console.clear()
    const spinner = ora('Getting list of schools').start();
    let schoolList = axios('https://anything-can-go-here.schoolloop.com/mapi/schools')
        .then(function (response) {
            //console.log(response.data)
            let schoolNames = new Array()
            response.data.forEach(school => {
                schoolNames.push(school.name)
            });
            //console.log(schoolList[0])
            spinner.stop()
            const schoolSelector = new AutoComplete({
                name: 'schools',
                message: 'School Name',
                limit: 1,
                initial: 0,
                choices: schoolNames
            });
            schoolSelector.run()
                .then(answer => {
                    //Get School Object
                    let counter = 0
                    while (true) {
                        if (response.data[counter].name == answer) {
                            break
                        }
                        counter++
                    }
                    school = response.data[counter]
                    //console.log(school)
                    let username
                    let password
                    const usernamePrompt = new Input({
                        message: `Please enter your username to log into ${school.name}`,
                        initial: 'johnappleseed'
                    });
                    usernamePrompt.run().then(answer => {

                        username = answer
                        const passwordPrompt = new Invisible({
                            message: `Password?`
                        });
                        passwordPrompt.run().then(answer => {
                            password = answer
                            axios(`https://${school.domainName}/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`, {
                                headers: {
                                    authorization: `Basic ${base64.encode(`${urlencode(username)}:${urlencode(password)}`)}`,
                                }
                            })
                                .then(function (response) {
                                    config.set('auth', `${base64.encode(`${urlencode(username)}:${urlencode(password)}`)}`)
                                    config.set('slUser', response.data)
                                    config.set('slUser.studentID', response.data.students[0].studentID)
                                    config.set('slDomain', school.domainName)
                                    
                                    
                                    checkAuth() //Loopback
                                })
                                //////////////////////
                                .catch(function (err) {
                                    console.error(`Login Failed \n ${err.response.data}`)
                                })

                        }).catch(console.log);
                    }).catch(console.log);
                })
                .catch(console.error);
        });

}

function checkAuth() {

    if (config.get('auth')) {
    
    
        start()
    
    } else {
    
        login()
    
    }




}

function start() {
    loginSpinner.stop()
    loginSpinner.clear()
    figlet('School Loop', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
        console.log(data)
        
    });
    slstuff()







}






checkAuth()
//login()
//new SchoolLoop('hmbhs', auth)
//sl.schoolList().then(console.log)

//sl.user('hmbhs.schoolloop.com', auth).then((response) => { console.log(response.data.students)  })

//sl.courses('hmbhs.schoolloop.com', '1593846838236', auth).then((response) => { console.log(response.data) })

//sl.grade('hmbhs.schoolloop.com', '1593846838236', '1593846839201', auth).then((response) => { console.log(response.data[0].trendScores)})