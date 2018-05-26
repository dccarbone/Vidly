const express = require('express');
const morgan = require('morgan');
const app = express();
const Joi = require('joi');
const logger = require('./logger');
const helmet = require('helmet')
const fs = require('fs');


app.use(express.json());
//app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
//const accessLogStream = fs.createWriteStream('./log/access.log', {flags: 'a'})

if(app.get('env') === 'development'){
    console.log("DEVELOPMENT ENV!")
    app.use(morgan("combined"));
    console.log("Morgan Enabled!");
}



app.use((req, res, next) =>{
    //console.log("Authenticating...")
    next();
})
// comment
const courses = [ 
    { id: 1, name: "Course 1"},
    { id: 2, name: "Course 2"},
    { id: 3, name: "Course 3"}

];

app.delete('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return status(404).send('The given id was not found')

    const index = courses.indexOf(course)

    courses.splice(index, 1);

    res.send(course)
});

app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) return status(404).send('The given id was not found')

    const { error } = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name;    

    res.send(course)
});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body)
    
    if(error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.status(200).send(course);
    
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))

    if(!course) return status(404).send('The given id was not found')

    res.send(course)
})

const port = process.env.VIDLY_PORT || 3000

app.listen(port, () => {
    console.log("Starting server on port "+port)
})


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}