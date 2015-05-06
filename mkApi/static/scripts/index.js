$(document).ready(function () {
    var $controls = $('.slider-controls .control');
    var mySlider = new Revolver({
        containerSelector: '.slider',
        slidesSelector: '.slide',
        transition: {
            name: 'fade' // <-- use custom transition
        }
    });

    $controls.on('click', function (e) {
        e.preventDefault();

        var $el = $(this);
        var method = $el.data('method');
        var argument = $el.data('argument');

        mySlider[method](argument);
    });

    mySlider.on('transitionStart', function () {
        $controls.removeClass('active');
        $controls.filter('[data-argument='+this.currentSlide+']').addClass('active');
    });

    $('.this-animate').each(function () {
        $(this).appear(function () {
            $(this)
                .addClass('animated')
                .addClass($(this).data('animate'))
                .addClass('this-animated');
        });
    });
});

Revolver.registerTransition('fade', function(options, done) {
    var $nextSlide    = $(this.slides[this.nextSlide]);
    var $currentSlide = $(this.slides[this.currentSlide]);

    $currentSlide.css('z-index', this.numSlides);
    $nextSlide.css('z-index', this.nextSlide);

    $nextSlide.css('opacity', 1).show(0, function(){
        $currentSlide.velocity({opacity: 0}, {
            duration: 400,
            easing: "swing",
            complete: done
        });
    });
});
