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
    var $messageBoxes = $('.message-box');
    var $messageBoxButton = $('.close-message-box');
    var $submit = $(".subscribe-button");

    var $succesMessage = $('#succes-message');
    var $errorMessage = $('#error-message');

    $form.on('submit', function () {
        return false;
    });

    $submit.on('click', function () {
        var $currentForm = $(this).closest('form');
        var dataString = $currentForm.serialize();
        var email = $currentForm.serializeArray()[0].value;

        if (!validateEmail(email)) {
            showSubscribeMessage('error', 'Введите корректный email.');
            return;
        }

        $.ajax({
            type: $currentForm.attr('method'),
            url: $currentForm.attr('action'),
            data: dataString,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                var message;

                switch (data.status) {
                    case 200:
                        message = 'Вы уже подписаны.';
                        break;
                    case 201:
                        message = 'Мы Вам обязательно сообщим о запуске сервиса.';
                        break;
                }

                showSubscribeMessage('success', message);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showSubscribeMessage('error');
            },
            beforeSend: function (jqXHR, settings) {
                $submit.attr("disabled", true);
            },
            complete: function (jqXHR, textStatus) {
                $submit.attr("disabled", false);
            }
        });

        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }
    });

    $messageBoxButton.on('click', function () {
        $messageBoxes.removeClass('opened');
    });

    function showSubscribeMessage(type, message) {
        var $currentMessageWindow;

        switch (type) {
            case 'success':
                $currentMessageWindow = $succesMessage;
                break;
            case 'error':
                $currentMessageWindow = $errorMessage;
                break;
        }

        $currentMessageWindow.addClass('opened');

        if (message) {
            $currentMessageWindow.find('.mb-content p').text(message);
        }
    }

    // Footer
    var date = new Date();

    $('#current-year').text(date.getFullYear());
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
