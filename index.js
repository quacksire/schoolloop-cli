#!/usr/bin/env node


//https://github.com/saagarjha/break/blob/e6bfd63cab1f5517cc622794149deae9cb0bee4e/break/SchoolLoop/SchoolLoopConstants.swift

const sl = require('./school-loop')

var urlencode = require('urlencode');
let auth = `${urlencode('sjeffs24')}:${urlencode('jef228sc')}`

//sl.schoolList().then(console.log)

//sl.user('hmbhs.schoolloop.com', auth).then((response) => { console.log(response.data.students)  })

//sl.courses('hmbhs.schoolloop.com', '1593846838236', auth).then((response) => { console.log(response.data) })

sl.grade('hmbhs.schoolloop.com', '1593846838236', '1593846839201', auth).then((response) => { console.log(response.data[0].trendScores)})