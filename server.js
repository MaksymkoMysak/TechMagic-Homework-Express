const express = require('express');
const app = express();

const port = 3000;

const booksRouter = require('./routes/books')
app.use('/books',express.json(), booksRouter)

app.use(express.json())

app.get('/', (req, res) => {
    res.send('App works!')
}) 


function errorHandler(err, req, res, next){
    if(err.status){
        res.status(err.status).json({err: err.message})
        return
    }
    res.sendStatus(500);
}
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`Server is running on ${port}...`);
})