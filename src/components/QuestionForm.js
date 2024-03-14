import React, { useState } from 'react';
import { SiEgghead } from 'react-icons/si';
import axios from 'axios';
import md5 from 'md5';

export const QuestionForm = () => {
    const [username, setUsername] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [existsQuestion, setExistsQuestion] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleQuestionVerification = async (e) => {
        try {
            const response = await axios.post('https://ecoserver-zopz.onrender.com/existsQuestion', { username: username });

            const { status, question: resQuestion } = response.data;

            if (status === 'exists') {
                setQuestion(resQuestion);
                setExistsQuestion(true);
                setErrorMessage('');
            } else if (status === 'not found') {
                setQuestion('');
                setExistsQuestion(false);
                setErrorMessage('No tiene pregunta secreta asignada');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al verificar la pregunta secreta');
        }
    }

    const handleAnswerVerification = async () => {
        const data = {
            username: username,
            answer: md5(answer),
        };

        try {
            const response = await axios.post('https://ecoserver-zopz.onrender.com/checkAnswer', data);
            if (response.status === 200) {
                console.log('Respuesta correcta');
            } else {
                console.log('Respuesta incorrecta');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al verificar la respuesta');
        }
    }

    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <div className='col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-12'>
                    <div className='text-center mb-4'>
                        <h2 className='fw-bold'>Recuperación por Pregunta Secreta</h2>
                        <SiEgghead style={{ width: '128px', height: '128px' }} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='username' className='form-label'>
                            Nombre de usuario
                        </label>
                        <div className='d-flex'>
                            <input
                                id='username'
                                name='username'
                                className='form-control me-1'
                                type='text'
                                placeholder='Ingrese nombre de usuario'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <button
                                className='btn btn-success'
                                onClick={handleQuestionVerification}>
                                Verificar
                            </button>
                        </div>

                        {!existsQuestion && <p className='text-danger'>{errorMessage}</p>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='question' className='form-label'>
                            Pregunta Secreta
                        </label>
                        <input
                            id='question'
                            name='question'
                            className='form-control'
                            type='text'
                            value={question.trim() === '' ? '' : question}
                            readOnly
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='answer' className='form-label'>
                            Respuesta
                        </label>
                        <input
                            id='answer'
                            name='answer'
                            className='form-control'
                            type='password'
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                    <div className='mb-3 text-center'>
                        <button className='btn btn-danger' onClick={handleAnswerVerification}>
                            Verificar Respuesta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
