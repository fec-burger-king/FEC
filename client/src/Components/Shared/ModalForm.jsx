/*
  A share template for
     1. Add question form
     2. Add answer form
     3. Add review form
*/

import React, { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { ProductContext } from "../Questions/Questions";
import { QuestionContext } from "../Questions/QuestionsItem";
import validateForm from "./validateForm";


/* Define style for component*/
 const Line = styled.hr`
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 0.5em;
  margin-right: 0.5em;
`;

 const Input = styled.input.attrs({
  type: 'text'
})`
  color: black;
  margin-bottom: 1em;
  padding: 1.5em;
  font-size : 0.7em;
  ${'' /* text-transform: uppercase; */}
  width: 100%;
  border-radius: 5px;
  border: solid 1px black;
  height: 2.5em;
  box-shadow: 1px;
  outline: none;
  text-align: left;
  &:hover {
    box-shadow: 2px 2px 2px thistle;
  }

`

const Question = styled.textarea`
  color: black;
  ${'' /* text-transform: uppercase; */}
  width: 100%;
  border-radius: 5px;
  font-size : 0.7em;
  border: solid 1px black;
  margin-bottom: 0.5em;
  padding: 1em;
  height: 8em;
  box-shadow: 1px;
  outline: none;
  text-align: left;
  resize: none;
  &:hover {
    box-shadow: 2px 2px 2px thistle;
  }
`;

const SubmitBtn = styled.input.attrs({
  type: 'submit',
  value: 'Submit'
})`
  background: black;
  color: #fff;
  cursor: pointer;
  margin-bottom: 0;
  text-transform: uppercase;
  font-size:0.8em;
  width: 100%;
  border-radius: 3px;
  height: 35px;
  border-color: transparent;
  outline: none;
  text-align: center;
  font-weight:bold;
  &:hover {
    background-color: grey;
  }
  `
  const SuccessButton = styled.input.attrs({
    type: 'submit',
    value: 'Keep shopping'
  })`
    background: black;
    color: #fff;
    cursor: pointer;
    margin-top: 1em;
    text-transform: uppercase;
    font-size:0.8em;
    width: 100%;
    border-radius: 3px;
    height: 35px;
    border-color: transparent;
    outline: none;
    text-align: center;
    font-weight:bold;
    &:hover {
      background-color: grey;
    }
    `


  const Message = styled.div `
    font-size : 0.8em;
    font-weight: bold;
    margin-top : 0.7em;
  `

  const FormHeader = styled.span `
  font-size : 0.8em;
  font-weight: bold;
  font-style:italic;
  color:grey;

`

  const ErrorMsg = styled.div `
    font-size : 0.6em;
    color: ${({type}) => (type)};
    padding-top:0.5em;

  `
  const Paragraph = styled.div `
    font-size : 0.65em;
    color: black;
    color:grey;
  `

  const Header = styled.div`
  padding: 0.25rem;
  font-size: 1em;
  ${'' /* border : solid 1px red; */}
  font-weight : bold;
`;

const UploadPhoto = styled.div`
  ${'' /* font-size: 0.6em; */}
  padding-bottom:1em;

`



export default function ModalForm({type}) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);


  const [product, postQuestion, closeWindow] = useContext(ProductContext);
  const context_obj = useContext(QuestionContext);
  if (Array.isArray(context_obj)) {
    var [question_obj, postAnswer, hideModal] = useContext(QuestionContext)
  }
  // console.log('question_obj is : ', Array.isArray(question_obj));


  // const [name, setName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState('');
  const fileInput = useRef('')

  const handleFileInput = (e) => {
    // handle validations
    setSelectedFiles(e.target.files);
  // if (file.size > 1024)
  //   console.log('size too big');
  // else setSelectedFile(file);
}


  const handleOnchange = (event) => {
    //console.log('handle onchange with : ', event.target.name);
    let name = event.target.name;
    if (name === 'name') {
      setName(event.target.value);
    } else if (name === 'email') {
      setEmail(event.target.value);
    } else {

      type === 'question' ? setQuestion(event.target.value) : setAnswer(event.target.value);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fileInput.current && fileInput.current.click();
    let inputField = (type === 'question') ? question : answer
    console.log('input field  is : ', inputField);
    const resultError = validateForm({name, email, inputField});

    if (resultError !== null) {
			setError(resultError);
			return;
		}

    const formData = new FormData()
    formData.append('name', name);
    formData.append('email', email);
    formData.append(type, inputField);

    for (let i = 0; i< selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    setName('');
		setEmail('');
		setQuestion('');
    setError(null);

    if (type === 'question') {
      postQuestion(name, email, question);
    } else if ( type === 'answer') {
      // console.log('add answer with file : ', selectedFile);
      // const imgUrl = `http://localhost:3000/${selectedFile.name}`;
      postAnswer(formData);
    }

    setShowSuccess(true);

  }

  const handleSuccessClick = (e) => {
    setShowSuccess(false);
    type === 'question' ?  closeWindow() : hideModal() ;

  }

  const successMsg = 'Your feedback helps others find the perfect gear and helps to improve our products. Reviews are typically posted within 72 hours, however, due to high volume our response times have been longer than normal. Don’t sweat—your review will be shared, or hear back from us soon.';


  return (
    <>
    {showSuccess ? <><Header>Thanks for your review!</Header><Paragraph>{successMsg}</Paragraph><SuccessButton onClick={handleSuccessClick}/></> :
    <form onSubmit={handleSubmit}>
    <Header>
    {type === 'question' ? <><FormHeader>Ask a Question for </FormHeader><Message>{product.name}</Message></> : <><FormHeader>Submit your Answer</FormHeader><Message>{product.name}</Message><FormHeader>Q:{question_obj.question_body}</FormHeader></>}
      </Header>
      <Line />
        <Message>Your name<span>&#42;</span></Message>
        <Input placeholder="Example: bob (Maximum of 25 characters)" name="name" value={name} onChange={handleOnchange}/>
        <Message>Your Email<span>&#42;</span></Message>
        <Input placeholder="Example: youremail@example.com" name="email" onChange={handleOnchange} value={email}/>
        <Message>Your Question<span>&#42;</span> <Message type='grey'>(Up to 1000 characters)</Message></Message>
        <Question placeholder="What do you want to know about this product?" name="question" onChange={handleOnchange} value={type === 'question' ? question : answer}/>
      {type === 'answer' && <UploadPhoto>
        <Message>Add up to 5 photos (Optional)</Message>
        <Paragraph>Upload a PNG, GIF, JPG, JPEG, HEIC, or TIFF(Max 10MB)</Paragraph>
        <input type="file" name='files' onChange={handleFileInput} multiple />
        {/* <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary">phtoto name</button> */}
      </UploadPhoto>}
        <SubmitBtn />
        <ErrorMsg type='grey' >Asterisk(*) indicated mandatory field</ErrorMsg>
        {error && <ErrorMsg type="red" >{error}</ErrorMsg>}
      </form>
    }


    </>


  )
}