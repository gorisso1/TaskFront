import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { sendGetRequest } from '../utils/requests';


import '../css/page.css'

function TaskPage() {
const { id, employeeId } = useParams();
const [tasks, setTasks] = useState([]);
const [data, setData] = useState({
  name: '',
  surname: '',
  title: '',
})
useEffect(() => {
  sendGetRequest(`tasks/?plot_id=${id}`)
    .then((response) => {
      console.log(response)
      setTasks(response);
    })
    .catch((error) => {
      console.error('Ошибка при получении данных', error);
    });
}, [])

useEffect(() => {
  sendGetRequest(`employees/${employeeId}/`)
    .then((response) => {
      console.log(response)
      setData({...data, name: response.name, surname: response.surname})


    })
    .catch((error) => {
      console.error('Ошибка при получении данных', error);
    });
}, [])


useEffect(() => {
  sendGetRequest(`plots/${id}`)
    .then((response) => {
      console.log(response)
      setData(prevData => ({
        ...prevData,
        title: response.title 
      }));
    })
    .catch((error) => {
      console.error('Ошибка при получении данных', error);
    });
}, [])


useEffect(() => {

}, [id]);
  return (
    <>
        <Container >
        <div style={{position: 'relative'}}>
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
            onClick={() => {
              window.location.href = `/spot/${id}`;
          }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
        </Button>
        <div className='header'>{data.title}<br/>{data.name} {data.surname}</div>
        </div>
        <div className='block'>
        <div className='spot-list'>
        <Row>
        <Col>
        <div className="d-grid gap-2">
        {tasks.map((task) => (
        <Button 
        className='spot-botton' 
        variant="outline-dark" 
        size="lg"
        onClick={() => {
          window.location.href = `/comment/${id}/${employeeId}/${task.id}`;
      }}>
          {task.title}
        </Button>
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

export default TaskPage