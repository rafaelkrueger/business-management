import React, { useState, useEffect, useRef } from "react";
import { CalendarContainer, Day, DaysContainer, Header, Event } from "./styles.ts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SidePanel from "../sidepanel/sidepanel.tsx";
import CalendarService from "../../services/calendar.service.ts";
import EmployeeService from "../../services/employee.service.ts";
import { useTranslation } from 'react-i18next';
import { useSnackbar } from "notistack";
import Tippy from "@tippyjs/react";
import { Info } from "lucide-react";

const Calendar: React.FC<{ activeCompany: string, userData: any }> = ({ activeCompany, userData }) => {
  const { t } = useTranslation(); // Hook para traduções

  const [calendar, setCalendar] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [sidePanel, setSidePanel] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ id: string; date: Date; title: string; description?: string; user?: string; participantsId: any; }[]>([]);
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
    if (activeCompany) {
      CalendarService.get({ companyId: activeCompany, userId: userData._id })
        .then((res) => {
          const calendarEvents = res.data.map((event: any) => ({
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

      EmployeeService.get(activeCompany)
        .then((res) => setEmployees(res.data))
        .catch((err) => console.log(err));
    }
  }, [activeCompany, userData._id, sidePanel]);

  const createEvent = (newEvent: any) => {
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
      <div style={{marginTop:window.innerWidth < 600 ? '15%' : '0%', marginLeft:window.innerWidth < 600 ? '3%' : '0%'}}>
          <h1>{t('calendar.title')}</h1>
        <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>{t('calendar.subtitle')}</h4>
      </div>

      <CalendarContainer>
        <Header>
          <IoIosArrowBack
            style={{ cursor: 'pointer' }}
            size={40}
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          />
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} {currentDate.getFullYear()}
          </h2>
          <IoIosArrowForward
            style={{ cursor: 'pointer' }}
            size={40}
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          />
        </Header>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: '-2%', color: '#505050' }}>
          <h3>{window.innerWidth > 600 ? t('calendar.days.sunday') : t('calendar.days.sunday').slice(0, 1)}</h3>
          <h3>{window.innerWidth > 600 ? t('calendar.days.monday') : t('calendar.days.monday').slice(0, 1)}</h3>
          <h3>{window.innerWidth > 600 ? t('calendar.days.tuesday') : t('calendar.days.tuesday').slice(0, 1)}</h3>
          <h3>{window.innerWidth > 600 ? t('calendar.days.wednesday') : t('calendar.days.wednesday').slice(0, 1)}</h3>
          <h3>{window.innerWidth > 600 ? t('calendar.days.thursday') : t('calendar.days.thursday').slice(0, 1)}</h3>
          <h3>{window.innerWidth > 600 ? t('calendar.days.friday') : t('calendar.days.friday').slice(0, 1)}</h3>
          <h3>{window.innerWidth > 600 ? t('calendar.days.saturday') : t('calendar.days.saturday').slice(0, 1)}</h3>
        </div>


        <DaysContainer>{renderDays()}</DaysContainer>
      </CalendarContainer>

      <SidePanel
        ref={sidePanelRef}
        isOpen={sidePanel}
        handleSidePanel={handleSidePanel}
        selectedDate={selectedDate}
        events={events}
        activeCompany={activeCompany}
        userData={userData}
        onCreateEvent={createEvent}
        employees={employees}
      />
    </>
  );
};

export default Calendar;
