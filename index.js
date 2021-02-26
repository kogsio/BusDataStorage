var path  = require('path');
var fs    = require('fs');
var fetch = require('node-fetch');


// function returns filename based on current time/date
function getFilename(){
  // get date
  var currentdate = new Date();
  var date = currentdate.toLocaleDateString('en-CA');

  // create if directory does not exist
  var dirname = "./"+ date;
  if (!fs.existsSync(dirname)){
      fs.mkdirSync(dirname);
  }

  // get time
  var time = currentdate.toLocaleString("en-US", {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false});
  time = time.replaceAll(':','-');

  // return path and file name
  return (date + '/' + time + '.json');
}

// function requests bus data from MBTA, saves data to file
async function routeData(){
  try{
    var url  = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
    var res  = await fetch(url);
    var data = await res.text();

    // write listings to file
    var filename = getFilename();
    fs.writeFile(filename, data, function(err) {
      if (err) throw err;
      console.log(filename);
    });
  }
  catch(err){
    console.log(err);
  }
 
}
 

// bus request loop
async function run(){

  // request bus data
  await routeData();

  // timer
  setTimeout(run, 30000);

}
run();