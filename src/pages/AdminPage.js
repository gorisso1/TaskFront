import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


import '../css/page.css'

function AdminPage() {


  return (
    <>
        <Container>
        <div style={{position: 'relative'}}>
        <Button
            variant="outline-dark"
            style={{
              borderWidth: '2px',
              borderRadius: '20px',
              marginTop: '35px',
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
        <div className='header'>GD TIME</div>
        </div>
        <div className='block'> 
        <div className='spot-list'>
        <Row>
        <Col>
        <div className="d-grid gap-2">

            <Button className='admin-botton-color' href='/admin-task-type' variant="dark" size='lg'>Постановка задач</Button>
            <Button className='admin-botton-color' href='/admin-employee' variant="dark" size='lg'>Назначить работника</Button>
            <Button className='admin-botton-color' href='/admin-task-list' variant="dark" size='lg'>Список задач</Button>
            <Button className='admin-botton-color' href='/admin-now-task-list' variant="dark" size='lg'>Выполняемые задачи</Button>
            <Button className='admin-botton-color' href='/report' variant="dark" size='lg'>Отчеты</Button>


        </div>
        </Col>
        </Row>      
        </div>
        </div>

 

        </Container>
    </>
  )
}

export default AdminPage