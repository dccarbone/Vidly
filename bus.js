const needle = require('needle');
const express = require('express')


function getApiCredential(token){
    return new Promise((resolve, reject) => {
        needle.post('http://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token='+token,'', (err, response) => {
            if(err) reject(err)

            resolve(response.cookies.apiCredentials)
            
        })
    })
}

async function showBuses(){
    let cred = await getApiCredential(process.env.SPTRANS_TOKEN)
    let buses = await getBuses(cred, '160010007')
    console.log(buses)

}

showBuses()

        

function getBuses(cred, paradaId){
    return new Promise((resolve, reject) => {
        let buses = [];

        const options = {
            cookies: { 'apiCredentials': cred  }
        }

        needle.get("http://api.olhovivo.sptrans.com.br/v2.1/Previsao/Parada?codigoParada="+paradaId, options, function(e, r, body){
            if(e) reject(e)

            let busList = body.p.l
            busList.map(bus => {
                
                buses.push({
                    c: bus.c,
                    l: (bus.sl === 1) ? bus.lt0 : bus.lt1,
                    t: bus.vs.map(b => b.t)
                })
            })
            resolve(buses)
        })
    })
}



