const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json())
// comment
const courses = [ 
    { id: 1, name: "Course 1"},
    { id: 2, name: "Course 2"},
    { id: 3, name: "Course 3"}

];

app.delete('/api/courses/:id', (req,res) => {
    //course = courses.find()
});

app.put('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course) res.status(404).send('The given id was not found')

    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    

    res.send(course)
});

app.post('/api/courses', (req, res) => {

    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
    
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => {
        return c.id === parseInt(req.params.id)
    })

    if(!course) res.status(404).send('The given id was not found')
    res.send(course)
})

const port = process.env.VIDLY_PORT || 3000

app.listen(port, () => {
    console.log("Starting server on port "+port)
})