import React, { useState, useEffect, useRef } from "react";
import { CalendarContainer, Day, DaysContainer, Header, Event } from "./styles.ts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SidePanel from "../sidepanel/sidepanel.tsx";
import CalendarService from "../../services/calendar.service.ts";
import EmployeeService from "../../services/employee.service.ts";

const Calendar: React.FC<{ activeCompany, userData }> = ({ ...props }) => {
  const [calendar, setCalendar] = useState();
  const[employees, setEmployees] = useState()
  const [sidePanel, setSidePanel] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ id:string; date: Date; title: string; description?: string; user?: string; participantsId: any;}[]>([]);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleSidePanel = () => {
    setSidePanel(!sidePanel);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setSidePanel(true);
  };

  const renderDays = () => {
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days: JSX.Element[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<Day className="empty" key={`empty-${i}`} />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = events.filter(event => event.date.toDateString() === dayDate.toDateString());

      days.push(
        <Day
          selected={selectedDate?.getDate() === day}
          isToday={isToday(dayDate)}
          key={day}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {dayEvents.length > 0 && (
            <div>
              {dayEvents.map((event, idx) => (
                <Event style={{ marginTop: '5%' }} key={idx}>{event.title}</Event>
              ))}
            </div>
          )}
        </Day>
      );
    }

    return days;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidePanel && sidePanelRef.current && !sidePanelRef.current.contains(event.target as Node)) {
        setSelectedDate(null);
        setSidePanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidePanel]);

  useEffect(() => {
    if (props.activeCompany) {
      CalendarService.get({ companyId: props.activeCompany, userId: props.userData._id })
        .then((res) => {
          const calendarEvents = res.data.map((event) => ({
            id: event.id,
            date: new Date(event.date),
            title: event.name,
            description: event.description,
            user: event.ownerId,
            participantsId: event.participantsId,
          }));
          setCalendar(res.data);
          setEvents(calendarEvents);
        })
        .catch((err) => console.log(err));
        EmployeeService.get(props.activeCompany)
        .then((res) => setEmployees(res.data))
        .catch((err) => console.log(err));
    }
  }, [props.activeCompany, props.userData._id, sidePanel]);

  const createEvent = (newEvent) => {
    CalendarService.post(newEvent)
      .then((res) => {
        setEvents((prevEvents) => [...prevEvents, {
          id: res.data.id,
          date: new Date(res.data.date),
          title: res.data.name,
          description: res.data.description,
          user: res.data.ownerId,
          participantsId: res.data.participantsId,
        }]);
        setCalendar((prev) => [...prev, res.data]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div>
        <h1>Calendário da Empresa</h1>
        <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>Verifique agendamento da empresa</h4>
      </div>
      <CalendarContainer>
        <Header>
          <IoIosArrowBack size={40} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}/>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} {currentDate.getFullYear()}
          </h2>
          <IoIosArrowForward size={40} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}/>
        </Header>
        <div style={{display:'flex', justifyContent:'space-around', marginLeft:'-2%', color:'#505050'}}>
          <h3>Domingo</h3>
          <h3>Segunda</h3>
          <h3>Terça</h3>
          <h3>Quarta</h3>
          <h3>Quinta</h3>
          <h3>Sexta</h3>
          <h3>Sábado</h3>
        </div>
        <DaysContainer>{renderDays()}</DaysContainer>
      </CalendarContainer>
      <SidePanel
        ref={sidePanelRef}
        isOpen={sidePanel}
        handleSidePanel={handleSidePanel}
        selectedDate={selectedDate}
        events={events}
        activeCompany={props.activeCompany}
        userData={props.userData}
        onCreateEvent={createEvent}
        employees={employees}
        />
    </>
  );
};

export default Calendar;
