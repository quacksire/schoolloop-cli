#!/usr/bin/env node

let axios = require('axios');
let os = require('os')
const ora = require('ora');
const { AutoComplete, BasicAuth, Invisible, Input} = require('enquirer');

var urlencode = require('urlencode');
let school;

// Litterly any token works
        let token = os.release()
        let devOS = os.type()
        let year = new Date().getFullYear()

class schoolLoop {
    constructor() {
    
        console.log('New School created')
    
    }
    login() {
    
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
                            initial: 'jonschlinkert'
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
                                        authorization: `${urlencode(username)}:${urlencode(password)}`,
                                    }
                                })
                                    .then(function (response) {
                                        console.log(response.data.data)
                                    })
                                    //////////////////////
                                    .catch(function (err) {
                                        console.error(`Login Failed \n ${err.response.data}`)
                          
                                    })
                  
                            }).catch(console.log);
                        }).catch(console.log);
                    })
                    .catch(console.error);
                this.auth = `${urlencode(username)}:${urlencode(password)}`
            });
}
}


new schoolLoop().login()




//console.log(os.type())
//"https://\(domainName)/mapi/login?version=3&devToken=\(SchoolLoopConstants.devToken)&devOS=\(SchoolLoopConstants.devOS)&year=\(SchoolLoopConstants.year)

/*
axios(`https://${school.domainName}/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`{
  headers: {
    authorization: 'test-value'
  })
  .then(function (response) {
     console.log(response.data)
  })
    .catch(function (err) {
    console.error(err)
    })

*/
//https://hmbhs.schoolloop.com/mapi/report_card?studentID=70532



