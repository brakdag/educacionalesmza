var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/datos', function (req, res) {
  getEducacionales(retorno,res);
});

app.listen(server_port, function () {
  console.log('Servidor corriendo en puerto.' +server_port );
});

function retorno(data,res){
  const tabletojson = require('tabletojson');
  const cheerio = require('cheerio');
  var $ = cheerio.load(data);
  var text = "<table>"+$('#example').html() + "</table>";
  var tablesAsJson = tabletojson.convert(text)[0];
  llamados=tablesAsJson.filter(a=>a[2]=="SAN RAFAEL").filter(a=>a[1]=="Secundario Técnico")
  console.log("cantidad de llamados: " + llamados.length)
  visible = []
  llamados.forEach(element => {visible.push("<td>"+element[8]+ "</td><td>" +element[3] + "</td><td>" + element[13] + "</td>" )});
  console.log(llamados[1])
  var page = "<html><body><table>" 
  visible.forEach(a=>page+="<tr>"+a+"</tr>")
  page+="</table></body></html>"
  res.send(page);
}


function getEducacionales(retorno,res){
  const https = require('http');
  https.get('http://www.mendoza.edu.ar/educacionales/', (resp) => {
  var data = "";
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
   retorno(data,res);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
};

