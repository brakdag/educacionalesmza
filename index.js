var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var express = require('express');
var app = express();


app.get('/', function (req, res) {
  res.send('Servidor Funcionando!');
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
  //console.log(tablesAsJson);
  llamados=tablesAsJson.filter(a=>a[2]=="SAN RAFAEL").filter(a=>a[1]=="Secundario Técnico")
  visible = []
  llamados.forEach(element => {visible.push("<td>"+element[8]+ "</td><td>" +element[3] + "</td><td>" )});
  var page = `<html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  </head><body><div class="container"><table class="table">` 
  visible.forEach((a,i)=>page+="<tr>"+a+`<td><button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal${i}">Detalle</button></td></tr>`)
  page+="</table></div>"
  visible.forEach((a,i)=>page+=`
  <div id="myModal${i}" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">${llamados[i][8] + " | " + llamados[i][3]}</h4>
        </div>
        <div class="modal-body">
         <table class="table">
         <tr><td>Materia</td><td>Artículo:${llamados[i][11]} ${getArt(llamados[i][11])}</td></tr> 
         <tr><td>Año y división</td><td>${llamados[i][12]}</td></tr>
          <tr><td>Horario</td><td>${llamados[i][13]}</td></tr>
          <tr><td>Fecha del Llamado</td><td>${llamados[i][9]}</td></tr>
          <tr><td>Razón</td><td>${llamados[i][5]}</td></tr>
          <tr><td>Cantidad de horas</td><td>${llamados[i][6]}-${llamados[i][4]} de zona.</td></tr>
          <tr><td>Turno</td><td>${llamados[i][7]}</td></tr>
          <tr><td>Dirección</td><td>${llamados[i][10]}</td></tr>
          <tr><td>Prioridad</td><td>${llamados[i][15]}</td></tr>
          <tr><td>Observaciones</td><td>${llamados[i][17]}</td></tr>
          <tr><td><td><td>${llamados[i][16]} ${llamados[i][18]} ${llamados[i][19]} ${llamados[i][20]}</td></tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`);
  page+="</body></html>"

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
}

function getArt(n){
  var r = "desconocido";
  n= n.split`-`[0];
  switch(n)
  {
    case "38": r= "Licencia no gozada."; break;
    case "40": r= "Enfermedad."; break;
    case "44": r= "ART indefinido accidente.";break;
    case "50": r= "Razones sociales pocos dias máximo 15";break;
    case "52": r= "licencia sin goce de haberes max 1 año";break;
    case "53": r= "Curso de perfecionamiento maximo 6 meses";break;
    case "54": r= "Maternidad maximo 3 meses";break;
    case "61": r= "Mayor Jerarquía";break;
    case "62": r= "Gremial";break;
     }
  return r;
}