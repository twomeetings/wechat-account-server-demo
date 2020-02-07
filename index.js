const express = require('express')
const crypto = require('crypto')
const app =express()
const port = process.env.PORT || 3000;
const token = 'abcd1234'


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
app.listen(port,()=>console.log('started'))


