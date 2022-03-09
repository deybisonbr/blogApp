if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: 'mongodb+srv://daybisonbraga:dede654321@blogapp.r8afi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}