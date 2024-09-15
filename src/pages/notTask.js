import React from 'react';
import { Card } from 'react-bootstrap';


function NotTask()  {
    return (
        <Card className="text-center mt-5" style={{ border: 'none', backgroundColor: '#f8f9fa' }}>
            <Card.Body>

                <Card.Title className="mt-3" style={{ fontSize: '1.5rem', color: '#6c757d' }}>
                    Задач нет
                </Card.Title>
                <Card.Text style={{ color: '#6c757d' }}>
                    Все задачи завершены или не назначены для этого работника.
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default NotTask;