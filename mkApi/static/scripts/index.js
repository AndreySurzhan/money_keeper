$(document).ready(function () {
    // animate on scroll
    $('.this-animate').each(function () {
        $(this).appear(function () {
            $(this)
                .addClass('animated')
                .addClass($(this).data('animate'))
                .addClass('this-animated');
        });
    });

    Revolver.registerTransition('fade', function(options, done) {
        var $nextSlide    = $(this.slides[this.nextSlide]);
        var $currentSlide = $(this.slides[this.currentSlide]);

        // move current slide above the next slide
        // so that when the current is faded out
        // the next slide beneath it will be revealed
        $currentSlide.css('z-index', this.numSlides);
        $nextSlide.css('z-index', this.nextSlide);

        // all slides except the current are hidden
        // so we must unhide the next slide before
        // we can begin the transition
        $nextSlide.css('opacity', 1).show(0, function(){
            // on complete start fading...
            $currentSlide.velocity({opacity: 0}, {
                duration: 400,
                easing: "swing",
                complete: done
            });
        });
    });

    var mySlider = new Revolver({
        containerSelector: '.slider',
        slidesSelector: '.slide',
        transition: {
            name: 'fade' // <-- use custom transition
        }
    });
});
