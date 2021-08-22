#!/usr/bin/env node
/*jslint node this variable*/

//https://github.com/saagarjha/break/blob/e6bfd63cab1f5517cc622794149deae9cb0bee4e/break/SchoolLoop/SchoolLoopConstants.swift
let axios = require('axios');
let os = require('os')

//`https://${config.get('slDomain')}/mapi/progress_report?studentID=\periodID=\(periodID)`
const ora = require('ora');
const loginSpinner = ora('Logging In...').start();
const loadingSpinner = ora('Loading...')

const { AutoComplete, BasicAuth, Invisible, Input, Select, Toggle } = require('enquirer');
let base64 = require('base-64');
let urlencode = require('urlencode');

var figlet = require('figlet');
var Table = require('cli-table');

//npm install open
const { convert } = require('html-to-text');


// Litterly any token works
let token = os.release();
let devOS = os.type();
let year = new Date().getFullYear();


const Conf = require('conf');
const config = new Conf();
//config.clear()



let sl = require('./school-loop');
let slClass;





async function slstuff() {
    //loadingSpinner.start()
    //console.log(slclass.user)
    
    
    let SLcourses = {
        method: 'get',
        url: `https://${config.get('slDomain')}/mapi/report_card?studentID=${config.get('slUser.studentID')}`,
        headers: {
            'Authorization': `Basic ${config.get('auth')}`
        }
    }
    
    
    let SLassignments = {
        method: 'get',
        url: `https://${config.get('slDomain')}/mapi/assignments?studentID=${config.get('slUser.studentID')}`,
        headers: {
            'Authorization': `Basic ${config.get('auth')}`
        }
    }
    
    let SLnews = {
        method: 'get',
        url: `https://${config.get('slDomain')}/mapi/news?studentID=${config.get('slUser.studentID')}`,
        headers: {
            'Authorization': `Basic ${config.get('auth')}`
        }
    }
    
    
    
    let courses = await axios(SLcourses).then((response) => { return response.data })
    let assignments = await axios(SLassignments).then((response) => { return response.data})
    let news = await axios(SLnews).then((response) => { return response.data})
    //console.log(news)
    
    let main = [];
    let firstSpace;
    let secondSpace
    
    
    main.push(`------------------ Classes ------------------`)
    courses.forEach((classes) => {
        firstSpace = ''
        secondSpace = ''
        let firstSpaces = 20 - (String(classes.courseName).length + 2)
        firstSpace = ' '.repeat(parseInt(firstSpaces))
        
        let secondSpaces = 15 - (String(classes.grade).length - 1)
        secondSpace = ' '.repeat(parseInt(secondSpaces))
        main.push(`${classes.period} ${classes.courseName}${firstSpace}> ${classes.grade}${secondSpace}[${classes.teacherName}]`)
    })
    main.push(`------------------ Assignments ------------------`)
    assignments.forEach((assignment, num) => {
        firstSpace = ''
        let firstSpaces = 15 - String(assignment.title).length
        firstSpace = ' '.repeat(firstSpaces)        
        
        secondSpace = ''
        let secondSpaces = 15 - (String(assignment.maxPoints).length + 7)
        secondSpace = ' '.repeat(secondSpaces)
        
        main.push(`[] ${num} - ${assignment.title}${firstSpace}${assignment.maxPoints} Points${secondSpace}${assignment.courseName}`)
    
    
    })
    main.push(`------------------ News ------------------`)
    news.forEach((article, num) => {
        
        main.push(`# ${num} ${convert(article.title, {wordwrap: 130})}`)
    
    

    
    })
    
    const prompt = new Select({
        name: '',
        message: '',
        choices: main
    });
    
    
    //loadingSpinner.stop()
    //loadingSpinner.clear()
    prompt.run()
        .then(async (answer) => {
            console.log(answer)
            if (String(answer).startsWith('[') || String(answer).startsWith('-')) {
                //do nothing
                start()
                
            
            } if (String(answer).startsWith('#')) {
            
                let article = news[parseInt(String(answer).charAt(2))]
                //console.log(article)
            
                // The articles are in HTML format
                article.description = convert(article.description, {
                    wordwrap: 130
                })
                
                console.log(`\n\nFrom: ${article.authorName}\nSubject: ${article.title}\n\n${article.description}`)
                
                
                
                
            
            } else {
                
            
                
                
                //need some ui library for tables/graphs

                answer = parseInt(String(answer).split(' ')[0]) - 2
                let selectedNum = answer
                SLclass = {
                    method: 'get',
                    url: `https://${config.get('slDomain')}/mapi/progress_report?studentID=${config.get('slUser.studentID')}&periodID=${courses[selectedNum].periodID}`,
                    headers: {
                        'Authorization': `Basic ${config.get('auth')}`
                    }
                }
                let SLclassInfo = await axios(SLclass).then((response) => { return response.data })
                //console.log(SLclassInfo)
            
            
                var table = new Table()
            
            
                table.push(
                    { 'Name': `${SLclassInfo[0].course.name}` },
                    { 'Teacher': `${SLclassInfo[0].teacher.name}` },
                    { '---': `---` },
                    { 'Grade': `${SLclassInfo[0].grade} (${SLclassInfo[0].score})` },
                    { '---': `---` },
                )
                console.log(table.toString())

                
                

            }
            const back = new Toggle({
                    message: '',
                    enabled: ' ',
                    disabled: '⟪⟪ Back'
                });
                
            back.run()
            .then(answer => {
                start()
                
            })
            .catch(console.error);
            
        
        })
}

class SchoolLoop {
    constructor(slSubdomain, auth) {


        this.subdomain = slSubdomain;
        this.auth = base64.encode(auth)

        

        slstuff(this)//.then((this) => )
        
        
        
        //console.log(this.user)

    }
}



async function login() {
    /// Login Flow
    loginSpinner.stop()
    loginSpinner.clear()
    console.clear()
    const spinner = ora('Getting list of schools').start();
    let schoolList = axios('https://anything-can-go-here.schoolloop.com/mapi/schools')
        .then(async function (response) {
            let schoolNames = new Array()
            response.data.forEach(school => {
                schoolNames.push(school.name)
            });
            spinner.stop()
            console.clear()
            await figlet(`schoolloop.com`, function (err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log(data)
        
            });
            const schoolSelector = new AutoComplete({
                name: 'schools',
                message: 'School Name',
                limit: 1,
                initial: 0,
                choices: schoolNames
            });
            schoolSelector.run()
                .then(async answer => {
                    //Get School Object
                    let counter = 0
                    while (true) {
                        if (response.data[counter].name == answer) {
                            break
                        }
                        counter++
                    }
                    school = response.data[counter]
                    console.clear()
                    await figlet(`${school.domainName}`, function (err, data) {
                        if (err) {
                            console.log('Something went wrong...');
                            console.dir(err);
                            return;
                        }
                        console.log(data)
        
                    });
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
									///Persist the data
                                    config.set('auth', `${base64.encode(`${urlencode(username)}:${urlencode(password)}`)}`)
                                    config.set('slUser', response.data)
                                    config.set('slUser.studentID', response.data.students[0].studentID)
                                    config.set('slDomain', school.domainName)
                                    
                                    
                                    checkAuth() //Loopback
                                })
                                //////////////////////
                                .catch(function (err) {
                                    console.error(`Login Failed \n ${err.response.data} \n Trying Again`)
									setTimeout(checkAuth(), 3000)
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
    console.clear()
    figlet(`School Loop`, function (err, data) {
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