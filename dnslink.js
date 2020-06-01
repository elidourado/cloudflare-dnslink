const core = require('@actions/core');
var cf = require('cloudflare')({
    token: process.env.CLOUDFLARE_TOKEN.toString()
});

zoneid = "";
recordid = "";
zone = core.getInput('zone');
record = core.getInput('record');
hash = core.getInput('hash');
content = "dnslink=/ipfs/" + hash;
hostname = record + '.' + zone;

function update() {
    cf.zones.browse().then(function (resp){
        resp.result.forEach(function(element) {
            if (element.name == zone) {
                zoneid = element.id;
            }
        });

        cf.dnsRecords.browse(zoneid).then(function (resp){
            resp.result.forEach(function(element) {
                if (element.name == hostname) {
                    recordid = element.id;
                }
            });

            cf.dnsRecords.edit(zoneid, recordid, {"type": "TXT", "name": hostname, "content": content }).then(function (resp) {
                console.log(resp);
            }).catch((err) => {
                console.log(err);
                process.exit(1);
            });
            
        }).catch((err) => {
            console.log(err);
            process.exit(1);
        });
    
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });
}

update();