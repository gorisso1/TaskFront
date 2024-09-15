import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from 'react';
import { sendGetRequest } from '../utils/requests';

import '../css/page.css'

function StartPage() {
  const [spots, setSpots] = useState([]);
  useEffect(() => {
    sendGetRequest('plots/')
      .then((response) => {
        console.log(response)
        setSpots(response);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, [])
  return (
    <>
        <Container >
        <div className='header'>GD TIME</div>
        <div className='block'>
        <div className='spot-list'>
        <Row>
        <Col>
        <div className="d-grid gap-2">
        {spots.map((spot) =>(
        <Button className='spot-botton' 
                variant="outline-dark" 
                size="lg"
                onClick={() => {
                  window.location.href = `/spot/${spot.id}`;
              }}
               
                >
                    {spot.title}</Button>
        ))}         

        </div>
        </Col>
        </Row>      
        </div>
        </div>

        <Row>
        <div className='block'>
        <Col className='admin-botton'>
        <div className="d-grid gap-2">
        <Button className='admin-botton-color' variant="dark" href='/login' size='lg'>Администратор</Button>
        </div>
        </Col>
        </div>
        </Row>

        </Container>
    </>
  )
}

export default StartPage