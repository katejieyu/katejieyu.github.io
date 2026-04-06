// JavaScript Document


const handlePrint = () => window.print();


$( document ).ready(function() {
$(".hover").mouseleave(
    function () {
      $(this).removeClass("hover");
    }
  );
	
	
	$(window).scroll(function () {

	if ($(window).scrollTop() > 10) {
		$('.main_nav_resume').addClass('sticky');

	} else {
		$('.main_nav_resume').removeClass('sticky');
	}
});

$('.mobile-toggle').click(function () {
	if ($('.main_nav_resume').hasClass('open-nav')) {
		$('.main_nav_resume').removeClass('open-nav');
	} else {
		$('.main_nav_resume').addClass('open-nav');
	}
});

$('.main_nav_resume li a').click(function () {
	if ($('.main_nav_resume').hasClass('open-nav')) {
		$('.navigation').removeClass('open-nav');
		$('.main_nav_resume').removeClass('open-nav');
	}
});



$(window).scroll(function () {

	if ($(window).scrollTop() > 10) {
		$('.main_nav_resume').addClass('sticky');
	} else {
		$('.main_nav_resume').removeClass('sticky');
	}
});



$('.mobile-toggle').click(function () {
	if ($('.main_nav_resume').hasClass('open-nav')) {
		$('.main_nav_resume').removeClass('open-nav');
	} else {
		$('.main_nav_resume').addClass('open-nav');
	}
});

$('.main_nav li a').click(function () {
	if ($('.main_nav_resume').hasClass('open-nav')) {
		$('.navigation').removeClass('open-nav');
		$('.main_nav_resume').removeClass('open-nav');
	}
});

	$(window).scroll(function () {

		if ($(window).scrollTop() > 10) {
			$('.main_nav_resume').addClass('sticky');
			$('.title').hide();
		} else {
			$('.main_nav_resume').removeClass('sticky');
			$('.title').show();
		}
	});

	// Mobile Navigation
	$('.mobile-toggle').click(function () {
		if ($('.main_nav_resume').hasClass('open-nav')) {
			$('.main_nav_resume').removeClass('open-nav');
		} else {
			$('.main_nav_resume').addClass('open-nav');
		}
	});

	$('.main_nav_resume li a').click(function () {
		if ($('.main_nav_resume').hasClass('open-nav')) {
			$('.navigation').removeClass('open-nav');
			$('.main_nav_resume').removeClass('open-nav');
		}
	});
$(window).scroll(function () {

		if ($(window).scrollTop() > 10) {
			$('.main_nav_resume').addClass('sticky');
			$('.title-category').hide();
		} else {
			$('.main_nav_resume').removeClass('sticky');
			$('.title-category').show();
		}
	});

var $text = jQuery(".quoteText");
var $p = jQuery(".show-more");

$p.on("click", function(){
    $text.toggleClass("is-expanded");

    if($text.hasClass("is-expanded")){
        $p.text("Show less");
    } else {
        $p.text("Show more");
    }
});	
	});


//Image Magnifier Glass
function magnify(imgID, zoom) {
  var img, glass, w, h, bw;
  img = document.getElementById(imgID);
  /*create magnifier glass:*/
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");
  /*insert magnifier glass:*/
  img.parentElement.insertBefore(glass, img);
  /*set background properties for the magnifier glass:*/
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
  bw = 2;
  w = glass.offsetWidth / 1;
  h = glass.offsetHeight / 1;
  /*execute a function when someone moves the magnifier glass over the image:*/
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);
  /*and also for touch screens:*/
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);
  function moveMagnifier(e) {
    var pos, x, y;
    /*prevent any other actions that may occur when moving over the image*/
    e.preventDefault();
    /*get the cursor's x and y positions:*/
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    /*prevent the magnifier glass from being positioned outside the image:*/
    if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
    if (x < w / zoom) {x = w / zoom;}
    if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
    if (y < h / zoom) {y = h / zoom;}
    /*set the position of the magnifier glass:*/
    glass.style.left = (x - w) + "px";
    glass.style.top = (y - h) + "px";
    /*display what the magnifier glass "sees":*/
    glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
  }
  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}


//Icon Animation Function	  
function openfolder() {
  var a;
  a = document.getElementById("openFolder");
  a.innerHTML = "&#xf114;";
  setTimeout(function () {
      a.innerHTML = "&#xf115;";
    }, 1000);
}
openfolder();
setInterval(openfolder, 2000);


