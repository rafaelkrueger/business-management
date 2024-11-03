import React, { useState, forwardRef } from "react";
import { AlertAdapter } from '../../global.components.tsx';
import {
  EventContainer,
  EventDescription,
  EventDetails,
  EventTime,
  EventTitle,
  EventUser,
  FormButton,
  FormContainer,
  FormInput,
  FormLabel,
  SidePanelContainer
} from "./styles.ts";
import CalendarService from "../../services/calendar.service.ts";

interface SidePanelProps {
  isOpen: boolean;
  handleSidePanel: () => void;
  selectedDate: Date | null;
  events: {
    participantsId: any;
    id: string; date: Date; title: string; description?: string; user?: string; startTime?: string; endTime?: string;
}[];
  activeCompany: string;
  userData: any;
  onCreateEvent: (event: { date: Date | null; title: string; description?: string; user?: string; startTime: Date; endTime: Date }) => void;
  employees: any;
}

const SidePanel = forwardRef<HTMLDivElement, SidePanelProps>(
  ({ isOpen, handleSidePanel, selectedDate, events, onCreateEvent, activeCompany, userData, employees }, ref) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartTime, setEventStartTime] = useState('');
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
    const [eventEndTime, setEventEndTime] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('pt-BR', options) : '';

    const selectedEvents = events ? events.filter(event => event.date.toDateString() === selectedDate?.toDateString()) : [];

    const handleCreateEventClick = () => {
      setIsFormVisible(!isFormVisible);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const startDateTime = new Date(selectedDate!);
      startDateTime.setHours(Number(eventStartTime.split(':')[0]), Number(eventStartTime.split(':')[1]));

      const newEvent = {
        name: eventTitle,
        description: eventDescription,
        date: selectedDate,
        ownerId: userData._id,
        companyId: activeCompany,
        participantsId: selectedEmployees.map(employee => employee.id),
        isPublic: false,
        startTime: startDateTime,
      };

      onCreateEvent(newEvent);
      // Reset form fields
      setEventTitle('');
      setEventDescription('');
      setEventStartTime('');
      setEventEndTime('');
      setIsFormVisible(false);
      setSelectedEmployees([]);
      setSearchTerm(''); // Reset search term
      handleSidePanel();
      AlertAdapter('Evento Criado!', 'success');
    };

    const handleAddEmployee = (employeeId: string) => {
      const selectedEmployee = employees.find((employee: any) => employee.id === employeeId);

      if (selectedEmployee && !selectedEmployees.some((emp) => emp.id === employeeId)) {
        setSelectedEmployees((prevEmployees) => [...prevEmployees, selectedEmployee]);
      }
    };

    const handleRemoveEmployee = (employeeId: string) => {
      setSelectedEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId)
      );
    };

    const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee: any) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];


    return (
      <SidePanelContainer ref={ref} isOpen={isOpen}>
        <div style={{ marginLeft: '300px' }}>
          <button
            style={{
              backgroundColor: '#5a86b5',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'inline-block',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '130px',
              marginLeft: '-30%',
            }}
            onClick={handleCreateEventClick}
          >
            {!isFormVisible ? 'Criar Evento' : 'Voltar'}
          </button>
        </div>

        {isFormVisible ? (
          <FormContainer onSubmit={handleFormSubmit}>
            <FormLabel>
              Título:
              <FormInput
                maxLength={15}
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </FormLabel>
            <FormLabel>
              Descrição:
              <FormInput
                as="textarea"
                maxLength={40}
                cols={50}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              />
            </FormLabel>
            <FormLabel>
              Funcionários:
              <FormInput
                type="text"
                style={{ width: '94%' }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                placeholder="Digite o nome do funcionário"
              />
              {searchTerm && (
                <div style={{ border: '1px solid #ccc', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        style={{ padding: '10px', cursor: 'pointer' }}
                        onClick={() => {
                          handleAddEmployee(employee.id);
                          setSearchTerm('');
                        }}
                      >
                        {employee.name}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '10px' }}>Nenhum funcionário encontrado</div>
                  )}
                </div>
              )}
            </FormLabel>
            {selectedEmployees.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {selectedEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    style={{
                      marginBlock: '5px',
                      background: '#dddddd94',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px',
                    }}
                  >
                    <div>{employee.name}</div>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveEmployee(employee.id)} // Remove the employee on click
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
            )}
            <FormLabel>
              Horário:
              <div style={{ display: 'flex' }}>
                <FormInput
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  required
                />
                {/* Uncomment if end time is needed */}
                {/* <p style={{ marginLeft: '10px', marginRight: '10px' }}>Até</p>
                <FormInput
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  required
                /> */}
              </div>
            </FormLabel>
            <FormButton type="submit">Adicionar Evento</FormButton>
          </FormContainer>
        ) : (
          <h2>{formattedDate}</h2>
        )}
        {!isFormVisible && selectedEvents.length > 0 && (
          selectedEvents
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((event, idx) => {
              const eventDate = new Date(event.date);
              const eventTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <EventContainer key={idx} status={false}>
                  <div>
                    <EventTime>{eventTime}</EventTime>
                    <EventDetails>
                      <EventTitle>{event.title}</EventTitle>
                      <EventDescription>{event.description}</EventDescription>
                      <br/>
                      <EventDescription>
                      {event.participantsId && event.participantsId.length > 0
                        ? event.participantsId.map((participant) => (
                            <span key={participant.id}>{participant.name}, </span>
                          ))
                        : ''}
                    </EventDescription>
                    </EventDetails>
                  </div>
                  <p style={{ cursor: 'pointer' }} onClick={async (e) => {
                    try {
                      await CalendarService.delete(event.id);
                      handleSidePanel();
                      AlertAdapter('Evento Deletado!', 'success');
                    } catch (error) {
                      console.error('Failed to delete event:', error);
                    }
                  }}>X</p>
                </EventContainer>
              );
            })
        )}
        {!isFormVisible && selectedEvents.length === 0 && <p>No events for this date</p>}
      </SidePanelContainer>
    );
  }
);

export default SidePanel;
