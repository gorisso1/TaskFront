import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from 'react';
import { sendGetRequest } from '../utils/requests';
import {useNavigate, useParams} from 'react-router-dom';

import '../css/page.css';

function SpotPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employees, setEmployees] = useState([]);
  const [data, setData] = useState({
    title: '',
  })
  useEffect(() => {
    sendGetRequest(`employees/?plot_id=${id}`)
      .then((response) => {
        console.log(response)
        setEmployees(response);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, [])
  useEffect(() => {

  }, [id]);

  useEffect(() => {
    sendGetRequest(`plots/${id}`)
      .then((response) => {
        console.log(response)
        setData({...data, title: response.title});
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, [])



  return (
    <>
        <Container >
        <div style={{ position: 'relative' }}>
          <Button
            variant="outline-dark"
            style={{
              borderWidth: '2px',
              borderRadius: '20px',
              marginTop: '70px',
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '1', // Ensure the button is above other elements
            }}
            href='/'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
          </Button>
          <div className='header' >GD TIME<br/>{data.title}</div>
        </div>

        <div className='block'>
        <div className='spot-list'>
        <Row>
        <Col>
        <div className="d-grid gap-2">
        {employees.map((employee) => (

        <Button 
        className='spot-botton' 
        variant="outline-dark" 
        onClick={() => {
          if (employee.task_info === null)
              navigate('/notTask');


          else
            window.location.href = `/comment/${id}/${employee.id}/${employee.task_info.task_id}`;
      }}
       
        size="lg">{employee.name} {employee.surname}</Button>

        ))}

        </div>
        </Col>
        </Row>      
        </div>
        </div>


        </Container>
    </>
  )
}

export default SpotPage