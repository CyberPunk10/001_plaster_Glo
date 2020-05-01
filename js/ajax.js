'use strist'

function ajax(url, method, functionAfterAnswer, dataForServer) {
	
	let xhttp = new XMLHttpRequest();
	xhttp.open(method, url);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(dataForServer);
	
	xhttp.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
			functionAfterAnswer(this);
		}
	}
}

// пример данных, которые нужно отправить на сервер
let dataFS = {
	name : "Ekaterina",
	"age"  : "21"
	
}

// функция преобразовывает данные из объекта в строку, подготавливая их к отправке на сервер
function dataForString(dataObj) { // Эта функция может не подойти, поэтому пиши свою или пользуйся function serialize(form); 
	let out = '';
	for (let key in dataObj) {
		out += encodeURIComponent(`${key}`) + "=" + encodeURIComponent(`${dataObj[key]}`) + `&`; //encodeURIComponent - преобразует пробелы в %20..
	}
	return out;
}

//name=mr.%20Gold&age=21&

//ajax('php/mailer/smart.php', 'POST', resultServer, dataForString(dataFS));

// функция, которая делает что-нибудь с полученными от сервера данными и на основе них.
function resultServer(data){
	//console.log(data);
}



//var r = new XMLHttpRequest();
//r.open("POST", "path/to/api", true);
//r.onreadystatechange = function () {
//  if (r.readyState != 4 || r.status != 200) return;
//  alert("Success: " + r.responseText);
//};
//r.send("banana=yellow");