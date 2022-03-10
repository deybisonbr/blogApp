if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: 'Link Database MongoDB'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}