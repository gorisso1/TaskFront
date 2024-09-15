import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { sendGetRequest } from '../utils/requests';
import { sendPutRequest } from '../utils/requests';
import { sendPostRequest } from '../utils/requests';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import '../css/page.css'

function CommentPage() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();
  const [timerRunning, setTimerRunning] = useState(false);
  const { id, employeeId, taskId} = useParams();
  const [showStartButton, setShowStartButton] = useState(true)
  const [showRedButton, setShowRedButton] = useState(false)
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [disabled, setDisabled] = useState(false);
  const textareaRef1 = useRef(null);
  const textareaRef2 = useRef(null);
  const [data, setData] = useState({
    name: '',
    surname: '',
    title: '',
    task: '',
    comment: '',
    created_by: '',
  })

  const [formData, setFormData] = useState({
    comment: '',
  })

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

useEffect(() => {
  if (textareaRef1.current) {
    // Устанавливаем высоту textarea в зависимости от содержимого
    textareaRef1.current.style.height = 'auto';
    textareaRef1.current.style.height = `${textareaRef1.current.scrollHeight}px`;
  }
}, [data.comment]);

useEffect(() => {
  if (textareaRef2.current) {
    // Устанавливаем высоту textarea в зависимости от содержимого
    textareaRef2.current.style.height = 'auto';
    textareaRef2.current.style.height = `${textareaRef2.current.scrollHeight}px`;
  }
}, [formData.comment]);





    useEffect(() => {
        let interval;

        if (timerRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const newSeconds = prevTime.seconds + 1;
                    const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
                    const newHours = prevTime.hours + Math.floor(newMinutes / 60);

                    return {
                        hours: newHours,
                        minutes: newMinutes % 60,
                        seconds: newSeconds % 60,
                    };
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [timerRunning]);

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
        sendGetRequest(`employee-tasks/?employee_id=${employeeId}&task_id=${taskId}`)
            .then((response) => {
                if (response.detail !== "not found") {
                    setShowRedButton(true);
                    const secondsStr = response.total_time;
                    setTime({
                        seconds: secondsStr % 60,
                        minutes: Math.floor(secondsStr / 60) % 60,
                        hours: Math.floor(secondsStr / 3600),
                    });
                    setFormData({ ...formData, comment: response.employee_comment });
                    setDisabled(true);
                    setShowStartButton(false);
                    setTimerRunning(!response.is_paused);
                } else {
                    setShowRedButton(false);
                    setShowStartButton(true);
                }
            })
            .catch((error) => {
                console.error('Ошибка при получении данных', error);
            });
    }, [employeeId, taskId]);

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
    sendGetRequest(`tasks/${taskId}`)
      .then((response2) => {
        console.log(response2)
        setData(prevData => ({
          ...prevData,
          task: response2.title,
          comment: response2.admin_comment,
          plot: response2.plot,
          type_of_task: response2.type_of_task,
          created_by: response2.created_by

        }));
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, [])
  

  const handleStartButtonClick = () => {
    const putData = {
        admin_comment: data.comment,
        employee_comment: formData.employee_comment,
        title: data.task,
        plot: data.plot,
        type_of_task: data.type_of_task,
        created_by: data.created_by
    };

    const postData = {
        action: 'start',
    };

    // Отправка первого запроса
    sendPutRequest(`tasks/${taskId}/`, putData)
        .then(responseData => {
            console.log('Успешный ответ:', responseData);

            // Установка состояний и отправка следующего запроса
            setShowRedButton(true)
            setDisabled(true);
            setTimerRunning(true);
            setShowStartButton(false);
            console.log(formData)
            return sendPostRequest(`choose-task/?employee_id=${employeeId}&task_id=${taskId}`, formData);
        })
        .then(responseData => {
            console.log(responseData);

            // Отправка последнего запроса
            return sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, postData);
        })
        .then(responseData => {
            console.log(responseData);

            // Возможно, здесь могут быть дополнительные действия после выполнения всех запросов
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
};

  const handleRedClick = () => {
    setShowRedButton(false)
    setDisabled(false)
    setShowSaveButton(true)
  }

  const handleSaveClick = () => {
    setShowSaveButton(false)
    setDisabled(true)
    const putData = {
      employee_comment: formData.comment,
      employee: employeeId,
      task: taskId
  };
    sendPutRequest(`employee-tasks/?employee_id=${employeeId}&task_id=${taskId}`, putData)
    .then(responseData => {
      console.log('Успешный ответ:', responseData);
    })
    setShowRedButton(true)
  }


    const handleContinue = () =>{
        const startData = {
            action: 'start',


        };
        sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, startData)
            .then(responseData => {
                console.log(responseData);
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });

        setTimerRunning(!timerRunning);


    }

    const handlePauseButtonClick = (message) => {
        const stopData = {
            action: 'pause',
            message: message,
        };

        sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, stopData)
            .then(() => {
                setTimerRunning(false);
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });
    };

    const handleFinishButtonClick = () => {
        setShowFinishModal(true);
    };

    const handleModalClick = () => {
        const finishData = {
            action: 'end',
        };

        sendPostRequest(`timer/?task_id=${taskId}&employee_id=${employeeId}`, finishData)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });

        setShowStartButton(true);
        setFormData({ ...formData, comment: '' });
        setDisabled(false);
        setShowFinishModal(false);
        setTimerRunning(false);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
    };

  return (
    <>
        <Container >
        
        <div style={{position: 'relative'}}>
        {showStartButton &&(
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
              window.location.href = `/task/${id}/${employeeId}`;
          }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
        </Button>
        )}

        {!showStartButton &&(
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
        )}

        <div className='header'>{data.title}<br/>{data.name} {data.surname}<br/>{data.task}</div>
        </div>
        
        <div className='block'>
        <p className='spot-name'>Комментарий администратора</p>
        </div>
        <div className='block'>
        <Col className='admin-botton'>
        <Form>
        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
        
        <Form.Control 
        ref={textareaRef1}
        className='comment-textarea' 
        as="textarea" 
        size='lg'
        disabled='true'
        value={data.comment}/>
        </Form.Group>


        <div className='block' style={{marginTop: '70px'}}>
        <p className='spot-name'>Комментарий работника</p>
        </div>
        <div>
        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
        
        <Form.Control 
        ref={textareaRef2}
        name="comment"
        className='comment-textarea' 
        as="textarea" 
    
        size='lg'
        disabled={disabled}
        value={formData.comment}
        onChange={handleInputChange}/>

        </Form.Group>
        </div>

        {showRedButton &&(
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button  variant="secondary" size='lg' onClick={handleRedClick}>
                     Редактировать
                 </Button>
          </div>
        )}
        {showSaveButton &&(
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button  variant="primary" size='lg' onClick={handleSaveClick}>
                     Сохранить
                 </Button>
          </div>
        )}

        </Form>
        </Col>
        </div>


        {showStartButton &&(
        <Row>
          <div className='block'>
            <Col className='admin-botton'>
                <div className="d-grid gap-2">
                <Button  variant="success" size='lg'
                         onClick={handleStartButtonClick}>
                    Начать
                </Button>
                </div>
            </Col>
            </div>
        </Row>
        )}

        {!showStartButton &&(
        <Row>
          <div className='block'>
            <Row>
                  <div className="timer">
                    {String(time.hours).padStart(2, '0')}:
                    {String(time.minutes).padStart(2, '0')}:
                    {String(time.seconds).padStart(2, '0')}
                  </div>
              </Row>
          </div>
          <div className='block'>
            <Col className='admin-botton'>
                <Row>
                <Col>

                <div className="d-grid gap-2">
                {timerRunning ? (
                    <>
                <Button className='buttons-timer' variant="warning" size='lg'
                  onClick={() => handlePauseButtonClick("Ожидание по комплектующим")}>
                    Ожидание по комплектующим
                </Button>


                    <Button className='buttons-timer' variant="warning" size='lg'
                            onClick={() => handlePauseButtonClick("Ожидание по браку")}>
                        Ожидание по браку
                    </Button>
                </>


                ) : (
                <Button className='buttons-timer' variant="warning" size='lg'
                  onClick={handleContinue}>
                  Продолжить
                </Button>
                )}

                </div>
                </Col>
                <Col>
                <div className="d-grid gap-2">

                <Button className='buttons-timer' variant="danger" size='lg'
                         onClick={handleFinishButtonClick}>
                    Закончить
                </Button>
                </div>
                </Col>
                </Row>

                <Row>
                <div className="d-grid gap-2">
                <Button className='buttons-timer' href='/' variant="secondary" size='lg'
                         >
                    Меню

                </Button>
                </div>
                </Row>
            </Col>
            </div>
        </Row>
        )}


        <Modal show={showFinishModal} onHide={() => setShowFinishModal(false)} centered>
            <Modal.Header closeButton>
         
            </Modal.Header>
            <Modal.Body>Вы уверены, что хотите закончить?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFinishModal(false)}>
                Отмена
            </Button>
            <Button variant="danger" onClick={handleModalClick}>
                Закончить
            </Button>
            </Modal.Footer>
        </Modal>


        </Container>
    </>
  )
}

export default CommentPage