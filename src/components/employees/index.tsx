import React, { useEffect, useState } from 'react';
import { TrainContainer, TrainContainerRecommendTrainerWideCard } from '../customers/styles.ts';
import EmployeeService from '../../services/employee.service.ts';
import DefaultTable from '../table/index.tsx';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { HiUserPlus } from "react-icons/hi2";
import { FaFileExcel } from "react-icons/fa";
import ReactModal from 'react-modal';

const Employees: React.FC<{ activeCompany }> = ({ ...props }) => {
    const [edit, setEdit] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [glanceData, setGlanceData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        gender: '',
        job: '',
        department: '',
        active: 'on',
        birth: '',
        hire: '',
        salary: 0,
        manager: '',
    });

    const columns = [
        { header: 'Nome', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Celular', accessor: 'phone' },
        { header: 'Gênero', accessor: 'gender' },
        { header: 'Trabalho', accessor: 'job' },
        { header: 'Departamento', accessor: 'department' },
    ];

    const handleModalClose = () => {
        setEdit(false);
        setFormData({
            name: '',
            email: '',
            phone:'',
            gender: '',
            job: '',
            department: '',
            birth: '',
            hire: '',
            salary: 0,
            manager: '',
            active: '',
          });
        setIsOpen(false);
    };

    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!edit){
            EmployeeService.create({companyId:props.activeCompany, formData})
                .then(() => {
                    setIsOpen(false);
                    EmployeeService.get(props.activeCompany)
                        .then((res) => setTableData(res.data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        }else{
            EmployeeService.edit({companyId:props.activeCompany, formData})
                .then(() => {
                    setIsOpen(false);
                    EmployeeService.get(props.activeCompany)
                        .then((res) => setTableData(res.data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        }
    };

    const generateColors = (numColors: number) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`);
        }
        return colors;
    };

    const CustomPieChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
        if (!data || data.length === 0) {
            data = [{ name: 'No Data', value: 0 }];
        }

        const COLORS = generateColors(data.length);

        return (
            <div>
                <h3 style={{ marginLeft: '15%' }}>{title}</h3>
                <PieChart width={440} height={150}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        wrapperStyle={{ top: 10, right: 50 }}
                    />
                </PieChart>
            </div>
        );
    };

    useEffect(() => {
        if (props.activeCompany) {
            EmployeeService.get(props.activeCompany)
                .then((res) => setTableData(res.data))
                .catch((err) => console.log(err));

            EmployeeService.glance(props.activeCompany)
                .then((res) => {
                    setGlanceData(res.data);
                })
                .catch((err) => console.log(err));
        }
    }, [props.activeCompany]);

    const departmentData = glanceData?.departments?.map(dept => ({
        name: dept.department,
        value: dept.count,
    })) || [];

    const activityData = [
        { name: 'Active', value: glanceData?.activity?.active || 0 },
        { name: 'Inactive', value: glanceData?.activity?.inactive || 0 },
    ];

    const handleRow = (row) =>{
        setEdit(true);
        setFormData({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            gender: row.gender,
            job: row.job,
            department: row.department,
            birth: row.birth,
            hire: row.hire,
            salary: row.salary,
            manager: row.manager,
            active: row.active,
          });
        handleModalOpen();
    }

    return (
        <TrainContainer>
            <div>
                <h1>Sessão de Funcionários</h1>
                <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>Aqui está as informações de seus funcionários</h4>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden', marginLeft: '-3%' }}>
                <DefaultTable data={tableData} columns={columns} handleRow={handleRow} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '3%', marginLeft: '2%', height: '100%', marginLeft: '-20%', marginTop: '5%' }}>
                <TrainContainerRecommendTrainerWideCard style={{ height: '250px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', width: '435px' }}>
                    <CustomPieChart data={departmentData} title="Funcionários por Departamento" />
                </TrainContainerRecommendTrainerWideCard>
                <div style={{ display: 'flex', flexDirection: 'column', height: '270px', marginRight: '12%', marginLeft: '2%' }}>
                    <TrainContainerRecommendTrainerWideCard onClick={handleModalOpen} style={{ width: '230px', height: '300px', marginRight: '-15%', marginLeft: '3%', display: 'flex', flexDirection: 'column' }}>
                        <h5 style={{ marginLeft: '15%', marginTop: '6%' }}>Criar novo funcionário</h5>
                        <HiUserPlus size={50} style={{ marginLeft: '37%', marginTop: '-6%' }} onClick={handleModalOpen} />
                    </TrainContainerRecommendTrainerWideCard>
                    <TrainContainerRecommendTrainerWideCard style={{ width: '230px', height: '300px', marginRight: '-15%', marginLeft: '3%', display: 'flex', flexDirection: 'column' }}>
                        <h5 style={{ marginLeft: '24%', marginTop: '6%' }}>Importar planilha</h5>
                        <FaFileExcel size={40} style={{ marginLeft: '37%', marginTop: '-6%' }} />
                    </TrainContainerRecommendTrainerWideCard>
                </div>
                <TrainContainerRecommendTrainerWideCard style={{ height: '250px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', width: '395px', marginLeft: '-10%' }}>
                    <CustomPieChart data={activityData} title="Atividade dos Funcionários" />
                </TrainContainerRecommendTrainerWideCard>
            </div>

            <ReactModal
                isOpen={isOpen}
                ariaHideApp={false}
                style={{
                    overlay: {
                        margin: 'auto',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                    content: {
                        borderRadius: '10px',
                        margin: 'auto',
                        width: '600px',
                        height: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#ffffff',
                    },
                }}
                onRequestClose={handleModalClose}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '65%', marginLeft: '18%' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '50px' }}>{ !edit ? 'Novo Funcionário' : 'Editar Funcionário' }</h3>
                    <h2 style={{ cursor: 'pointer' }} onClick={handleModalClose}>X</h2>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '65%', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo</label>
                            <input
                                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                            <input
                                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Celular</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Gênero</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                        >
                            <option value=""></option>
                            <option value="Masculine">Masculino</option>
                            <option value="Feminine">Feminino</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Trabalho</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="job"
                            type="text"
                            value={formData.job}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Departamento</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="department"
                            type="text"
                            value={formData.department}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Data de Nascimento</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="birth"
                            type="date"
                            value={formData.birth}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Data de Contratação</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="hire"
                            type="date"
                            value={formData.hire}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '15px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Salário</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="salary"
                            type="number"
                            value={formData.salary}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '20px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Gerente</label>
                        <input
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
                            name="manager"
                            type="text"
                            value={formData.manager}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '65%', marginBottom: '20px' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Ativo</label>
                        <label style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                style={{ marginRight: '10px' }}
                                name="active"
                                type="checkbox"
                                checked={formData.active}
                                onChange={handleInputChange}
                            />
                            Funcionário Ativo
                        </label>
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            width: '65%'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#45a049'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    >
                        Criar
                    </button>
                </form>
            </ReactModal>
        </TrainContainer>
    );
};

export default Employees;
