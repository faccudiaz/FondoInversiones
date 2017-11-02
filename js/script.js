$( document ).ready(function() {

	var items;
	$.getJSON( "json/convertcsv.json", function(data) {
	 	initDataGeneration(data, 0, 5);
	 	var roundResult = getAllPagination(data.length);
	 	generateAllPagination(roundResult);
		pagination(data);
		addCurrency();
		getTotalGananciaHistorica(data);
		getTotalPerdidaHistorica(data);

		//var results = jsonResultsByPropertie(data, "Fecha");
		//var fechas = getFecha(results);
		//getGananciaNetaPorMes(data, 10);
	});

	//Genera los datos iniciales en el Resumen total con paginado
	function initDataGenerationLastDay(data, desde, hasta){
		var properties = Object.keys(data[0]);
		var length = data.length;
		for (var j = length-1; j <= length; j++) {
			var currentPropertie = properties[j];
			jsonResultsRowsByPropertie(data, currentPropertie, desde, hasta);
		}
	}

	//Genera los datos iniciales en el Resumen total con paginado
	function initDataGeneration(data, desde, hasta){
		var properties = Object.keys(data[0]);
		for (var j = 0; j < properties.length; j++) {
			var currentPropertie = properties[j];
			jsonResultsRowsByPropertie(data, currentPropertie, desde, hasta);
		}
	}

	function getGananciaSemanal(data){
		var gananciaNetaSemanal = 0;
		var currentWeek = Number($(".pagination").find(".currentLinkDisabled").html());
		var desde = 1*currentWeek;
		var hasta = 5*currentWeek;
		for (var i = desde; i < hasta; i++) {
			var ob = data[i];
			var gananciaOb = (ob["Ganancia"]);
			var gananciaNumber = Number(gananciaOb.replace(/[^0-9\.-]+/g,""));
			gananciaNetaSemanal = +gananciaNetaSemanal + +gananciaNumber;
		}
		//return gananciaNetaSemanal;
		console.log("gananciaNetaSemanal: " + gananciaNetaSemanal);
	}

	function getGananciaNetaPorMes(data, mesGanancia){
		var properties = Object.keys(data[0]);
		var resultsMes = [];
		var propertie = "Fecha";
		var gananciaNetaMes = 0;
		for (var i = 0; i < data.length; i++) {
			var ob = data[i];
			var fecha = (ob[propertie]);
			var mes = getMonthFecha(fecha);
			var gananciaOb = (ob["Ganancia"]);
			var gananciaNumber = Number(gananciaOb.replace(/[^0-9\.-]+/g,""));
			if (Number(mes) == mesGanancia) {
				gananciaNetaMes = +gananciaNetaMes + +gananciaNumber;
				resultsMes.push(data[i]);
			}
		}
		console.log(gananciaNetaMes);
	}

	function getMonthFecha(fecha){
		var currentFecha = fecha;
		var fields = currentFecha.split('/');
		var dia = fields[0];
		var mes = fields[1];
		var anio = fields[2];
		return mes;
	}
	

	function getTotalGananciaHistorica(data){
		var results = jsonResultsByPropertie(data, "Ganancia");
		var gananciaTotal = 0;
		for (var i = 0; i < results.length; i++) {
			var number = Number(results[i].replace(/[^0-9\.-]+/g,""));
			if (number > 0) {
				gananciaTotal = +gananciaTotal + +number;
			}
		}
		//console.log("Total Ganancia historica: " + gananciaTotal);
	}

	function getTotalPerdidaHistorica(data){
		var results = jsonResultsByPropertie(data, "Ganancia");
		var perdidaTotal = 0;
		for (var i = 0; i < results.length; i++) {
			var number = Number(results[i].replace(/[^0-9\.-]+/g,""));
			if (number < 0) {
				//var x = +y + +z;
				perdidaTotal = +perdidaTotal + +number;
			}
		}
		//console.log("Total Perdida historica: " + perdidaTotal);
	}

	//devuelve la cantidad de resultados del json de la propertie solicitada
	function jsonResultsRowsByPropertie(data, propertie, desde, hasta){			
		var divPropertie = "listaJson"+propertie;
		$("#"+divPropertie).empty();
		for (var i = desde; i < hasta; i++) {
			var ob = data[i];
			var valPropertie = (ob[propertie]);
  			if (isEmpty(valPropertie)) {
				valPropertie = "---";
			}
			if (propertie==="Ganancia") {;
				var number = Number(valPropertie.replace(/[^0-9\.-]+/g,""));
				var gananciaPos = jsonResultsGananciaPosit(number);
				var arrow = "<li><span><i class='fa fa-arrow-circle-down' style='text-align: center; color: red;''></i></span></li>";
				if (gananciaPos) {
					arrow = "<li><span><i class='fa fa-arrow-circle-up' style='text-align: center; color: green''></i></span></li>";
				}
				$("#listaJsonStatus").append(arrow);
			}
			$("#"+divPropertie).append('<li>'+valPropertie+'</li>');
    	}
    	getGananciaSemanal(data);

	}

	//devuelve todos los resultados del json de la propertie solicitada
	function jsonResultsByPropertie(data, propertie){
		var results = [];
		for (var i = 0; i < data.length; i++) {
			var ob = data[i]; 
			var valPropertie = (ob[propertie]);
			if (isEmpty(valPropertie)) {
				valPropertie = "---";	
			}
			//console.log(valPropertie);
			results.push(valPropertie);
			//console.log(results.length);//$("#listaJson").append('<li>'+valPropertie+'</li>');		
		}
		return results;
	}
	//devuelve todos los datos
	function jsonResults(data){			
		for (var i = 0; i < data.length; i++) {
			var ob = data[i]; 
			//Properties de todos los objetos
			var properties = Object.keys(data[0]);
			for (var j = 0; j < properties.length; j++) {
				/*var currentPropertie = properties[j];
				var $newdiv1 = $( "<ul class='list-inline object" + i + "'></ul>" );
	  			var newdiv2 = document.createElement( "li" );
	  			var valCurrentPropertie = (ob[currentPropertie]);
	 			$("#jsonRes").append( $newdiv1, [ newdiv2, valCurrentPropertie ] );
				//console.log(ob);
				console.log(ob[currentPropertie]);*/
				var currentPropertie = properties[j];
				var valCurrentPropertie = (ob[currentPropertie]);
				if (isEmpty(valCurrentPropertie)) {
					valCurrentPropertie = "---";
				}
				$("#listaJson").append('<li>'+valCurrentPropertie+'</li>');		
			}
		}
	}

	//Obtiene la cantidad de buttons
	function getAllPagination(length){
		var result = length/5;
		var roundResult = Math.ceil(result);
		return roundResult;
	}
	//Genera el HTML en el pagination nav
	function generateAllPagination(hasta){
		for(var i = hasta; i > 1; i--){
			$("#firstTabMenu").after('<li class="page-item"><a class="page-link" href="#">'+i+'</a></li>')
		}
	}

	//Lógica del paginado
	function pagination(data){
		$( ".page-link" ).click(function(e) {
			
			//if (!($(this).html()==="Previous")) {
				e.preventDefault();
				var previousButtonSelected = $(".disabled a").html();
				var nextButtonDisabled = Number(previousButtonSelected)+2;
				var nextButtonNumber = Number(previousButtonSelected)+1;
				var currentButtonSelected = $(this).html();
				var currentButtonSelectedNum = Number(currentButtonSelected);
				$(".pagination").children().removeClass("disabled");
				$( '.pagination li:nth-child('+nextButtonNumber+')').children().removeClass("currentLinkDisabled");
				$(".pagination").children().css({ 'background-color' : '', 'opacity' : '' });
				$(this).parent().addClass("disabled");
				
				var button = ($(this).html());
				var desde = 1;
				var hasta = 5;
				var totalItemsMenu = getAllPagination(data.length);
				if (button==="Next"){
					desde = previousButtonSelected * 5;
					hasta = (hasta*previousButtonSelected)+5;
					$(".pagination").children().removeClass("disabled");
					$( '.pagination li:nth-child('+nextButtonDisabled+')').addClass("disabled currentLinkDisabled");
					$( '.pagination li:nth-child('+nextButtonDisabled+')').children().addClass("currentLinkDisabled");
					$(".pagination li:first-child a").removeClass("maxMinItemBlocked");
					$(".pagination li:first-child").addClass("active");
					$(".pagination li:first-child a").removeClass("notClickeable");
					if (Number(previousButtonSelected) == totalItemsMenu-1) {
						$(".pagination li:last-child a").addClass("maxMinItemBlocked");
						$(".pagination li:last-child").removeClass("active");
						$(".pagination li:first-child a").removeClass("maxMinItemBlocked");
						$(".pagination li:first-child").addClass("active");
						$(".pagination li:last-child a").addClass("notClickeable");
					}
					//obtiene el 4to elemento(el 5)$(".currentLinkDisabled").eq(4);
				}else if(button==="Previous"){
					desde = (previousButtonSelected-2)*5;
					hasta = (previousButtonSelected-1)*5;
					
					$(".pagination").children().removeClass("disabled");
					$( '.pagination li:nth-child('+previousButtonSelected+')').addClass("disabled currentLinkDisabled");
					$( '.pagination li:nth-child('+previousButtonSelected+')').children().addClass("currentLinkDisabled");
					$(".pagination li:last-child a").removeClass("maxMinItemBlocked");
					$(".pagination li:last-child").addClass("active");
					$(".pagination li:first-child").attr("disabled", true);
					$(".pagination li:last-child a").removeClass("notClickeable");
					if (previousButtonSelected == 2) {
						$(".pagination li:first-child a").addClass("maxMinItemBlocked");
						$(".pagination li:first-child").removeClass("active");
						$(".pagination li:last-child a").removeClass("maxMinItemBlocked");
						$(".pagination li:last-child").addClass("active");
						$(".pagination li:first-child a").addClass("notClickeable");
						
						//$('.pagination li:first-child a').unbind("click");
						//e.preventDefault();

					}
				}else{
					desde = ((desde * button) - 1)*5;
					hasta = button * 5;
					
					if (currentButtonSelectedNum == 1) {
						$(".pagination li:first-child a").addClass("maxMinItemBlocked");
						$(".pagination li:first-child").removeClass("active");
						$(".pagination li:last-child a").removeClass("maxMinItemBlocked");
						$(".pagination li:last-child").addClass("active");
						$(".pagination li:first-child a").addClass("notClickeable");
						//$( "div span:first-child" ).css( "text-decoration", "underline" );
					}else if(currentButtonSelectedNum == totalItemsMenu){
						$(".pagination li:last-child a").addClass("maxMinItemBlocked");
						$(".pagination li:last-child").removeClass("active");
						$(".pagination li:first-child a").removeClass("maxMinItemBlocked");
						$(".pagination li:first-child").addClass("active");
						$(".pagination li:last-child a").addClass("notClickeable");
					}else{
						$(".pagination li:first-child").addClass("active");
						$(".pagination li:last-child").addClass("active");
						$(".pagination li:first-child a").removeClass("maxMinItemBlocked");
						$(".pagination li:last-child a").removeClass("maxMinItemBlocked");
						$(".pagination li:first-child a").removeClass("notClickeable");
						$(".pagination li:last-child a").removeClass("notClickeable");
					}
				}
				//Perdida de foco buttons pagination
				$(".pagination li a").blur();
				//$(".pagination li:first-child a").blur();
				//$(".pagination li:last-child a").blur();
			  	var properties = Object.keys(data[0]);
			  	$("#listaJsonStatus").empty();
			  	
			  	//CAMBIAR ESTO VALIDAR QUE NO SEA MAYOR QUE LA CANTIDAD DE OBJETOS EN EL ARRAY
			  	if(hasta>data.length){
			  		hasta = data.length;
			  	}
			  	for (var j = 0; j < properties.length; j++) {
					var currentPropertie = properties[j];
					jsonResultsRowsByPropertie(data, currentPropertie, desde, hasta);
				}
				$(".pagination li:first-child a").focusout();
				addCurrency();
			//}
			
		});
	}

	function checkIfMaxMinItemPagination(){

	}

	function addCurrency(){
		$('#listaJsonCapital li').each(function(i){
			$(this).addClass('enMoney'); // This is your rel value
		});
		$('#listaJsonGanancia li').each(function(i){
			$(this).addClass('enMoney'); // This is your rel value
		});
	}

	function isEmpty(value) {
   		return (!value || 0 === value.length);
	}

	function jsonResultsGananciaPosit(ganancia){
		var result = false;
		if (ganancia > 0) {
			result = true;
		}
		return result;
	}

});