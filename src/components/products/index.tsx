import React, { useEffect, useState } from 'react'
import DefaultTable from '../table/index.tsx'
import {TrainContainer, TrainContainerHeader, TrainContainerRecommendTrainerWideCard} from '../customers/styles.ts'
import ProductService from '../../services/product.service.ts'
import ReactModal from 'react-modal';
import { StreakContainer } from '../payments/styles.ts';
import { FaFileExcel } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { Form, FormGroup, Button } from 'react-bootstrap';
import Select from 'react-select/base';
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { AlertAdapter } from '../../global.components.tsx';
import { Header,Image, Title, ImagePreviewContainer ,Input, TextArea, CancelButton, FormButton, UploadButton, HiddenInput, ImageContainer, RemoveButton } from './styles.ts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Products: React.FC<{ activeCompany }> = ({ ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [glanceData, setGlanceData] = useState<any>();
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState(null);

    const columns = [
        { header: 'Nome', accessor: 'name' },
        { header: 'Descrição', accessor: 'description' },
        { header: 'Categoria', accessor: 'category' },
        { header: 'Preço', accessor: 'price' },
        { header: 'Custo', accessor: 'cost' },
        { header: 'Estoque', accessor: 'quantityInStock' },
        { header: 'Classificação', accessor: 'rating' },
        { header: 'Status', accessor: 'status' },
    ];

    const handleRow = (row) => {
        setIsEditing(true);
        setProduct(row);
    }

    useEffect(() => {
        if (isEditing) {
            setIsOpen(true)
        }
    }, [isEditing])

    useEffect(() => {
        if (props.activeCompany) {
            ProductService.get(props.activeCompany)
                .then((res) => setTableData(res.data))
                .catch((err) => console.log(err))

            ProductService.glance(props.activeCompany)
                .then((res) => setGlanceData(res.data))
                .catch((err) => console.log(err))
        }
    }, [props.activeCompany, isOpen]);

    const formattedData = glanceData ? glanceData.glanceSold.map(item => ({
        category: item.category,
        sold: Number(item.sold),
      })): [];

    return (
        <TrainContainer>
            <div>
                <h1>Sessão de Produtos</h1>
                <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>Aqui está as informações de seus produtos</h4>
            </div>
            <TrainContainerHeader style={{ marginLeft: '-5%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '3%', marginLeft: '2%', height: '100%' }}>
                    <TrainContainerRecommendTrainerWideCard onClick={() => { setIsOpen(true) }} style={{ height: '150px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ marginLeft: '20%' }}>Criar novo produto</h4>
                        <MdSell size={50} style={{ marginLeft: '41%', marginTop: '1%' }} />
                    </TrainContainerRecommendTrainerWideCard>
                    <TrainContainerRecommendTrainerWideCard style={{ height: '150px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ marginLeft: '23%' }}>Importar Planilha</h4>
                        <FaFileExcel size={50} style={{ marginLeft: '41%', marginTop: '1%' }} />
                    </TrainContainerRecommendTrainerWideCard>
                </div>

                {/* First StreakContainer showing a BarChart */}
                <StreakContainer style={{ boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', background: 'white', width: '400px', marginRight: '-10px' }}>
                    <ResponsiveContainer style={{marginTop:'25px', marginLeft:'-20px'}} width="100%" height={320}>
                        <BarChart data={glanceData?.glanceStock}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantityInStock" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </StreakContainer>

                {/* Second StreakContainer showing a PieChart */}
                <StreakContainer style={{ boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', background: 'white', width: '400px', marginRight: '-10px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                        data={formattedData}
                        dataKey="sold"
                        nameKey="category"
                        outerRadius={100}
                        fill="#8884d8"
                        >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                        layout="horizontal"
                        verticalAlign="middle"
                        wrapperStyle={{ top: 280, right: 0 }}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                </StreakContainer>
            </TrainContainerHeader>

            <div style={{ maxHeight: '230px', overflowY: 'auto', overflowX: 'hidden', marginLeft: '-3%' }}>
                <DefaultTable columns={columns} data={tableData} handleRow={handleRow} />
                <ProductModal isEditing={isEditing} setTableData={setTableData} activeCompany={props.activeCompany} isOpen={isOpen} onClose={() => { setIsEditing(false); setIsOpen(false); }} product={product} />
            </div>
        </TrainContainer>
    );
}

export default Products;


const ProductModal: React.FC<{ isEditing:boolean; setTableData:any; activeCompany:string; isOpen: boolean; onClose: () => void; product?: any }> = ({
    isEditing,
    setTableData,
    activeCompany,
    isOpen,
    onClose,
    product,
}) => {
    const [formData, setFormData] = useState({
        id:'',
        name: '',
        description: '',
        category: '',
        price: '',
        cost: '',
        quantityInStock: 0,
        height: '',
        weight: '',
        width: '',
        length: '',
        milliliters: '',
        images: [],
        rating: '',
        company: activeCompany,
        status: 'active',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    useEffect(() => {
        if (isEditing && product) {
            setFormData({
                id: product.id || '',
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                price: product.price || '',
                cost: product.cost || '',
                quantityInStock: product.quantityInStock || 0,
                height: product.height || '',
                weight: product.weight || '',
                width: product.width || '',
                length: product.length || '',
                milliliters: product.milliliters || '',
                images: product.images || [],
                rating: product.rating || '',
                company: activeCompany,
                status: product.status || 'active',
            });
        }
    }, [isEditing, product]);

    const handleModalClose = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            cost: '',
            quantityInStock: 0,
            height: '',
            weight: '',
            width: '',
            length: '',
            milliliters: '',
            images: [],
            rating: '',
            company: activeCompany,
            status: 'active',
        });
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isEditing && product){
            ProductService.edit(formData, activeCompany)
            .then(() => {
                ProductService.get(activeCompany)
                .then((res) => setTableData(res.data))
                .catch((err) => console.log(err))
                AlertAdapter('Produto alterado com sucesso!', 'success');
                handleModalClose();
            })
            .catch((err) => console.log(err));
        }else{
            ProductService.create(formData, activeCompany)
            .then(() => {
                ProductService.get(activeCompany)
                .then((res) => setTableData(res.data))
                .catch((err) => console.log(err))
                AlertAdapter('Produto criado com sucesso!', 'success');
                handleModalClose();
            })
            .catch((err) => console.log(err));
        }
    };
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    };

    const handleRemoveImage = (indexToRemove) => {
      setImages(images.filter((_, index) => index !== indexToRemove));
    };

    return (
<ReactModal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={handleModalClose}
    style={{
        overlay: {
            margin: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        content: {
            borderRadius: '10px',
            padding: '0px',
            margin: 'auto',
            width: '600px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
        },
    }}
>
    <Header>
    </Header>
    <Title>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</Title>
    <Form style={{ marginLeft: '6%' }} onSubmit={handleSubmit}>
    <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImageContainer key={index}>
            <Image src={image} alt={`uploaded-${index}`} />
            <RemoveButton onClick={() => handleRemoveImage(index)}>X</RemoveButton>
          </ImageContainer>
        ))}
      </ImagePreviewContainer>

      <UploadButton>
        Upload Images
        <HiddenInput
          type="file"
          multiple
          onChange={handleImageUpload}
          accept="image/*"
        />
      </UploadButton>

        <FormGroup>
            <p style={{ marginBottom: '3px' }}>Nome:</p>
            <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
            />
        </FormGroup>
        <FormGroup>
            <p style={{ marginBottom: '3px' }}>Descrição:</p>
            <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                cols={52}
            />
        </FormGroup>
        <FormGroup>
            <p style={{ marginBottom: '3px' }}>Categoria:</p>
            <Input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
            />
        </FormGroup>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '91%' }}>
                    <FormGroup style={{ marginRight: '10px' }}>
                        <p style={{ marginBottom: '3px' }}>Preço:</p>
                        <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <p style={{ marginBottom: '3px' }}>Custo:</p>
                        <Input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </div>
                <FormGroup>
                    <p style={{ marginBottom: '3px' }}>Quantidade em estoque:</p>
                    <Input
                        type="number"
                        name="quantityInStock"
                        value={formData.quantityInStock}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '91%' }}>
                    {/* <FormGroup style={{ marginRight: '10px' }}>
                        <p style={{ marginBottom: '3px' }}>Height: <span style={{color:'#b0b0b0dd'}}>(Opcional)</span></p>
                        <Input
                        style={{width:'94px'}}
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup style={{ marginRight: '10px' }}>
                        <p style={{ marginBottom: '3px' }}>Width: <span style={{color:'#b0b0b0dd'}}>(Opcional)</span></p>
                        <Input
                        style={{width:'94px'}}
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <p style={{ marginBottom: '3px' }}>Length: <span style={{color:'#b0b0b0dd'}}>(Opcional)</span></p>
                        <Input
                        style={{width:'94px'}}
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <p style={{ marginBottom: '3px' }}>Milliliters: <span style={{color:'#b0b0b0dd'}}>(Opcional)</span></p>
                        <Input
                        style={{width:'94px', marginLeft:'10px'}}
                            type="number"
                            name="milliliters"
                            value={formData.milliliters}
                            onChange={handleInputChange}
                        />
                    </FormGroup> */}
                </div>
                {/* <FormGroup>
                    <p style={{ marginBottom: '3px' }}>Status:</p>
                    <Select name="status" value={formData.status} onChange={handleInputChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </FormGroup> */}
                <FormButton type="submit">Submit</FormButton>
        </Form>
    </ReactModal>

    );
};