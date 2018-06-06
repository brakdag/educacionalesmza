
function retorno(data){
  const tabletojson = require('tabletojson');
  const cheerio = require('cheerio');
  var $ = cheerio.load(data);
  var text = "<table>"+$('#example').html() + "</table>";
  var tablesAsJson = tabletojson.convert(text)[0];
  llamados=tablesAsJson.filter(a=>a[2]=="SAN RAFAEL").filter(a=>a[1]=="Secundario Técnico")
  //console.log("cantidad: " + llamados.length)
  //llamados.forEach(element => {console.log(element[8]+ "|" +element[3] +" | "+ element[13] )});
  superPosicionHoraria(llamados[1][13])
}

horario = {dia:"",hora_inicio:"",hora_fin :""}
function superPosicionHoraria(horarios,mis_horarios)
{
  
  console.log(horarios)
}


function getEducacionales(retorno){
  const https = require('http');
  https.get('http://www.mendoza.edu.ar/educacionales/', (resp) => {
  var data = "";
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
   retorno(data);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
};

function track(){
getEducacionales(retorno);
}
//*[@id="example"]
track();
//setInterval(track,10000);
