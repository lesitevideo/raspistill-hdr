var Camera = require("camerapi");
var cam = new Camera();
cam.baseFolder('/home/pi/pics');

const { exec } = require('child_process');

var brackets_array = ['-10','0','10'];
var files = [];
var index = 0;

function hdr_do() {
	if( index > brackets_array.length-1 ){
		end();
	} else {
		var br = brackets_array[index];
		console.log(br);

		cam.prepare({
			"ev" : br,
			//"ISO" : 125,
			//"awb": "auto",
			"quality" : 95,
			"vflip" : "--vflip"
		}).takePicture( index + ".jpg",callback);
		index++;
	}
}

function callback(file,error){
	console.log('done ',file);
	files.push(file);
	hdr_do();
}

function end(){
	//console.log('fini : ', files);
	index = 0;
	enfuseFiles( files );
	return false;
}

function enfuseFiles( enfuse_files ){
	
	var enfuseF = enfuse_files.join(' ');
	console.log('enfusing ', enfuseF );
	
	exec('enfuse -o ./blended.jpg ' + enfuseF, (error, stdout, stderr) => {
	if (error) {
		console.error(`exec error: ${error}`);
		return;
	}
		console.log('enfuse done');
		//console.log(`stdout: ${stdout}`);
		//console.log(`stderr: ${stderr}`);
	});
}


hdr_do();