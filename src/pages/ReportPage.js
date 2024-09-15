import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputMask from 'react-input-mask';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import { sendGetRequestAndDownloadFile } from '../utils/requests';

import '../css/date.css'
import '../css/page.css'
import '../css/arrow.css'

function ReportPage() {
    registerLocale('ru', ru);
    setDefaultLocale('ru');
    const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);
    const [formData, setFormData] = useState({
        date1: '',
        date2: '',      
      });


    const validateForm = () => {
        const emptyFields = Object.keys(formData).filter((fieldName) => {
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

    
    
        try {

            var response = await sendGetRequestAndDownloadFile(`generate-report/?start_time=${formData.date1}&end_time=${formData.date2}`, `${formData.date1}_${formData.date2}.xlsx`);
            console.log(response) 
  
        } catch (error) {
            console.error('Error:', error);
        }
    
      }; 

    const handleDate1 = (date) => {
        let formattedDate = null;
  
        if (date) {
          let year = date.getFullYear()
          let month = date.getMonth() + 1;
          let day = date.getDate();
          if (month < 10) {
            month = `0${month}`;
          }
  
          if (day < 10) {
            day = `0${day}`;
          }
          formattedDate = `${year}-${month}-${day}`;
        }
  
        console.log(formattedDate)
        setFormData({
          ...formData,
          date1: formattedDate,
        });
      };

    const handleDate2 = (date) => {
        let formattedDate = null;
  
        if (date) {
          let year = date.getFullYear()
          let month = date.getMonth() + 1;
          let day = date.getDate();
          if (month < 10) {
            month = `0${month}`;
          }
  
          if (day < 10) {
            day = `0${day}`;
          }
          formattedDate = `${year}-${month}-${day}`;
        }
  
        console.log(formattedDate)
        setFormData({
          ...formData,
          date2: formattedDate,
        });
      };

    const parseDateFromString = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // Вычитаем 1 из месяца, так как месяцы в JavaScript начинаются с 0
      };


    const isDateEmpty = formData.date1 === '';
    const shouldApplyRedStyle1 = hasTriedToSubmit && isDateEmpty;

    const isDateEmpty1 = formData.date2 === '';
    const shouldApplyRedStyle2 = hasTriedToSubmit && isDateEmpty1;

  return (
    <>
        <Container >
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
            href='/admin-page'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
        </Button>
        <div className='header'>GD TIME<br/>Отчет</div>
        </div>
        <Form onSubmit={handleAddClick}>
        <div className='block'>
        <Row className='admin-botton'>
        <Col>
        <Form.Group controlId="dob" className='mb-3'>
                    <Col>
                    <Form.Label>Выберите первую дату</Form.Label>
                    </Col>
                    <Col >
                    <div className="customDatePickerWidth">
                    <DatePicker
                            style={{width: '100% !important'}}
                            selected={formData.date1 ? parseDateFromString(formData.date1) : null}
                            onChange={handleDate1}
                            dateFormat="dd-MM-yyyy" 
                            showMonthDropdown 
                            showYearDropdown
                            dropdownMode="select"
                            customInput={
                                <Form.Control
                                    name = 'date1'
                                    className={`custom-datepicker-input ${
                                        shouldApplyRedStyle1 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                      }`}
                                    as={InputMask}
                                    mask="99-99-9999"
                                    size='lg'
                                    style={{ width: '100%', borderWidth: '2px', borderRadius: '20px', borderColor: 'black', boxShadow: 'none' }}
                                    />
                              }
                    />
                    </div>
                    </Col>
        </Form.Group>
        </Col>

        <Col>
        <Form.Group controlId="dob" className='mb-3'>
                    <Col>
                    <Form.Label>Выберите вторую дату</Form.Label>
                    </Col>
                    <Col >
                    <div className="customDatePickerWidth">
                    <DatePicker
                            style={{width: '100% !important'}}
                            selected={formData.date2 ? parseDateFromString(formData.date2) : null}
                            onChange={handleDate2}
                            dateFormat="dd-MM-yyyy" 
                            showMonthDropdown 
                            showYearDropdown
                            dropdownMode="select"
                            customInput={
                                <Form.Control
                                    name = 'date2'
                                    className={`custom-datepicker-input ${
                                        shouldApplyRedStyle2 ? 'red-form' : '' // Опциональный стиль для поля ввода
                                      }`}
                                    as={InputMask}
                                    mask="99-99-9999"
                                    size='lg'
                                    style={{ width: '100%', borderWidth: '2px', borderRadius: '20px', borderColor: 'black', boxShadow: 'none' }}
                                    />
                              }
                    />
                    </div>
                    </Col>
        </Form.Group>
        </Col>
        </Row>
        </div>
        <div className='block'>
        <Col className='admin-botton'>                      
        <div className="d-grid gap-2" style={{marginTop: '200px'}}>
        <Button className='admin-botton-color'  variant="dark" type='submit' size='lg'>Скачать отчет</Button>
        </div>
        </Col>
        </div>
        </Form>
        </Container>
    </>
  )
}

export default ReportPage