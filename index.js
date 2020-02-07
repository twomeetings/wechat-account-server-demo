const express = require('express')
const crypto = require('crypto')
const fetch = require('node-fetch')
const app =express()
const port = process.env.PORT || 3000;
const token = 'abcd1234'
const appID = 'wx511c82e7173ec7df'
const appsecret = '19ea522e5926127b01b805da6a1890dd'



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

app.get('/access_token', async (req, res)=>{
    const res = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`)
    const json = res.json()
    console.log('==== json:' , json)
    res.send(json)
})
app.listen(port,()=>console.log('started'))


