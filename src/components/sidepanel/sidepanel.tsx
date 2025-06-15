// SidePanel.tsx
import React, { useState, forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import CalendarService from "../../services/calendar.service.ts";
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
import { TextField, Button, Typography } from "@mui/material";

interface SidePanelProps {
  isOpen: boolean;
  handleSidePanel: () => void;
  selectedDate: Date | null;
  events: {
    participantsId?: any[];
    customersIds?: any[];
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
    endTime?: Date;
    participantsId: string[];
    customersIds: string[];
  }) => void;
  employees?: any[];
  customers?: any[];
}

const SidePanel = forwardRef<HTMLDivElement, SidePanelProps>(
  (
    {
      isOpen,
      handleSidePanel,
      selectedDate,
      events,
      onCreateEvent,
      activeCompany,
      userData,
      employees = [],
      customers = []
    },
    ref
  ) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    // Estados do formulário e seleção
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCustomerTerm, setSearchCustomerTerm] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
    const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    const formattedDate = selectedDate
      ? selectedDate.toLocaleDateString("pt-BR", options)
      : "";
    const selectedEvents = events
      ? events.filter(
          (event) =>
            event.date.toDateString() === selectedDate?.toDateString()
        )
      : [];

    const handleCreateEventClick = () => setIsFormVisible(!isFormVisible);

    const filteredEmployees = Array.isArray(employees)
      ? employees.filter((employee: any) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
    const filteredCustomers = Array.isArray(customers)
      ? customers.filter((customer: any) =>
          customer.name.toLowerCase().includes(searchCustomerTerm.toLowerCase())
        )
      : [];

    const handleAddEmployee = (employeeId: string) => {
      const foundEmployee = employees.find(
        (employee: any) => employee.id === employeeId
      );
      if (foundEmployee && !selectedEmployees.some((emp) => emp.id === employeeId)) {
        setSelectedEmployees((prev) => [...prev, foundEmployee]);
      }
    };

    // Adiciona cliente selecionado (evita duplicatas)
    const handleAddCustomer = (customerId: string) => {
      const foundCustomer = customers.find(
        (customer: any) => customer.id === customerId
      );
      if (foundCustomer && !selectedCustomers.some((cust) => cust.id === customerId)) {
        setSelectedCustomers((prev) => [...prev, foundCustomer]);
      }
    };

    // Remove funcionário da seleção
    const handleRemoveEmployee = (employeeId: string) => {
      setSelectedEmployees((prev) =>
        prev.filter((employee: any) => employee.id !== employeeId)
      );
    };

    // Remove cliente da seleção
    const handleRemoveCustomer = (customerId: string) => {
      setSelectedCustomers((prev) =>
        prev.filter((customer: any) => customer.id !== customerId)
      );
    };

    // Validações e envio do evento
    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedDate) {
        enqueueSnackbar(t("sidepanel.invalidDate"), { variant: "error" });
        return;
      }
      if (!eventTitle.trim()) {
        enqueueSnackbar(t("sidepanel.titleRequired"), { variant: "error" });
        return;
      }
      if (!eventStartTime) {
        enqueueSnackbar(t("sidepanel.startTimeRequired"), { variant: "error" });
        return;
      }
      const startDateTime = new Date(selectedDate);
      const [startHour, startMinute] = eventStartTime.split(":");
      startDateTime.setHours(Number(startHour), Number(startMinute));

      const newEvent = {
        name: eventTitle,
        description: eventDescription,
        date: selectedDate,
        ownerId: userData._id,
        companyId: activeCompany,
        participantsId: selectedEmployees.map((emp) => emp.id),
        customersIds: selectedCustomers.map((cust) => cust.id),
        isPublic: false,
        startTime: startDateTime,
      };

      onCreateEvent(newEvent);

      setEventTitle("");
      setEventDescription("");
      setEventStartTime("");
      setEventEndTime("");
      setIsFormVisible(false);
      setSelectedEmployees([]);
      setSelectedCustomers([]);
      setSearchTerm("");
      setSearchCustomerTerm("");
      handleSidePanel();
      enqueueSnackbar(t("sidepanel.eventCreated"), { variant: "success" });
    };

    return (
      <SidePanelContainer ref={ref} isOpen={isOpen}>
        <div
          style={{
            marginLeft: window.innerWidth > 600 ? "300px" : "0",
            width: window.innerWidth > 600 ? "unset" : "100%",
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: window.innerWidth > 600 ? "flex-start" : "space-between",
            padding: window.innerWidth < 600 ? "0 10px" : "0",
          }}
        >
          <button
            style={{
              backgroundColor: "#578acd",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              textAlign: "center",
              fontSize: "16px",
              borderRadius: "8px",
              cursor: "pointer",
              width: "130px",
              marginLeft: window.innerWidth > 600 ? "-30%" : "-4%",
            }}
            onClick={handleCreateEventClick}
          >
            {!isFormVisible ? t("sidepanel.createEvent") : t("sidepanel.back")}
          </button>

          {window.innerWidth < 600 && (
            <button
              style={{
                background: "none",
                color: "black",
                border: "none",
                padding: "0",
                fontSize: "24px",
                cursor: "pointer",
                lineHeight: "1",
                marginRight: "30px",
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
              {t("sidepanel.form.title")}:
              <FormInput
                maxLength={15}
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </FormLabel>
            <FormLabel>
              {t("sidepanel.form.description")}:
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
              {t("sidepanel.employees")}:
              <FormInput
                type="text"
                style={{ width: "94%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("sidepanel.searchEmployee")}
              />
              {searchTerm && (
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        style={{ padding: "10px", cursor: "pointer" }}
                        onClick={() => {
                          handleAddEmployee(employee.id);
                          setSearchTerm("");
                        }}
                      >
                        {employee.name}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>
                      {t("sidepanel.noEmployeeFound")}
                    </div>
                  )}
                </div>
              )}
              {selectedEmployees.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>{t("sidepanel.selectedEmployees")}:</strong>
                  <div>
                    {selectedEmployees.map((emp) => (
                      <span key={emp.id} style={{ marginRight: "8px" }}>
                        {emp.name}
                        <Button onClick={() => handleRemoveEmployee(emp.id)} size="small">
                          X
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </FormLabel>
            <FormLabel>
              {t("sidepanel.customers")}:
              <FormInput
                type="text"
                style={{ width: "94%" }}
                value={searchCustomerTerm}
                onChange={(e) => setSearchCustomerTerm(e.target.value)}
                placeholder={t("sidepanel.searchCustomers")}
              />
              {searchCustomerTerm && (
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        style={{ padding: "10px", cursor: "pointer" }}
                        onClick={() => {
                          handleAddCustomer(customer.id);
                          setSearchCustomerTerm("");
                        }}
                      >
                        {customer.name}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>
                      {t("sidepanel.noCustomerFound")}
                    </div>
                  )}
                </div>
              )}
              {selectedCustomers.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>{t("sidepanel.selectedCustomers")}:</strong>
                  <div>
                    {selectedCustomers.map((cust) => (
                      <span key={cust.id} style={{ marginRight: "8px" }}>
                        {cust.name}
                        <Button onClick={() => handleRemoveCustomer(cust.id)} size="small">
                          X
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </FormLabel>
            <FormLabel>
              {t("sidepanel.form.time")}:
              <div style={{ display: "flex" }}>
                <FormInput
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  required
                />
              </div>
            </FormLabel>
            <FormButton type="submit">{t("sidepanel.addEvent")}</FormButton>
          </FormContainer>
        ) : (
          <h2>{formattedDate}</h2>
        )}

        {!isFormVisible &&
          selectedEvents.length > 0 &&
          selectedEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event, idx) => {
              const eventDate = new Date(event.date);
              const eventTime = eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <EventContainer key={idx} status={false}>
                  <div>
                    <EventTime>{eventTime}</EventTime>
                    <EventDetails>
                      <EventTitle>{event.title}</EventTitle>
                      <EventDescription>{event.description}</EventDescription>
                      <br />
                      <EventDescription style={{ display: "flex" }}>
                        <p style={{ marginRight: "10px" }}>
                          {t("sidepanel.employees")}:
                        </p>
                        <p>
                          {event.participantsId?.length > 0
                            ? event.participantsId.map((participant: any) => (
                                <span key={participant.id}>
                                  {participant.name},{" "}
                                </span>
                              ))
                            : ""}
                        </p>
                      </EventDescription>
                      <EventDescription style={{ display: "flex", marginTop: "-15%" }}>
                        <p style={{ marginRight: "10px" }}>
                          {t("sidepanel.customers")}:
                        </p>
                        <p>
                          {event.customersIds?.length > 0
                            ? event.customersIds.map((customer: any) => (
                                <span key={customer.id}>
                                  {customer.name},{" "}
                                </span>
                              ))
                            : ""}
                        </p>
                      </EventDescription>
                    </EventDetails>
                  </div>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      try {
                        await CalendarService.delete(event.id);
                        handleSidePanel();
                        enqueueSnackbar(t("sidepanel.eventDeleted"), {
                          variant: "success",
                        });
                      } catch (error) {
                        console.error("Failed to delete event:", error);
                      }
                    }}
                  >
                    X
                  </p>
                </EventContainer>
              );
            })}
        {!isFormVisible && selectedEvents.length === 0 && (
          <p>{t("sidepanel.noEventsForDate")}</p>
        )}
      </SidePanelContainer>
    );
  }
);

export default SidePanel;
