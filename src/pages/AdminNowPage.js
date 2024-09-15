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

function AdminNowPage() {
  const [showDropdowns, setShowDropdowns] = useState([]);
  const [tasks, setTasks] = useState({}); // Change tasks state to an object
  const [spots, setSpots] = useState([]);
  const [index, setIndex] = useState([])
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [showFinishErrorModal, setShowFinishErrorModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null);
  const [idToDelete2, setIdToDelete2] = useState(null);

  useEffect(() => {
    sendGetRequest('plots/')
      .then((response) => {
        console.log(response);
        setSpots(response);
  
        setShowDropdowns(Array(response.length).fill(false));
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, []);

  function formatTotalTime(totalTime) {
    const secondsStr = totalTime;
    const seconds = secondsStr % 60
    const minutes = Math.floor(secondsStr / 60) % 60
    const hours = Math.floor(secondsStr / 3600)
  
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
    return formattedTime;
  }

  const handleClick = async (id, index) => {
    // Toggle the dropdown state for the clicked spot
    const newShowDropdowns = [...showDropdowns];
    newShowDropdowns[index] = !newShowDropdowns[index];
    setShowDropdowns(newShowDropdowns);
  
    try {
      // Используйте асинхронный подход для обновления tasks
      const updatedTasks = await sendGetRequest(`employee-tasks/?plot_id=${id}`);
      console.log(updatedTasks)
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
                                         Создал:  {task.admin_name}
                                        </Button>
                                        <Button

                                          className="task-list-title"

                                          disabled
                                          variant="outline-dark"
                                          size='lg'
                                        >
                                          {task.employee_name}
                                        </Button>
                                        <Button

                                         className="task-list-admin-comment"

                                         disabled
                                         variant="outline-dark"
                                         size='lg'
                                       >
                                         {task.task_title}
                                       </Button>

                                       <Button

                                         className="task-list-admin"

                                         disabled
                                         variant="outline-dark"
                                         size='lg'
                                       >
                                         {task.employee_comment}
                                       </Button>
                                      <Button
                                          className="task-list-admin"
                                          disabled
                                          variant="outline-dark"
                                          size='lg'
                                      >
                                        {task.paused_message}
                                      </Button>

                                   <Button
                                     
                                     className="task-list-time"
                                   
                                     disabled
                                     variant="outline-dark" 
                                     size='lg' 
                                   >
                                     {formatTotalTime(task.total_time)}
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

      </Container>
    </>
  );
}

export default AdminNowPage