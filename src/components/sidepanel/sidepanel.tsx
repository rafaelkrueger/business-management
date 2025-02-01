import React, { useState, forwardRef } from "react";
import { useTranslation } from 'react-i18next';
import { useSnackbar } from "notistack";
import CalendarService from "../../services/calendar.service.ts";
import { AlertAdapter } from '../../global.components.tsx';
import {
  EventContainer,
  EventDescription,
  EventDetails,
  EventTime,
  EventTitle,
  FormButton,
  FormContainer,
  FormInput,
  FormLabel,
  SidePanelContainer
} from "./styles.ts";
import { TextField } from "@mui/material";

interface SidePanelProps {
  isOpen: boolean;
  handleSidePanel: () => void;
  selectedDate: Date | null;
  events: {
    participantsId: any;
    id: string;
    date: Date;
    title: string;
    description?: string;
    user?: string;
    startTime?: string;
    endTime?: string;
  }[];
  activeCompany: string;
  userData: any;
  onCreateEvent: (event: {
    date: Date | null;
    title: string;
    description?: string;
    user?: string;
    startTime: Date;
    endTime: Date;
  }) => void;
  employees: any;
}

const SidePanel = forwardRef<HTMLDivElement, SidePanelProps>(
  ({ isOpen, handleSidePanel, selectedDate, events, onCreateEvent, activeCompany, userData, employees }, ref) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartTime, setEventStartTime] = useState('');
    const [eventEndTime, setEventEndTime] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('pt-BR', options) : '';
    const selectedEvents = events ? events.filter(event => event.date.toDateString() === selectedDate?.toDateString()) : [];

    const handleCreateEventClick = () => setIsFormVisible(!isFormVisible);

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

      setEventTitle('');
      setEventDescription('');
      setEventStartTime('');
      setEventEndTime('');
      setIsFormVisible(false);
      setSelectedEmployees([]);
      setSearchTerm('');
      handleSidePanel();
      enqueueSnackbar(t('sidepanel.eventCreated'), { variant: 'success' });
    };

    const handleAddEmployee = (employeeId: string) => {
      const selectedEmployee = employees.find((employee: any) => employee.id === employeeId);
      if (selectedEmployee && !selectedEmployees.some((emp) => emp.id === employeeId)) {
        setSelectedEmployees((prevEmployees) => [...prevEmployees, selectedEmployee]);
      }
    };

    const handleRemoveEmployee = (employeeId: string) => {
      setSelectedEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== employeeId));
    };

    const filteredEmployees = Array.isArray(employees)
      ? employees.filter((employee: any) => employee.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : [];

    return (
      <SidePanelContainer ref={ref} isOpen={isOpen}>
        <div
          style={{
            marginLeft: window.innerWidth > 600 ? '300px' : '0',
            width: window.innerWidth > 600 ? 'unset' : '100%',
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: window.innerWidth > 600 ? 'flex-start' : 'space-between',
            padding: window.innerWidth < 600 ? '0 10px' : '0',
          }}
        >
          <button
            style={{
              backgroundColor: '#5a86b5',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              textAlign: 'center',
              textDecoration: 'none',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '130px',
              marginLeft: window.innerWidth > 600 ? '-30%' : '-4%',
            }}
            onClick={handleCreateEventClick}
          >
            {!isFormVisible ? t('sidepanel.createEvent') : t('sidepanel.back')}
          </button>

          {window.innerWidth < 600 && (
            <button
              style={{
                background: 'none',
                color: 'black',
                border: 'none',
                padding: '0',
                fontSize: '24px',
                cursor: 'pointer',
                lineHeight: '1',
                marginRight: '30px',
              }}
              onClick={handleSidePanel}
            >
              X
            </button>
          )}
        </div>

        {isFormVisible ? (
          <FormContainer onSubmit={handleFormSubmit}>
            <FormLabel>
              {t('sidepanel.title')}:
              <FormInput
                maxLength={15}
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </FormLabel>
            <FormLabel>
              {t('sidepanel.description')}:
              <FormInput
                as="textarea"
                maxLength={40}
                rows={10}
                cols={50}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              />
            </FormLabel>
            <FormLabel>
              {t('sidepanel.employees')}:
              <FormInput
                type="text"
                style={{ width: '94%' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('sidepanel.searchEmployee')}
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
                    <div style={{ padding: '10px' }}>{t('sidepanel.noEmployeeFound')}</div>
                  )}
                </div>
              )}
            </FormLabel>
            <FormLabel>
              {t('sidepanel.time')}:
              <div style={{ display: 'flex' }}>
                <FormInput
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  required
                />
              </div>
            </FormLabel>
            <FormButton type="submit">{t('sidepanel.addEvent')}</FormButton>
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
                      <br />
                      <EventDescription>
                        {event.participantsId && event.participantsId.length > 0
                          ? event.participantsId.map((participant) => (
                              <span key={participant.id}>{participant.name}, </span>
                            ))
                          : ''}
                      </EventDescription>
                    </EventDetails>
                  </div>
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await CalendarService.delete(event.id);
                        handleSidePanel();
                        enqueueSnackbar(t('sidepanel.eventDeleted'), { variant: 'success' });
                      } catch (error) {
                        console.error('Failed to delete event:', error);
                      }
                    }}
                  >
                    X
                  </p>
                </EventContainer>
              );
            })
        )}

        {!isFormVisible && selectedEvents.length === 0 && <p>{t('sidepanel.noEventsForDate')}</p>}
      </SidePanelContainer>
    );
  }
);

export default SidePanel;