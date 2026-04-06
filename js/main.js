function fade($ele) {
  $ele.fadeIn(1000).delay(3000).fadeOut(1000, function () {
    var $next = $(this).next('.quote');
    fade($next.length > 0 ? $next : $(this).parent().children().first());
  });
}
fade($('.quoteLoop > .quote').first());


/*----------------------------------------------------*/
/* Navigation
------------------------------------------------------ */

$(window).scroll(function () {

  if ($(window).scrollTop() > 300) {
    $('.main_nav').addClass('sticky');

  } else {
    $('.main_nav').removeClass('sticky');
  }
});

// Mobile Navigation
$('.mobile-toggle').click(function () {
  if ($('.main_nav').hasClass('open-nav')) {
    $('.main_nav').removeClass('open-nav');
  } else {
    $('.main_nav').addClass('open-nav');
  }
});

$('.main_nav li a').click(function () {
  if ($('.main_nav').hasClass('open-nav')) {
    $('.navigation').removeClass('open-nav');
    $('.main_nav').removeClass('open-nav');
  }
});


/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

jQuery(document).ready(function ($) {

  $('.smoothscroll').on('click', function (e) {
    e.preventDefault();

    var target = this.hash,
      $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 800, 'swing', function () {
      window.location.hash = target;
    });
  });

});


TweenMax.staggerFrom(".heading", 0.8, {
  opacity: 0,
  y: 20,
  delay: 0.2
}, 0.4);

function fade($ele) {
  $ele.fadeIn(1000).delay(3000).fadeOut(1000, function () {
    var $next = $(this).next('.quote');
    fade($next.length > 0 ? $next : $(this).parent().children().first());
  });
}
fade($('.quoteLoop > .quote').first());


/*----------------------------------------------------*/
/* Navigation
------------------------------------------------------ */
$(window).scroll(function () {

  if ($(window).scrollTop() > 150) {
    $('.main_nav').addClass('sticky');
    $('.title-category').hide();
  } else {
    $('.main_nav').removeClass('sticky');
    $('.title-category').show();
  }
});

$(window).scroll(function () {

  if ($(window).scrollTop() > 300) {
    $('.main_nav').addClass('sticky');
  } else {
    $('.main_nav').removeClass('sticky');
  }
});
// Mobile Navigation
$('.mobile-toggle').click(function () {
  if ($('.main_nav').hasClass('open-nav')) {
    $('.main_nav').removeClass('open-nav');
  } else {
    $('.main_nav').addClass('open-nav');
  }
});

$('.main_nav li a').click(function () {
  if ($('.main_nav').hasClass('open-nav')) {
    $('.navigation').removeClass('open-nav');
    $('.main_nav').removeClass('open-nav');
  }
});


/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

jQuery(document).ready(function ($) {

  $('.smoothscroll').on('click', function (e) {
    e.preventDefault();

    var target = this.hash,
      $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 800, 'swing', function () {
      window.location.hash = target;
    });
  });

});


TweenMax.staggerFrom(".heading", 0.8, {
  opacity: 0,
  y: 20,
  delay: 0.2
}, 0.4);

function fade($ele) {
  $ele.fadeIn(1000).delay(3000).fadeOut(1000, function () {
    var $next = $(this).next('.quote');
    fade($next.length > 0 ? $next : $(this).parent().children().first());
  });
}
fade($('.quoteLoop > .quote').first());


/*----------------------------------------------------*/
/* Navigation
------------------------------------------------------ */

$(window).scroll(function () {

  if ($(window).scrollTop() > 300) {
    $('.main_nav').addClass('sticky');
  } else {
    $('.main_nav').removeClass('sticky');
  }
});

// Mobile Navigation
$('.mobile-toggle').click(function () {
  if ($('.main_nav').hasClass('open-nav')) {
    $('.main_nav').removeClass('open-nav');
  } else {
    $('.main_nav').addClass('open-nav');
  }
});

$('.main_nav li a').click(function () {
  if ($('.main_nav').hasClass('open-nav')) {
    $('.navigation').removeClass('open-nav');
    $('.main_nav').removeClass('open-nav');
  }
});


/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

jQuery(document).ready(function ($) {

  $('.smoothscroll').on('click', function (e) {
    e.preventDefault();

    var target = this.hash,
      $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 800, 'swing', function () {
      window.location.hash = target;
    });
  });

});


TweenMax.staggerFrom(".heading", 0.8, {
  opacity: 0,
  y: 20,
  delay: 0.2
}, 0.4); // JavaScript Document

$(document).ready(function () {
  /*----------------------------------------------------*/
  /* Quote Loop
  ------------------------------------------------------ */

  function fade($ele) {
    $ele.fadeIn(1000).delay(3000).fadeOut(1000, function () {
      var $next = $(this).next('.quote');
      fade($next.length > 0 ? $next : $(this).parent().children().first());
    });
  }
  fade($('.quoteLoop > .quote').first());


  /*----------------------------------------------------*/
  /* Navigation
  ------------------------------------------------------ */

  $(window).scroll(function () {

    if ($(window).scrollTop() > 300) {
      $('.main_nav').addClass('sticky');
      $('.title').hide();
    } else {
      $('.main_nav').removeClass('sticky');
      $('.title').show();
    }
  });

  // Mobile Navigation
  $('.mobile-toggle').click(function () {
    if ($('.main_nav').hasClass('open-nav')) {
      $('.main_nav').removeClass('open-nav');
    } else {
      $('.main_nav').addClass('open-nav');
    }
  });

  $('.main_nav li a').click(function () {
    if ($('.main_nav').hasClass('open-nav')) {
      $('.navigation').removeClass('open-nav');
      $('.main_nav').removeClass('open-nav');
    }
  });


  /*----------------------------------------------------*/
  /* Smooth Scrolling
  ------------------------------------------------------ */

  jQuery(document).ready(function ($) {

    $('.smoothscroll').on('click', function (e) {
      e.preventDefault();

      var target = this.hash,
        $target = $(target);

      $('html, body').stop().animate({
        'scrollTop': $target.offset().top
      }, 800, 'swing', function () {
        window.location.hash = target;
      });
    });


  });


  TweenMax.staggerFrom(".heading", 0.8, {
    opacity: 0,
    y: 20,
    delay: 0.2
  }, 0.4);

});

//synopsys page teamplate workflow card functions
$(document).ready(function () {
  var zindex = 10;

  $("div.card").click(function (e) {
    e.preventDefault();

    var isShowing = false;

    if ($(this).hasClass("show")) {
      isShowing = true
    }

    if ($("div.cards").hasClass("showing")) {
      // a card is already in view
      $("div.card.show")
        .removeClass("show");

      if (isShowing) {
        // this card was showing - reset the grid
        $("div.cards")
          .removeClass("showing");
      } else {
        // this card isn't showing - get in with it
        $(this)
          .css({
            zIndex: zindex
          })
          .addClass("show");

      }

      zindex++;

    } else {
      // no cards in view
      $("div.cards")
        .addClass("showing");
      $(this)
        .css({
          zIndex: zindex
        })
        .addClass("show");

      zindex++;
    }

  });
});


$(document).ready(function () {
  $("figcaption").find("h4").replaceWith(function () {
    return $("<h5 />").append($(this).contents());
  });
  $(".h2-left-aligned").find("a").removeAttr("href").css({
    "cursor": "not-allowed",
    "pointer-events": "none"
  });
$(".device:gt(0)" ).css("transform", "scale(1)");
});
