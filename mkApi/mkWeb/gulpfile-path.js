module.exports = {
    scripts: {
        build: {
            src: 'bootstrap',
            dist: 'app/mk.js',
            baseUrl: 'app/',
            config: 'app/requirejs.config.js'
        },
        dev: {
            src: 'app/bootstrap.js',
            dist: 'mk.js',
            distFolder: 'app/'
        }
    },
    styles: {
        src: './styles/_built/*.less',
        dist: './styles/_dist/',
        watch: './styles/**/*.less'
    },
    images: {
        src: './images/*.*',
        dist: './images/_dist/',
        watch: './image/*.*'
    },
    vendor: {
        src: 'bower-components/',
        dist: 'libs/'
    }
};
