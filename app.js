const http = require('http');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 800;
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/static', express.static('public')); 

app.listen(port, () => console.log(`Server up and running on port ${port}.`));

const db = require("./models");
const Form = db.Form
const FormQuestion = db.FormQuestion
const FormQuestionOption = db.FormQuestionOption

app.post("/form/submit", async (req, res) => {
  await Form.create({
    id: req.body.uuid,
    title: req.body.title,
    info: req.body.info,
  })
  req.body.questions.map((obj) => {
    FormQuestion.create({
      FormId: req.body.uuid,
      id: obj.uuid,
      title: obj.title,
      questionType: obj.questionType,
    })
    obj.options.map((objObj) => {
      FormQuestionOption.create({
        FormQuestionId: obj.uuid,
        id: objObj.uuid,
        option: objObj.option,
      })
    })
  })
})

app.get("/form/all", async (req, res) => {
  const Forms = await Form.findAll({
    include: [{
      model: FormQuestion,
      include: FormQuestionOption
    }]
  })
  res.json({Forms:Forms})
})