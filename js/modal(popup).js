'use strict'

$(document).ready(function(){
	
	const popupBG = document.querySelector('#popup-bg'),
				popupCalcFeedback = popupBG.querySelector('#popup-calc-feedback'),
				popupThanksBye    = popupBG.querySelector('#popup-thanks-bye'),
				popupAll 					= popupBG.querySelectorAll('#popup-bg>div');
	
	//Вешаем на все кнопки с классом .popup-btn функцию показа модального окна
	document.querySelectorAll('.popup-btn').forEach(function(elem){
		elem.onclick = showModal;
	});
	//Вешаем на все кнопки с .show-thanks-bye функцию показа мод.окна с благодарностью за обращение
	document.querySelectorAll('.show-thanks-bye').forEach(function(elem){
		elem.onclick = showThanksBye;
	});
	//Вешаем на все кнопки с классом .popup-close функцию закрытия модального окна (крестик)
	popupBG.querySelectorAll('.popup-close').forEach(function(elem){
			elem.onclick = closeModalWrap;
	});
	//Закрываем модальное окно по нажатию на фон
	popupBG.onclick = function () {
		//Если открыт калькулятор, то для него своя функция закрытия с unslick
		if (popupCalcFeedback.style.display == 'none') {
			closeModalWrap();
		} else {
			closeModalCalc();
		}
	}
	//При этом по нажатию на само модальное окно, оно не должно исчезать
	popupBG.querySelectorAll('.popup-wrap').forEach(function(elem){
			elem.onclick = function(event) {
					event.stopPropagation();   //при клике на modal, теперь останавливается всплытие событий и modal-wrap не исчезнет
			}
	});

	function showModal() {
		popupBG.style.display = 'block';
		let modal = this.dataset.popup;
		
		popupBG.querySelector(modal).style.display = 'block';
		
		document.onkeydown = function (event) {
				if (event.keyCode == 27) closeModalWrap();
		}
	}

	function showThanksBye () {
		for (let elem of popupAll) {
			elem.style.display = 'none';
		}
		popupThanksBye.style.display = 'block';
	}
	
	function closeModalWrap() {
		fadeOut_DisplayNone(popupBG, 200);
		popupBG.querySelectorAll('.popup-wrap').forEach(function(elem){
			fadeOut_DisplayNone(elem, 200);
		});
		document.onkeydown = null;
	}



/*--------------------- #popup-calc-feedback ---------------------*/

	const popupСalc     = popupCalcFeedback.querySelector('#popup-calc'),
				SumValue    	= popupСalc.querySelector('.body-slide-result>p'),
				SumValueSpan  = popupСalc.querySelector('.body-slide-result>p>span'),
				calcPrice     = popupСalc.querySelector('.body-slide-result>.calc-price>span'),
				priceListUl   = popupСalc.querySelector('.body-slide-result>.price-list'),
				priceListUlLi = popupСalc.querySelectorAll('.body-slide-result>.price-list>li'),
				radioWhere 		= popupСalc.querySelectorAll('input[name="calc-where"]'),
				radioHow    	= popupСalc.querySelectorAll('input[name="calc-how"]'),
				radioCrooked 	= popupСalc.querySelectorAll('input[name="calc-crooked"]');
	let lengthArrLi	= priceListUlLi.length;


	/* Вешаем появление модального окна по клику на кнопку, инициализируем  slick-slider в модальном окне и вкладываем function transformResultCalc */ 
	$('.popup-btn-jqwery').on('click', function(event){
		event.preventDefault();
		popupBG.style.display = 'block';
		popupCalcFeedback.style.display = 'block';
		
		/* init Slick-slider for .calc-slider */
		$('.calc-slider').slick({
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			fade: true,
  		//cssEase: 'linear',
			//arrows: false, /* скрытие навигационных кнопок */
			dots: true, /* показ навигационных точек под слайдером */
			nextArrow: '<button class="form-btn button-calc">Далее</button>',
		});
		
		//Находим кнопку листания, созданную слайдером
		const buttonCalc = popupСalc.querySelector('.button-calc');
		
		/* Здесь же вешаем выход черех ESC (внутри функции открытия модального окна) */ 
		document.onkeydown = function (event) {
			if (event.keyCode == 27) {
				closeModalCalc()
				document.onkeydown = null;
			};
		}

		/* Здесь же, пока слайдер активен, Находим событие листания слайдов и сравниваем текущий слайд с необходимым нам значением, далее вешаем функцию, которая меняет значения в слайде в зависимости от результата калькулятора */
		
		$('.calc-slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
			if ($('.calc-slider').slick('slickCurrentSlide') == 3) {
				transformResultCalc();
				buttonCalc.innerText = "Пересчитать"; //change buttonCalc
			};
			if ($('.calc-slider').slick('slickCurrentSlide') != 3) {
				buttonCalc.innerText = "Далее"; //change buttonCalc
			};
		});
		
  }); //.popup-btn-jqwery появление модального окна..

	/* Вешаем выход черех клик на кнопке выхода */ 
	$('.popup-close-jqwery').on('click', function(event){
		event.preventDefault();
		closeModalCalc ();
	});
	
	/* По нажатию на само модальное окно, оно не должно исчезать */
	popupCalcFeedback.onclick = function(event) {
		event.stopPropagation(); //при клике на 'popupCalcFeedback', теперь останавливается всплытие событий и модальное окно не исчезнет
	};
	
	/* Function выхода (display:none) + стираие slick-slider */ 
	function closeModalCalc () {
		$('.calc-slider').slick('unslick');
		fadeOut_DisplayNone(popupBG,200);
		fadeOut_DisplayNone(popupCalcFeedback,200);
		document.onkeydown = null;
	};
	
	/* Function изменения внешнего вида popup-calc при достижении 4-ого слайда */ 
	function transformResultCalc () {
		/* Выводим чекнутые inputs */
		SumValue.innerHTML = checkedValue(radioWhere) + ' + ' + checkedValue(radioHow) + ' + неровность стен&nbsp;' + checkedValue(radioCrooked) + '&nbsp;мм';

		/* change Price */
		if (checkedValue(radioWhere) == 'Москва' && checkedValue(radioCrooked) == '20') {
			calcPrice.innerHTML = '400&nbsp;';
		} else if (checkedValue(radioWhere) == 'Москва' && checkedValue(radioCrooked) == '40') {
			calcPrice.innerHTML = '530&nbsp;';
		} else {
			calcPrice.innerHTML = '600&nbsp;';
		}

		/* change priceList (add/remove li) */
		if (calcPrice.innerHTML == '400&nbsp;') {
			while (lengthArrLi > 3) {
				priceListUlLi[lengthArrLi -1].style.display = 'none';
				lengthArrLi--;
			}
		} else if (calcPrice.innerHTML == '530&nbsp;') {
			while (lengthArrLi > 4) {
				priceListUlLi[lengthArrLi -1].style.display = 'none';
				lengthArrLi--;
			}
			while (lengthArrLi < 4) {
				priceListUlLi[lengthArrLi].style.display = 'block';
				lengthArrLi++;
			}
		} else {
			while (lengthArrLi < 5) {
				priceListUlLi[lengthArrLi].style.display = 'block';
				lengthArrLi++;
			}
		}
		
	}
	
	
	
	
/*--------------------- ajax ---------------------*/

		
//$('form').submit(function(event) {
//	event.preventDefault();
//	console.log($('form'));
	
//	ajax('php/mailer/smart.php', 'POST', f1, requestData(a));
	
//	$.ajax({
//		type: "POST",
//		url: "php/mailer/smart.php",
//		data: $(this).serialize()
//	}).done(function() {
//		$(this).find("input").val("");
//		alert("Сообщение успешно отправлено");
//		$("form").trigger("reset");
//	});
//	return false;
//});
	
	
	
	
	/*--------------------- Общие functions ---------------------*/
	
	/* Считываем чекнутые inputs */
	function checkedValue(elements) {
		for (let elem of elements) {
			if (elem.checked) {
				return elem.value;
			}
		}
	}
	
	/* Плавное закрытие (модального окна например) */
	function fadeOut_DisplayNone(Node, time) {
		Node.classList.add('fadeOut'); //добавляем класс с анимацией
		setTimeout(function(){
			Node.style.display = 'none';
			Node.classList.remove('fadeOut'); //удаляем класс с анимацией, для последующего вызова без проблем
		},time); // 200 = .2s - задано такое же время, как у анимации
	}
	
	
	
	
//		console.log(checkedValue(radioWhere));
//		console.log(checkedValue(radioHow));
//		console.log(checkedValue(radioCrooked));
	
}); /* //$(document).ready... */


/* как узнать какое событие срабатывает и на каком объекте */
//		calcSlidrer.addEventListener('click', {
//			handleEvent(event) {
//				console.log(event.type + " на " + event.currentTarget);
//			}
//		});















