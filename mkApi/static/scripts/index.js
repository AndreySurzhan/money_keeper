$(document).ready(function () {
    // Slider
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

    // Animations
    $('.this-animate').each(function () {
        $(this).appear(function () {
            $(this)
                .addClass('animated')
                .addClass($(this).data('animate'))
                .addClass('this-animated');
        });
    });

    // Subscribe form
    var $form = $(".subscribe-form");
    var $submit = $(".subscribe-button");

    $form.on('submit', function () {
        return false;
    });

    $submit.on('click', function () {
        var dataString = $form.serialize();

        showSubscribeSuccess();

        return;

        $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: dataString,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log('success', data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error', textStatus, errorThrown);
            },
            beforeSend: function (jqXHR, settings) {
                $submit.attr("disabled", true);
            },
            complete: function (jqXHR, textStatus) {
                $submit.attr("disabled", false);
            }
        });
    });

    function showSubscribeSuccess() {

    }
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
