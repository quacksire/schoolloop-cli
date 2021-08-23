#!/usr/bin/env node

/*!
 * Copyright (c) 2021 child-duckling <duck@duckling.pw>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 *  For the links to the API
 *  https://github.com/saagarjha/break/blob/e6bfd63cab1f5517cc622794149deae9cb0bee4e/break/SchoolLoop/SchoolLoopConstants.swift
 *  
 *  For authintication
 *  https://schoolloop.com/pf4/cms2/view_page?d=x&group_id=1516954809004&vdid=i7fcm1t7v9bh4
*/
"use strict"
// This code had severe leakage



//#region imports
let axios = require('axios');
let os = require('os')
const ora = require('ora');
const { AutoComplete, Invisible, Input, Select, Toggle } = require('enquirer');
let base64 = require('base-64');
let urlencode = require('urlencode');
var figlet = require('figlet');
var Table = require('cli-table');
const { convert } = require('html-to-text');
const Conf = require('conf');
const config = new Conf();
const loginSpinner = ora('Logging In...').start();
const loadingSpinner = ora('Loading...')


//npm install open

// URL params
let token = os.release();
let devOS = os.type();
let year = new Date().getFullYear();




//config.clear()
//#endregion
/*
Login flow
This grabs the credentails from the user, logins in, and saves the user info/authintication for use in main()
*/
async function login() {
    config.clear()
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
                    var school = response.data[counter]
                    config.set('SLSchool', school)
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
/*
Main flow
Grabs data from school loop and displays it in a single Select Prompt. I wanted to emulate the website as much as possible, but I couldn't find 
a way to display to streams of data on different sides of the terminal window.
*/
async function main() {
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
        console.log(`Hello ${String(config.get('slUser').fullName).split(', ')[1]}!`)
    });
    //loadingSpinner.start()
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
    let SLloopmail = {
        method: 'get',
        url: `https://${config.get('slDomain')}/mapi/mail_messages?studentID=${config.get('slUser.studentID')}`,
        headers: {
            'Authorization': `Basic ${config.get('auth')}`
        }
    }
    let courses = await axios(SLcourses).then((response) => { return response.data })
    let assignments = await axios(SLassignments).then((response) => { return response.data })
    let news = await axios(SLnews).then((response) => { return response.data })
    let loopmails = await axios(SLloopmail).then((response) => { return response.data })
    //console.log(loopmails)
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
        main.push(`# ${num} ${convert(article.title, { wordwrap: 130 })}`)
    })
    main.push(`------------------ LoopMail ------------------`)
    loopmails.forEach((mail, num) => {
        main.push(`@ ${num} ${convert(mail.subject, { wordwrap: 130 })}`)
    })
    main.push(`------------------ SchoolLoop CLI ------------------`)
    main.push(`! School Info`)
    main.push(`! Deadname remover/changer`)
    main.push(`! Log Out`)
    main.push(`! Exit`)
    
    const prompt = new Select({
        name: '',
        message: '',
        choices: main
    });
    //loadingSpinner.stop()
    //loadingSpinner.clear()
    prompt.run()
        .then(async (answer) => {
            //console.log(answer)
            if (String(answer).startsWith('#')) { /*    News    */
                let article = news[parseInt(String(answer).charAt(2))]
                // The articles are in HTML format
                article.description = convert(article.description, {
                    wordwrap: 130
                })
                //console.log(article)
                let sentAt = new Date(parseInt(article.createdDate)).toLocaleDateString() //News articles don't have date AND time, only date
                console.log(`\n\nFrom: ${article.authorName}\nSubject: ${article.title}\nSent: ${sentAt}\n\n${article.description}`)
            } else if (String(answer).startsWith('@')) { /*    LoopMail    */
                let mail = loopmails[parseInt(String(answer).charAt(2))]
                // The mail is in HTML format
                let SLmail = {
                    method: 'get',
                    url: `https://${config.get('slDomain')}/mapi/mail_messages?studentID=${config.get('slUser.studentID')}&ID=${mail.ID}`,
                    headers: {
                        'Authorization': `Basic ${config.get('auth')}`
                    }
                }
                let message = await axios(SLmail).then((response) => { return response.data })
                //console.log(message)
                let sentAt = new Date(parseInt(message.date)).toLocaleString()
                message.message = convert(message.message, {
                    wordwrap: 130
                })
                console.log(`\n\nFrom: ${message.sender.name}\nSubject: ${message.subject}\nSent: ${sentAt}\n\n${message.message}`)
            } else if (!isNaN(String(answer).charAt(0))) {  /*    Class Info    */
                //need some ui library for tables/graphs
                answer = parseInt(String(answer).split(' ')[0]) - 2
                let selectedNum = answer
                let SLclass = {
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
                
            } else if (String(answer).startsWith('!')) { /* CLI tool misc */
                if (String(answer) == '! Log Out') {
                    config.clear()
                    
                    console.log('Logged Out, run me a agian with \'schoolloop\'')
                    process.kill(0)
                } else if (String(answer) == '! School Info') {

                    console.log(config.get('SLSchool'))
                
                } else {
                
                    console.log('\n\n\n\n\n\nGoodbye!')
                    process.kill(0)
                
                
                }
            } else { /* Loop back and redraw */
                //do nothing (used for the fillers)
                checkAuth()
            }
            
            const back = new Toggle({
                message: '',
                enabled: ' ',
                disabled: '⟪⟪ Back'
            })
            
            back.run().then(() => { checkAuth() }).catch(console.error);
        })
}
/*
checkAuth flow
Checks if authintacation has been completed before, and if not, run login() then loopback.
*/
function checkAuth() {
    if (config.get('auth')) {
        main()
    } else {
        login()
    }
}
//Start
checkAuth()
