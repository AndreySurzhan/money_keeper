require(
    [
        'requirejs.config'
    ],
    function () {
        require(
            [
                'domReady!'
            ],
            function (document) {
                console.log('DOM is ready!');
            }
        );
    }
);
