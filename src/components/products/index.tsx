import React, { useEffect, useState } from 'react'
import DefaultTable from '../table/index.tsx'
import { TrainContainer } from './styles.ts';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    IconButton,
    Chip,
    Box,
  } from '@mui/material';
  import { Close, Delete } from '@mui/icons-material';
import ProductService from '../../services/product.service.ts'
import { StreakContainer } from '../payments/styles.ts';
import { FaFileExcel, FaRobot } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription, EmptyStateButton } from './styles.ts';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from "notistack";
import { AllInOneApi } from '../../Api.ts';
import { Brain, FileSpreadsheet, Info } from 'lucide-react';
import Tippy from '@tippyjs/react';
import AiAssistantModal from '../ai-assistant-modal/index.tsx';
import styled from 'styled-components';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const TrainContainerHeader = styled.div`
    display: flex;
    @media (max-width:600px) {
        flex-direction: column;
        width: 100%;
    }
`

const TrainContainerRecommendTrainerWideCard = styled.div`
    width: 250px;
    height: 100px;
    background-color: rgba(255,255,255,0.7);
    margin-left: 18%;
    margin-bottom: 15%;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
        margin-left: 1.5%;
        margin-top: 15%;
        margin-bottom: -5%;
        width:95%;
        height: 150px;
    }
`

const NoDataMessage = () =>{
    const { t } = useTranslation();
 return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#555',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '48px', animation: 'spin 2s linear infinite' }}>📊</div>
      <h2 style={{ margin: '10px 0', fontSize: '24px' }}>{t('products.noData')}</h2>
      <p style={{ fontSize: '16px', marginTop: '0px' }}>{t('products.again')}</p>
    </div>
  );
}


const Products: React.FC<{ activeCompany }> = ({ ...props }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [glanceData, setGlanceData] = useState<any>();
    const [isOpen, setIsOpen] = useState(false);
    const [aiAssistant, setAiAssistant] = useState(false);
    const [product, setProduct] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);

    const columns = [
        { header: t('products.name'), accessor: 'name' },
        { header: t('products.description'), accessor: 'description' },
        { header: t('products.category'), accessor: 'category' },
        { header: t('products.price'), accessor: 'price' },
        { header: t('products.cost'), accessor: 'cost' },
        { header: t('products.stock'), accessor: 'quantityInStock' },
        { header: t('products.status'), accessor: 'status' },
    ];

    const handleRow = (row) => {
        setIsEditing(true);
        setProduct(row);
    };

    useEffect(() => {
        if (isEditing) {
            setIsOpen(true);
        }
    }, [isEditing]);

    useEffect(() => {
        if (props.activeCompany) {
            ProductService.get(props.activeCompany)
                .then((res) => setTableData(res.data))
                .catch((err) => console.log(err));

            ProductService.glance(props.activeCompany)
                .then((res) => setGlanceData(res.data))
                .catch((err) => console.log(err));
        }
    }, [props.activeCompany, isOpen]);

    const formattedData = glanceData ? glanceData.glanceSold.map(item => ({
        category: item.category,
        sold: Number(item.sold),
    })) : [];

    const renderEmptyState = () => (
        <EmptyStateContainer>
            <EmptyStateTitle>{t('products.emptyStateTitle')}</EmptyStateTitle>
            <EmptyStateDescription>{t('products.emptyStateDescription')}</EmptyStateDescription>
            <EmptyStateButton onClick={() => setIsOpen(true)}>
                <MdSell size={20} style={{ marginRight: '10px' }} />
                {t('products.createProduct')}
            </EmptyStateButton>
            <EmptyStateButton onClick={() => console.log('Importar Planilha')}>
                <FaFileExcel size={20} style={{ marginRight: '10px' }} />
                {t('products.importSpreadsheet')}
            </EmptyStateButton>
        </EmptyStateContainer>
    );

            return (
                <TrainContainer style={{margin:'3%'}}>
                    <AiAssistantModal isOpen={aiAssistant} onClose={()=>{setAiAssistant(false)}} companyId={props.activeCompany} type={t('aiAssistant.types.product')}/>
                    <div>
                      <div style={{display:'flex'}}>
                        <h1>{t('products.productSession')}</h1>
                        {
                          window.innerWidth > 600 && (
                          <Tippy content={t('products.tooltipText')} placement="right">
                            <Info size={20} style={{ marginLeft: '10px', cursor: 'pointer', marginTop:'3.5%' }} />
                          </Tippy>
                          )
                        }
                      </div>
                        <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>{t('products.productInfo')}</h4>
                    </div>
                    <TrainContainerHeader style={{ marginLeft: '-5%' }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', marginRight: '3%', marginLeft: '2%', height: '100%', marginBottom: window.innerWidth > 600 ? '0%' : '15%' }}>
                    {/* Card 1: Criar Produto */}
                    <TrainContainerRecommendTrainerWideCard
                        onClick={() => setIsOpen(true)}
                        style={{
                            height: '120px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <h4 style={{ marginTop: '-10px', fontSize: '18px', fontWeight: '600', color: '#333' }}>{t('products.createProduct')}</h4>
                        <MdSell size={50} style={{ marginTop: '-10px', color: '#007bff' }} />
                    </TrainContainerRecommendTrainerWideCard>

                    {/* Card 2: Importar Planilha */}
                    <TrainContainerRecommendTrainerWideCard
                        style={{
                            height: '120px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <h4 style={{  marginTop: '-10px', fontSize: '18px', fontWeight: '600', color: '#333' }}>{t('products.importSpreadsheet')}</h4>
                        <FileSpreadsheet size={50} style={{ marginTop: '-10px', color: '#28a745' }} />
                    </TrainContainerRecommendTrainerWideCard>

                    {/* Card 3: IA */}
                    <TrainContainerRecommendTrainerWideCard
                        onClick={()=>{setAiAssistant(true)}}
                        style={{
                            height: '120px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <h4 style={{ marginTop: '-10px', fontSize: '18px', fontWeight: '600', color: '#333' }}>{t('products.ai')}</h4>
                        <Brain size={50} style={{ marginTop: '-15px', color: 'purple' }} />
                    </TrainContainerRecommendTrainerWideCard>
                </div>
                <StreakContainer style={{ background: 'white', width: window.innerWidth > 600 ? '400px' : '300px', height: '440px' }}>
                {glanceData?.glanceStock?.length > 0 ? (
                <ResponsiveContainer width="100%" height={440} style={{ marginLeft: '-8%', marginTop: '3%' }}>
                    <BarChart data={glanceData.glanceStock}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantityInStock" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                <NoDataMessage />
                )}
            </StreakContainer>

            <StreakContainer style={{ background: 'white', width: window.innerWidth > 600 ? '400px' : '300px', marginLeft: window.innerWidth > 600 ? '60px' : '15px', height: '440px' }}>
                {formattedData?.length < 0 ? (
                <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                    <Pie data={formattedData} dataKey="sold" nameKey="category" outerRadius={100} fill="#8884d8">
                        {formattedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
                ) : (
                <NoDataMessage />
                )}
            </StreakContainer>
            </TrainContainerHeader>

            {tableData.length === 0 ? (
                renderEmptyState()
            ) : (
                <div style={{maxWidth: window.innerWidth < 600 ? '90%' : 'unset', overflowX: window.innerWidth < 600 ? 'scroll' : 'unset'}}>
                    <DefaultTable columns={columns} data={tableData} handleRow={handleRow} />
                </div>
            )}

            <ProductModal
                isEditing={isEditing}
                setTableData={setTableData}
                activeCompany={props.activeCompany}
                isOpen={isOpen}
                onClose={() => { setIsEditing(false); setIsOpen(false); }}
                product={product}
            />
        </TrainContainer>
    );
};

export default Products;


const ProductModal: React.FC<{
  isEditing: boolean;
  setTableData: any;
  activeCompany: string;
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}> = ({ isEditing, setTableData, activeCompany, isOpen, onClose, product }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    id: '',
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

  const [images, setImages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImages(product.images || []);
    }
  }, [isEditing, product, activeCompany]);

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
    setImages([]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const uploadedImageUrls = await uploadImagesToApi(images);
        const dataToSubmit = { ...formData, images: uploadedImageUrls };

      if (isEditing && product) {
        await ProductService.edit(dataToSubmit, activeCompany);
        enqueueSnackbar(t("Product updated!"), { variant: "success" });
      } else {
        await ProductService.create(dataToSubmit, activeCompany);
        enqueueSnackbar(t("Product created!"), { variant: "success" });
      }

      const res = await ProductService.get(activeCompany);
      setTableData(res.data);
      handleModalClose();
    } catch (error) {
      enqueueSnackbar(t("Erro ao salvar o produto."), { variant: "error" });
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const uploadImagesToApi = async (imageFiles: File[]) => {
    const uploadedImageUrls: string[] = [];

    for (const file of imageFiles) {
      const formDataFile = new FormData();
      formDataFile.append('path', 'products');
      formDataFile.append('file', file);

      try {
        const response = await AllInOneApi.post('shared/image', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*',
          },
        });
        uploadedImageUrls.push(response.data.url);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        enqueueSnackbar(t("Erro ao enviar uma das imagens."), { variant: "error" });
      }
    }

    return uploadedImageUrls;
  };


  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Dialog open={isOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {isEditing ? t('products.forms.editProduct') : t('products.forms.addProduct')}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleModalClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('products.forms.name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('products.forms.description')}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('products.forms.category')}
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('products.forms.price')}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('products.forms.cost')}
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('products.forms.quantityInStock')}
                name="quantityInStock"
                type="number"
                value={formData.quantityInStock}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t('products.forms.productImages')}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
            {images.map((image, index) => (
                <Box key={index} position="relative">
                <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`uploaded-${index}`}
                    style={{ width: 80, height: 80, borderRadius: 4 }}
                />
                <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: 'absolute', top: 0, right: 0, color: 'error.main' }}
                >
                    <Delete fontSize="small" />
                </IconButton>
                </Box>
            ))}
            </Box>
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 1 }}
              >
                {t('products.forms.uploadImages')}
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} sx={{ border: '1px blue solid', color: 'blue' }}>
          {t('products.forms.cancel')}
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          {isEditing ? t('products.forms.saveChanges') : t('products.forms.addProductButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

