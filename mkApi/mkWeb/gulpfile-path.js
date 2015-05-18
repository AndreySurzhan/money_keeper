module.exports = {
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
