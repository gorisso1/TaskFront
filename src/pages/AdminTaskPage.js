import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { sendGetRequest } from '../utils/requests';
import { sendPostRequest } from '../utils/requests';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useRef } from 'react';

import '../css/page.css'
import '../css/search.css'

function AdminTaskPage() {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
  const {type} = useParams()
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [spots, setSpots] = useState([]);
  const [items, setItems] = useState([])
  const textareaRef1 = useRef(null);
  const textareaRef2 = useRef(null);
  const [formData, setFormData] = useState({
    item: '',
    plot: '',
    title: '',
    comment: '',

  })

  const [sendData, setSendData] = useState({
    item: null,
    plot: null,
    type: '',
  })

  useEffect(() => {

    switch (type) {
      case 'batch_production':
        setDisabled(true);
        setSendData({ ...sendData, type: 'Произвести'});
        setFormData({ ...formData, title: 'Произвести'});
        break;
      case 'testing':
        setDisabled(true);
        setSendData({ ...sendData, type: 'Протестировать'});
        setFormData({ ...formData, title: 'Протестировать'});
        break;
      case 'repair':
        setDisabled(true);
        setSendData({ ...sendData, type: 'Отремонтировать'});
        setFormData({ ...formData, title: 'Отремонтировать'});
        break;
      case 'shipments':
        setDisabled(true);
        setSendData({ ...sendData, type: 'Отгрузить'});
        setFormData({ ...formData, title: 'Отгрузить'});
        break;
      default:
        break;
    }
  }, []);


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
}, [formData.title]);


useEffect(() => {
  if (textareaRef2.current) {
    // Устанавливаем высоту textarea в зависимости от содержимого
    textareaRef2.current.style.height = 'auto';
    textareaRef2.current.style.height = `${textareaRef2.current.scrollHeight}px`;
  }
}, [formData.comment]);

  const handleDropdownToggle1 = () => {
    setShowDropdown1(!showDropdown1);
  };


  const handleDropdownToggle2 = () => {
    setShowDropdown2(!showDropdown2);
  };


  useEffect(() => {
    sendGetRequest('items/')
      .then((response) => {
        console.log(response)
        setItems(response);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных', error);
      });
  }, [])
  

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


  const validateForm = () => {
    const emptyFields = Object.keys(formData).filter((fieldName) => {
      // Исключаем поле "comment" из валидации
      if (fieldName === 'comment') {
        return false;
      }
      const value = formData[fieldName];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
    return emptyFields;
  };


  const handleAddClick = async (e) => {
    e.preventDefault();

    if (!hasTriedToSubmit) {
      setHasTriedToSubmit(true);
    }
    const emptyFields = validateForm();
    
    if (emptyFields.length > 0) {

      emptyFields.forEach((fieldName) => {

        const inputElement = document.querySelector(`[name="${fieldName}"]`);
        if (inputElement) {
          inputElement.classList.add('error');
        }
      });
      return; 
    }


    if (sendData.item == null|| sendData.plot == null){
      return;
    }


    try {
        const requestData = {
          item: sendData.item,
          plot: sendData.plot,
          title: formData.title,
          admin_comment: formData.comment,
          type_of_task: type,
          created_by: localStorage.getItem('username'),
        }
        var response = await sendPostRequest("tasks/", requestData);
        console.log(response) 
        setShowModal(true);   
    } catch (error) {
        console.error('Error:', error);
    }

  }; 

  const handleItemClick = (item) => {
    console.log('Button clicked:', item);
    setShowDropdown1(false);
    setFormData({ ...formData, item: item.title});
    setSendData({ ...sendData, item: item.id});
    setHasErrorItem(false);
    setErrorMessageItem("");
    document.querySelector('[name="item"]').classList.remove('error');
    setFormData(prevFormData => ({
      ...prevFormData,
      title: sendData.type + ` ${item.title}`
    }));
    setDisabled(false);
  };

  const handlePlotClick = (spot) => {
    setShowDropdown2(false);
    setFormData({ ...formData, plot: spot.title});
    setSendData({ ...sendData, plot: spot.id});
    setHasErrorPlot(false);
    setErrorMessagePlot("");
    document.querySelector('[name="plot"]').classList.remove('error');
  };


  const filteredItems = items.filter(item =>
    (item.title?.toLowerCase() ?? '').includes((formData.item ?? '').toLowerCase()) ||
    (item.types_of_work?.toLowerCase() ?? '').includes((formData.item ?? '').toLowerCase()) ||
    (item.subtypes_of_work?.toLowerCase() ?? '').includes((formData.item ?? '').toLowerCase()) ||
    (item.category_of_item?.toLowerCase() ?? '').includes((formData.item ?? '').toLowerCase()) ||
    (item.subcategory_of_item?.toLowerCase() ?? '').includes((formData.item ?? '').toLowerCase())
  );

  const filteredPlots = spots.filter(spot =>
    spot.title.toLowerCase().includes(formData.plot.toLowerCase())
  );

  const [hasErrorItem, setHasErrorItem] = useState(false);
  const [errorMessageItem, setErrorMessageItem] = useState("");
  const [hasErrorPlot, setHasErrorPlot] = useState(false);
  const [errorMessagePlot, setErrorMessagePlot] = useState("");
  return (
    <>
        <Container>
        <div style={{position: 'relative'}}>
        <Button
            variant="outline-dark"
            style={{
              borderWidth: '2px',
              borderRadius: '20px',
              marginTop: '60px',
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '1', // Ensure the button is above other elements
            }}
            href='/admin-task-type'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
        </Button>
        <div className='header'>GD TIME<br/>Постановка задач</div>
        </div>
        <div className='block'>
        <div className='search-group'>
        <div className="d-grid gap-2">

        <Form onSubmit={handleAddClick}>
        <Form.Group>
        <Form.Label>Ввведите прибор</Form.Label>
        <InputGroup className="mb-3" controlId="formBasicPassword" >
                    <Form.Control
                        style={{borderRadius: "20px"}}
     
                        name="item"
                        placeholder="Поиск..."
                        className='login'
                        size='lg'
                        value={formData.item}
                        onChange={handleInputChange}
                        onClick={handleDropdownToggle1}
                        onBlur={(e) => {
                          if (!formData.item || formData.item === '' || sendData.item == null) {
                            setHasErrorItem(true);
                            setErrorMessageItem("Инструмент не выбран.");
                            document.querySelector('[name="item"]').classList.add('error');
                            if (hasTriedToSubmit) {
                              
                              document.querySelector('[name="item"]').classList.add('error');
                            }
                          }
                        }}
                        onFocus={() => {
                          setHasErrorItem(false);
                          setErrorMessageItem("");
                          document.querySelector('[name="item"]').classList.remove('error');
                        }}
                    />
                    
      


                    
          </InputGroup>

          {hasErrorItem && !showDropdown1 && <div className="error-message" style={{ textAlign: 'right' }}>{errorMessageItem}</div>}

          </Form.Group>

          {showDropdown1 && filteredItems.length > 0 ? (
            <div className='block'> 
              <div className='search-list' >
                <Row>
                  <Col>
                    <div className="d-grid gap-2">
                      {filteredItems.map((item) => (
                        <Button key={item.id} 
                        className='admin-botton-color' 
                        variant="dark" 
                        size='lg' 

                        onClick={() => handleItemClick(item, type)}>
                          {item.title}
                        </Button>
                      ))}
                    </div>
                  </Col>
                </Row>      
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className='block'> 
            <div className='search-list'>
              <Row>
                <Col>
                  <div className="d-grid gap-2">
                    {items.map((item) => (
                      <Button key={item.id} 
                      className='admin-botton-color' 
                      variant="dark" 
                      size='lg' 

                      onClick={() => handleItemClick(item)}>
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>      
            </div>
          </div>
          ) : (
            <></>
          )}

          <Form.Group>
          <Form.Label>Введите участок</Form.Label>
          <InputGroup className="mb-3" controlId="formBasicPassword" >
                    <Form.Control
                        style={{borderRadius: '20px'}}
       
                        name="plot"
                        placeholder="Поиск..."
                        className='login'
                        size='lg'
                        value={formData.plot}
                        onChange={handleInputChange}
                        onClick={handleDropdownToggle2}
                        onBlur={(e) => {
                          if (!formData.plot || formData.plot === '' || sendData.plot == null) {
                            setHasErrorPlot(true);
                            setErrorMessagePlot("Участок не выбран.");
                            document.querySelector('[name="plot"]').classList.add('error');
                            if (hasTriedToSubmit) {
                              
                              document.querySelector('[name="plot"]').classList.add('error');
                            }
                          }
                        }}
                        onFocus={() => {
                          setHasErrorPlot(false);
                          setErrorMessagePlot("");
                          document.querySelector('[name="plot"]').classList.remove('error');
                        }}
                    />
                    
                   
          </InputGroup>
          
          {hasErrorPlot && !showDropdown2 && <div className="error-message" style={{ textAlign: 'right' }}>{errorMessagePlot}</div>}

          </Form.Group>

          {showDropdown2 && filteredPlots.length > 0 ? (
            <div className='block'> 
              <div className='search-list' >
                <Row>
                  <Col>
                    <div className="d-grid gap-2">
                      {filteredPlots.map((spot) => (
                        <Button key={spot.id} 
                        className='admin-botton-color' 
                        variant="dark" 
                        size='lg'
                        onClick={() => handlePlotClick(spot)}>
                          {spot.title}
                        </Button>
                      ))}
                    </div>
                  </Col>
                </Row>      
              </div>
            </div>
          ) : filteredPlots.length === 0 ? (
            <div className='block'> 
            <div className='search-list'>
              <Row>
                <Col>
                  <div className="d-grid gap-2">
                    {spots.map((spot) => (
                      <Button key={spot.id} 
                      className='admin-botton-color' 
                      variant="dark" 
                      size='lg'
                      onClick={() => handlePlotClick(spot)}>
                        {spot.title}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>      
            </div>
          </div>
          ) : (
            <></>
          )}

          

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Введите задачу</Form.Label>
                    <Form.Control className='comment-textarea' as="textarea" 
                        ref={textareaRef1}
                        type="text"
                        name="title"
                        size='lg'
                        style={{borderRadius: "20px"}}
                        value={formData.title}
                        disabled={disabled}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (!formData.title || formData.title.trim() === '') {
                            if (hasTriedToSubmit) {
                              document.querySelector('[name="title"]').classList.add('error');
                            }
                          }
                        }}
                        onFocus={() => {
                          document.querySelector('[name="title"]').classList.remove('error');
                        }}
     

                    />
        </Form.Group> 

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Введите комментарий</Form.Label>
                    <Form.Control className='comment-textarea' as="textarea" 
                        ref={textareaRef2}
                        type="text"
                        name="comment"                
                        size='lg'
                        style={{borderRadius: "20px"}}
                        value={formData.comment}
                        onChange={handleInputChange}

     

                    />
        </Form.Group> 

        <div className="d-grid gap-2">
        <Button 
        className='admin-botton-color' 
        variant="dark" 
        size='lg'
        style={{marginTop: "80px",
                marginBottom: "80px"}}
        type='submit'
        >
          Добавить задачу
        </Button>
        </div>
        </Form>

        </div>
        </div>
        </div>
        
        <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header>
                    <Modal.Title>Задача добавлена</Modal.Title>
                  </Modal.Header>

                  <Modal.Footer style={{ justifyContent: 'center' }}>
                  <div className="d-grid gap-2 text-center" style={{width: "100%"}}>
                    <Button 
                      href="/admin-page" 
                      className='admin-botton-color' 
                      variant="dark"
                      size='lg' 
                      onClick={() => setShowModal(false)}
                      style={{ borderWidth: '2px' }}
                    >
                      Меню администратора
                    </Button>

                    <Button 
                      href="/" 
                      className='admin-botton-color' 
                      variant="dark"
                      size='lg' 
                      onClick={() => setShowModal(false)}
                      style={{ borderWidth: '2px' }}
                    >
                      Основное меню
                    </Button>
                  </div>
                  </Modal.Footer>
          </Modal>
        
        </Container>
    </>
  )
}

export default AdminTaskPage