
/**
let token = os.release(); //School Loop accepts anything as a token if the version param is 3
let devOS = os.type(); //School Loop accepts anything as a devOS if the version param is 3
let year = new Date().getFullYear(); // Current Roster Year 
*/

axios(`https://${domainName}/mapi/login?version=3&devToken=${token}&devOS=${devOS}&year=${year}`, {
  headers: {
  	authorization: `Basic ${base64.encode(`${urlencode(username)}:${urlencode(password)}`)}`, // You must use this for every request, so store it in a var
	}
})

/** Example User  */
let user = {
  "isParent": "false",
  "isUnverifiedParent": "false",
  "fullName": "Last, First",
  "role": "student",
  "email": "user's email",
  "userName": "user's username",
  "acceptedAgreement": "true",
  "hashedPassword": "null",
  "userID": "1234567890123",
  "students": [
		{
      "studentID": "1234567890123", // School Loop's student ID, You'll need this to access everything else
      "name": "Last, First",
      "school": "[Object]", //-> school.json
		}
	],
}