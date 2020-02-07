const express = require('express')
const crypto = require('crypto')
const fetch = require('node-fetch')
const morgan=require('morgan')
const app =express()
const port = process.env.PORT || 3000;
const token = 'abcd1234'
const appID = 'wx511c82e7173ec7df'
const appsecret = '19ea522e5926127b01b805da6a1890dd'

let access_token =''

app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'))

app.get('/',(req,res)=>{
    console.log('req:', req)
    console.log('res:', res)
    const { signature, timestamp, nonce, echostr } = req.query
    const array = [token , timestamp, nonce]
    array.sort()

    const tempStr = array.join('')
    const hashCode = crypto.createHash('sha1')
    const resultCode = hashCode.update(tempStr,'utf8').digest('hex')

    if(resultCode===signature){
        res.send(echostr)
    } else{
        res.send('mismatch')
    }
})

app.get('/access_token',(req, res)=>{
    fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`)
    .then(response => response.json())
    .then(json => {        
        console.log('=== json:', json)
        console.log('check nodemon works')
        access_token=json.access_token
        res.send(json)
    })
})

app.get('/getMenuItems', (req, res)=>{
    fetch(`https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${access_token}`)
    .then(response=>response.json())
    .then(json=>{
        console.log('=== json:', json)
        res.send(json)
    })
})

app.post('/updateMenuItems', (req, res)=>{
    const body = JSON.stringify(req.body)
    console.log('== body', body)
    fetch(` https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`,{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then(r=>{
        res.send('success')
        console.log('response', r)
    }).catch(err=>{
        console.log('err', err)
        res.send(err)
    })

})

app.listen(port,()=>{
    console.log(`started: http://localhost:${port}`)
})


