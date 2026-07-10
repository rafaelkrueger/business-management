import React, { useEffect, useState } from 'react'
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
    MenuItem,
    Card as MuiCard,
    CardContent,
  } from '@mui/material';
  import { Close, Delete, Edit, Warning } from '@mui/icons-material';
import ProductService from '../../services/product.service.ts'
import { StreakContainer } from '../payments/styles.ts';
import { FaFileExcel, FaRobot } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription, EmptyStateButton } from './styles.ts';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from "notistack";
import { Api } from '../../Api.ts';
import { Brain, FileSpreadsheet, Info, Package } from 'lucide-react';
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

const ProductCard: React.FC<{ product: any; onEdit: (product: any) => void; onDelete: (productId: string) => void }> = ({ product, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' };
      case 'inactive':
        return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)' };
      case 'out_of_stock':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' };
      default:
        return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.2)' };
    }
  };

  const statusStyle = getStatusColor(product.status);
  const stockStatus = product.quantityInStock > 0
    ? { color: '#10b981', text: 'Em estoque' }
    : { color: '#ef4444', text: 'Sem estoque' };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <MuiCard
        sx={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '180px',
            backgroundImage: product.images && product.images.length > 0
              ? `url(${product.images[0]})`
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            backgroundSize: product.images && product.images.length > 0 ? 'cover' : 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: product.images && product.images.length > 0 ? 'transparent' : '#f8f9fa',
            border: product.images && product.images.length > 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {(!product.images || product.images.length === 0) && (
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                }}
              >
                <Package size={32} style={{ color: '#6b7280', opacity: 0.6 }} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#9ca3af',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  letterSpacing: '0.3px',
                }}
              >
                {product.name || 'Sem imagem'}
              </Typography>
            </Box>
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                color: 'text.primary',
                lineHeight: 1.3,
                flex: 1,
                mr: 1
              }}
            >
              {product.name || '-'}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1,
                py: 0.25,
                bgcolor: statusStyle.bg,
                borderRadius: '6px',
                border: `1px solid ${statusStyle.border}`,
                minWidth: 'fit-content'
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: statusStyle.color,
                  mr: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: statusStyle.color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'capitalize',
                }}
              >
                {product.status || 'active'}
              </Typography>
            </Box>
          </Box>

          {product.description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.85rem',
                mb: 1.5,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </Typography>
          )}

          <Box sx={{ mb: 1.5 }}>
            {product.category && (
              <Chip
                label={product.category}
                size="small"
                sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: '22px',
                }}
              />
            )}
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
            pt: 1.5,
            borderTop: '1px solid rgba(0,0,0,0.06)'
          }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  display: 'block',
                  mb: 0.5
                }}
              >
                {t('products.price')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'text.primary',
                  lineHeight: 1.2
                }}
              >
                {product.currency || 'USD'} {Number(product.price || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
            </Box>
            {product.cost && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  {t('products.cost')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.85rem'
                  }}
                >
                  {product.currency || 'USD'} {Number(product.cost).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 1.5,
            borderTop: '1px solid rgba(0,0,0,0.06)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: stockStatus.color,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: stockStatus.color,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              >
                {product.quantityInStock || 0} {t('products.stock')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(product)}
                sx={{
                  color: '#6b7280',
                  '&:hover': {
                    color: '#3b82f6',
                    bgcolor: 'rgba(59, 130, 246, 0.1)'
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(product.id)}
                sx={{
                  color: '#6b7280',
                  '&:hover': {
                    color: '#ef4444',
                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </MuiCard>
    </Grid>
  );
};


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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

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

    const handleDeleteClick = (productId: string) => {
        setProductToDelete(productId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            await ProductService.delete(productToDelete, props.activeCompany);
            setTableData((prev) => prev.filter((p) => p.id !== productToDelete));
            enqueueSnackbar(t('products.productDeleted') || 'Produto deletado com sucesso!', { variant: 'success' });

            ProductService.glance(props.activeCompany)
                .then((res) => setGlanceData(res.data))
                .catch((err) => console.log(err));

            setDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            enqueueSnackbar(t('products.deleteError') || 'Erro ao deletar produto', { variant: 'error' });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
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
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    {tableData.map((product, index) => (
                      <ProductCard
                        key={product.id || index}
                        product={product}
                        onEdit={handleRow}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </Grid>
                </Box>
            )}

            <ProductModal
                isEditing={isEditing}
                setTableData={setTableData}
                activeCompany={props.activeCompany}
                isOpen={isOpen}
                onClose={() => { setIsEditing(false); setIsOpen(false); }}
                product={product}
            />

            <Dialog
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        minWidth: '400px',
                        maxWidth: '500px',
                    }
                }}
            >
                <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            mx: 'auto',
                            mb: 2,
                        }}
                    >
                        <Warning sx={{ fontSize: 40, color: '#ef4444' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                        {t('products.confirmDeleteTitle') || 'Confirmar exclusão'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                        {t('products.confirmDeleteMessage') || 'Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.'}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, gap: 1, justifyContent: 'center' }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            px: 3,
                            py: 1,
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                bgcolor: '#f9fafb',
                            }
                        }}
                    >
                        {t('products.cancel') || 'Cancelar'}
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            borderRadius: '8px',
                            px: 3,
                            py: 1,
                            bgcolor: '#ef4444',
                            '&:hover': {
                                bgcolor: '#dc2626',
                            }
                        }}
                        startIcon={<Delete />}
                    >
                        {t('products.delete') || 'Deletar'}
                    </Button>
                </DialogActions>
            </Dialog>
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

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'BRL', label: 'BRL - Brazilian Real' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
  ];

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    currency: 'USD',
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

  const handleInputChange = (e: any) => {
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
        currency: product.currency || 'USD',
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
      currency: 'USD',
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
        const response = await Api.post('shared/image', formDataFile, {
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
                select
                fullWidth
                label={t('products.forms.currency')}
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              >
                {currencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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

