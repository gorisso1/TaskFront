import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState } from 'react';
import { sendGetRequest } from '../utils/requests';
import { useEffect } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { sendDeleteRequest } from '../utils/requests';

import '../css/page.css'

function AdminTaskListPage() {
  const [showDropdowns, setShowDropdowns] = useState([]);

  const [tasks, setTasks] = useState({}); // Change tasks state to an object
  const [spots, setSpots] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [index, setIndex] = useState([])
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [showFinishErrorModal, setShowFinishErrorModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null);
  const [idToDelete2, setIdToDelete2] = useState(null);


    const getTimeDifference = (createdAt) => {
        const eventTime = new Date(createdAt);
        const currentTime = new Date();
        const differenceInMs = currentTime - eventTime;
        
        const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
        const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((differenceInMs % (1000 * 60)) / 1000);

        const timeParts = [];
        if (hours > 0) {
            timeParts.push(`${hours} часов`);
        }
        if (minutes > 0) {
            timeParts.push(`${minutes} минут`);
        }
        if (seconds > 0 || timeParts.length === 0) {
            timeParts.push(`${seconds} секунд`);
        }

        return timeParts.join(', ');


    };

  useEffect(() => {
    sendGetRequest('plots/')
      .then((response) => {
        console.log(response);

        setSpots(response);
        // Initialize showDropdowns array with 'false' for each spot
        setShowDropdowns(Array(response.length).fill(false));
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, []);

  const handleClick = async (id, index) => {
    // Toggle the dropdown state for the clicked spot
    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = !newShowDropdowns[index];
    setShowDropdowns(newShowDropdowns);
  
    try {
      // Используйте асинхронный подход для обновления tasks
      const updatedTasks = await sendGetRequest(`tasks/?plot_id=${id}`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [id]: updatedTasks,
      }));
    } catch (error) {
      console.error('Ошибка при получении данных', error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await sendDeleteRequest(`tasks/${idToDelete}`);
      if (response.message === "Task couldn't delete") {
        setShowFinishModal(false);
        setShowFinishErrorModal(true)
        setEmployees(response.employees)
        console.log(response.employees)
      }
      else{
      setShowFinishModal(false);
  
      // После успешного удаления задачи, обновите состояние tasks для соответствующего места (spot)
      const updatedTasks = await sendGetRequest(`tasks/?plot_id=${idToDelete2}`);
      
      // Use the updatedTasks directly in setTasks
      setTasks({
        ...tasks,
        [idToDelete2]: updatedTasks,
      });
      }
    } catch (error) {
      console.error('Ошибка при удалении задачи или получении данных', error);
      setShowFinishModal(false);
    }
  };
  
  const handleFinishButtonClick = (idSpot, idTask, index) =>{
    setIdToDelete(idTask)
    setIdToDelete2(idSpot)
    setIndex(index)
    setShowFinishModal(true)
  }



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
            href='/admin-page'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
        </Button>
        <div className='header'>GD TIME</div>
        </div>
        <div className='block'>
          <div className='spot-list-admin-task'>
            <Row>
              <Col>
                <div className="d-grid gap-2">
                  {spots.map((spot, index) => (
                    <div key={spot.id}>
                      <Button 
                        className='admin-botton-color'
                        variant="dark" 
                        size="lg"
                        style={{width: '100%', borderRadius: '20px'}}
                        onClick={() => handleClick(spot.id, index)}
                      >
                        {spot.title}
                      </Button>

                      {showDropdowns[index] ? (
                        <div className='block'> 
                          <div className='search-task-list' >
                            <Row>
                              <Col>
                                <div className="d-grid gap-2">
                                  {tasks[spot.id]?.map((task) => (
                                    <Col key={task.id} > 
                                    <ButtonGroup vertical style={{width: "100%", marginBottom: "15px"}}>
                                    <Button
                                     
                                      className="task-list-title"
                                   
                                      disabled
                                      variant="outline-dark" 
                                      size='lg' 
                                    >
                                      {task.title}
                                    </Button>
                                        <Button

                                            className="task-list-title"

                                            disabled
                                            variant="outline-dark"
                                            size='lg'
                                        >
                                            {getTimeDifference(task.created_at)}
                                        </Button>

                                    <Button
                                     
                                     className="task-list-admin-comment"
                                   
                                     disabled
                                     variant="outline-dark" 
                                     size='lg' 
                                   >
                                     {task.admin_comment}
                                   </Button>

                                    <Button
                                     
                                     className="task-list-admin"
                                   
                                     disabled
                                     variant="outline-dark" 
                                     size='lg' 
                                   >
                                     {task.created_by}
                                   </Button>

                                   <Button
                                     
                                     className="task-list-finish"
                                   
                                     onClick={() => handleFinishButtonClick(spot.id, task.id, index)}
                                     variant="danger" 
                                     size='lg' 
                                   >
                                     Закончить
                                   </Button>
                                   </ButtonGroup>
                                    </Col>
                                  ))}
                                </div>
                              </Col>
                            </Row>      
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>      
          </div>
        </div>

        <Modal show={showFinishModal} onHide={() => setShowFinishModal(false)} centered>
            <Modal.Header closeButton>
         
            </Modal.Header>
            <Modal.Body>Вы уверены, что хотите закончить?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFinishModal(false)}>
                Отмена
            </Button>
            <Button variant="danger" id="deleteButton" onClick={() => confirmDelete()}>
                Закончить
            </Button>
            </Modal.Footer>
        </Modal>
        
        <Modal show={showFinishErrorModal} onHide={() => setShowFinishErrorModal(false)} centered>
            <Modal.Header closeButton>
         
            </Modal.Header>
            <Modal.Body>Задача ещё выполняется. Исполнители: {employees.join(', ') + '.'}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFinishErrorModal(false)}>
                OK
            </Button>
            </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default AdminTaskListPage