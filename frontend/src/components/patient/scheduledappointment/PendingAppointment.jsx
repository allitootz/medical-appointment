import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from "axios";
import CancelModal from "../scheduledappointment/Modal/CancelModal";
import './Appointment.css';
import { PeopleFill, ClockFill, PersonFill, PencilFill } from 'react-bootstrap-icons';
import { ip } from '../../../ContentExport';

function PendingAppointments({ appointments, setAppointments }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const defaultImage = "images/014ef2f860e8e56b27d4a3267e0a193a.jpg";
    console.log(appointments);

    const handleCancelClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAppointment(null);
    };

    const handleConfirmCancellation = (cancelReason) => {
        if (!selectedAppointment) return;
    
        console.log("Selected Appointment:", selectedAppointment);
    
        setShowModal(false);
    
        axios.put(`${ip.address}/api/patient/${selectedAppointment._id}/updateappointment`, { cancelReason: cancelReason })
            .then((response) => {
                console.log(response.data);
                setAppointments(prevAppointments => 
                    prevAppointments.map(appointment => 
                        appointment._id === selectedAppointment._id 
                        ? { ...appointment, status: 'Cancelled', cancelReason: cancelReason } 
                        : appointment
                    )
                );
                handleCloseModal();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'long' });
        const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return { day, month, dayOfWeek, monthIndex, year, fullDate: date };
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    // Group and sort appointments by month in ascending order
    const groupedAppointments = appointments
        .filter(appointment => appointment.status === 'Pending')
        .sort((a, b) => new Date(a.date) - new Date(b.date))  // Sort by date in ascending order
        .reduce((groups, appointment) => {
            const { monthIndex, month, year } = formatDate(appointment.date);
            const groupKey = `${month}-${year}`;
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    month,
                    year,
                    appointments: []
                };
            }
            groups[groupKey].appointments.push(appointment);
            return groups;
        }, {});

    return (
        <>
            <div className='d-flex justify-content-center mainContainer'>
                <Container>
                    {Object.keys(groupedAppointments).map((groupKey, index) => (
                        <React.Fragment key={index}>
                            <div className='mt-5'>
                                <h4 className='font-gray'>{groupedAppointments[groupKey].month} {groupedAppointments[groupKey].year}</h4>
                            </div>
                            {groupedAppointments[groupKey].appointments.map((appointment, i) => {
                                const { day, month, dayOfWeek, fullDate } = formatDate(appointment.date); 
                                const isAppointmentToday = isToday(fullDate);

                                // Set styles to highlight today's date in red
                                const dayStyle = {
                                    display: 'block',
                                    fontSize: '3rem',
                                    color: isAppointmentToday ? '#E03900' : '#575859'
                                };
                                const dayOfWeekStyle = {
                                    display: 'block',
                                    fontSize: '1rem',
                                    color: isAppointmentToday ? '#E03900' : '#575859'
                                };
                                
                                return (
                                    <Container className='d-flex justify-content-start subContainer shadow-sm' key={i}>
                                        <div className='aaContainer'>
                                            <p style={{ textAlign: 'center' }}>
                                                <span style={dayOfWeekStyle} >{dayOfWeek}</span>
                                                <span style={dayStyle} className='font-weight-bold'>{day}</span>
                                            </p>
                                        </div>
                                        <Container className="d-flex justify-content-start">
                                            <div className='pa-cont1'>
                                                <p style={{ fontSize: '1rem' }}> <PersonFill className='font-gray' size={20} style={{marginRight: '0.7rem'}}/> Dr. {appointment.doctor?.dr_firstName} {appointment.doctor?.dr_middleInitial}. {appointment.doctor?.dr_lastName}</p>
                                                <p style={{ fontSize: '1rem' }}> <ClockFill className='font-gray' size={20} style={{marginRight: '0.7rem'}}/> {appointment.time}</p>
                                            </div>
                                            
                                        </Container>
                                        <div className="bContainer">
                                            <Button onClick={() => handleCancelClick(appointment)}>Cancel</Button>
                                        </div>
                                    </Container>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </Container>
            </div>
            <CancelModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleConfirm={handleConfirmCancellation} 
            />
        </>
    );
}

export default PendingAppointments;
