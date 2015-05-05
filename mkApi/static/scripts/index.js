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
});
