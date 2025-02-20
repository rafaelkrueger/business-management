import React, { useState, useEffect } from "react";
import {
  CalendarContainer,
  Day,
  DaysContainer,
  Header,
  Event,
} from "../../../calendar/styles.ts"; // adapte conforme seu setup
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import AutomationService from "../../../../services/automation.service.ts";

const AutomationCalendar = ({ activeCompany }) => {
  const [automations, setAutomations] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Busca as automações da empresa ativa e mapeia para eventos do calendário,
  // filtrando apenas as automações com status "PENDING".
  const fetchAutomations = async () => {
    try {
      const response = await AutomationService.getAutomation(activeCompany);
      // Filtra somente as automações com status PENDING
      const data = response.data.filter((automation) => automation.status === "PENDING");
      setAutomations(data);

      // Define o intervalo do mês corrente
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

      const mappedEvents = [];

      data.forEach((automation) => {
        const repeatInterval = Number(automation.repeatInterval); // em horas
        let eventDate = new Date(automation.nextExecutionTime);

        // Se não houver repeatInterval ou for 0, adiciona o evento único, se estiver no mês atual
        if (!repeatInterval || repeatInterval <= 0) {
          if (eventDate >= monthStart && eventDate <= monthEnd) {
            mappedEvents.push({
              id: automation.id,
              date: eventDate,
              title: automation.name,
            });
          }
        } else {
          // Gera eventos para cada repetição que cai no mês corrente
          const intervalMs = repeatInterval * 3600000;
          while (eventDate <= monthEnd) {
            if (eventDate >= monthStart) {
              mappedEvents.push({
                id: automation.id,
                date: new Date(eventDate),
                title: automation.name,
              });
            }
            eventDate = new Date(eventDate.getTime() + intervalMs);
          }
        }
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Erro ao buscar automações:", error);
    }
  };

  useEffect(() => {
    if (activeCompany) {
      fetchAutomations();
    }
    // Recarrega as automações sempre que activeCompany ou currentDate mudar
  }, [activeCompany, currentDate]);

  // Verifica se a data passada é hoje (para destacar)
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Renderiza os dias do mês, adicionando "slots" vazios para o início do mês
  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay(); // 0 (Domingo) a 6 (Sábado)

    const days = [];

    // Adiciona células vazias para os dias antes do início do mês
    for (let i = 0; i < startDay; i++) {
      days.push(<Day key={`empty-${i}`} className="empty" />);
    }

    // Para cada dia do mês, renderiza o número e os eventos daquele dia
    for (let day = 1; day <= totalDays; day++) {
      const dayDate = new Date(year, month, day);
      const dayEvents = events.filter(
        (event) => event.date.toDateString() === dayDate.toDateString()
      );

      days.push(
        <Day
          key={day}
          isToday={isToday(dayDate)}
          onClick={() => {
            console.log("Clicou no dia:", dayDate);
          }}
        >
          <span>{day}</span>
          {dayEvents.length > 0 && (
            <div>
              {dayEvents.map((event, idx) => (
                <Event key={idx}>{event.title}</Event>
              ))}
            </div>
          )}
        </Day>
      );
    }
    return days;
  };

  return (
    <CalendarContainer style={{ width: "95%" }}>
      <Header>
        <IoIosArrowBack
          size={40}
          style={{ cursor: "pointer" }}
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setMonth(currentDate.getMonth() - 1))
            )
          }
        />
        <h2>
          {currentDate.toLocaleString("default", { month: "long" }).toUpperCase()}{" "}
          {currentDate.getFullYear()}
        </h2>
        <IoIosArrowForward
          size={40}
          style={{ cursor: "pointer" }}
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setMonth(currentDate.getMonth() + 1))
            )
          }
        />
      </Header>
      <DaysContainer>{renderDays()}</DaysContainer>
    </CalendarContainer>
  );
};

export default AutomationCalendar;
