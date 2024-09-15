import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom'; 
import { useState } from 'react';
import { sendPostRequest } from '../utils/requests';

import '../css/login.css'

function LoginPage() {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            var response = await sendPostRequest("login/", formData);
            console.log(response)
            if (response.message == "Authentication successful") {
                localStorage.setItem("authenticated", true);
                localStorage.setItem("username", formData.username);
                navigate('/admin-page');
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };   
  return (
    <>
    <Container>
    <Button variant="outline-dark"
    style={{borderWidth: '2px',
            borderRadius: '20px',
            marginTop: '70px'}}  
            href='/'>
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
    </svg>
    </Button>
    <Row>
        <Col>
        <div className="form-container-login">
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <div className="title">
                        <Form.Label>Войдите, чтобы начать работу</Form.Label>
                    </div>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Логин"
                        className='login'
                        value={formData.username}
                        onChange={handleInputChange}

                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        className='login'
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Row>
                <Col>
                <Alert show={showError} variant="danger" className='custom-alert' onClose={() => setShowError(false)} dismissible>
                            Неправильный логин или пароль
                        </Alert>
                </Col>
                </Row>
                <Row>
                    <Col style={{ textAlign: 'right' }}>
                        <Button className='button' variant="dark" size='lg' type="submit">
                            Войти
                        </Button>
                    </Col>
                </Row>

            </Form>
        </div>
        </Col>
        </Row>
        
    </Container>
    </>
  )
}

export default LoginPage