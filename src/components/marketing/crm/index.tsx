import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Tag, Card, Form, Modal, DatePicker, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CrmService from '../../../services/crm.service.ts'
import SegmentationService from '../../../services/segmentation.service.ts'
import dayjs from 'dayjs';
import { Box, Typography } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';

// Tipos de dados
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  lastContact: Date;
  value: number;
  tags: string[];
  source: string;
  createdAt: Date;
}

interface Segment {
  id: string;
  name: string;
  filterConditions: FilterCondition[];
  customerCount: number;
}

interface FilterCondition {
  field: keyof Customer;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'startsWith';
  value: any;
}

const CRMApp: React.FC = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isSegmentModalVisible, setIsSegmentModalVisible] = useState(false);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [segmentForm] = Form.useForm();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchText, selectedSegment, customers]);

  const fetchInitialData = async () => {
    setLoading(true);

    try {
      const [leadRes, segmentRes] = await Promise.all([
        CrmService.getCrm(activeCompany),
        SegmentationService.getSegments(activeCompany)
      ]);
      const leads = leadRes.data
        ?.map((lead: any) => {
          const parsedSource = typeof lead.source === 'string' ? JSON.parse(lead.source) : lead.source;
          return {
            id: lead.id,
            jsonData: lead.jsonData || {},
            status: lead.status || 'LEAD',
            tags: lead.tags || [],
            source: parsedSource?.source || '',
            createdAt: new Date(lead.createdAt),
            lastContact: new Date(lead.updatedAt),
            value: 0
          };
        });
      setCustomers(leads);
      setSegments(segmentRes.data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };



  // Filtra clientes baseado no segmento selecionado e texto de busca
  const filterCustomers = () => {
    let result = [...customers];

    // Aplica filtro de segmento
    if (selectedSegment) {
      const segment = segments.find(s => s.id === selectedSegment);
      if (segment) {
        result = result.filter(customer => {
          return segment.filterConditions.every(condition => {
            const field = condition.field as string;

            // Busca o valor: pode estar no customer ou no jsonData
            const customerValue =
              customer[field] !== undefined
                ? customer[field]
                : customer.jsonData?.[field] ?? '';

            switch (condition.operator) {
              case 'eq':
                return customerValue === condition.value;
              case 'neq':
                return customerValue !== condition.value;
              case 'gt':
                return customerValue > condition.value;
              case 'lt':
                return customerValue < condition.value;
              case 'contains':
                return typeof customerValue === 'string' &&
                  customerValue.toLowerCase().includes(condition.value.toLowerCase());
              case 'startsWith':
                return typeof customerValue === 'string' &&
                  customerValue.toLowerCase().startsWith(condition.value.toLowerCase());
              default:
                return true;
            }
          });
        });
      }
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();

      result = result.filter((customer) => {
        const textMatches =
          (customer.status && customer.status.toLowerCase().includes(searchLower)) ||
          (customer.source && customer.source.toLowerCase().includes(searchLower)) ||
          (customer.tags?.some(tag => tag.toLowerCase().includes(searchLower))) ||
          Object.values(customer?.jsonData || {}).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchLower)
          );

        return textMatches;
      });
    }

    setFilteredCustomers(result);
  };


  // Manipuladores de eventos
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegment(segmentId);
  };

  const handleCreateSegment = () => {
    segmentForm.resetFields();
    setIsSegmentModalVisible(true);
  };

  const handleCreateCustomer = () => {
    form.resetFields();
    setCurrentCustomer(null);
    setIsCustomerModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    form.setFieldsValue({
      ...customer,
      lastContact: dayjs(customer.lastContact),
      createdAt: dayjs(customer.createdAt),
    });
    setIsCustomerModalVisible(true);
  };

  const handleDeleteCustomer = (id: string) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este cliente?',
      async onOk() {
        await CrmService.deleteCustomer(id);
        setCustomers(customers.filter(c => c.id !== id));
      },
    });
  };

  const handleSegmentSubmit = async (values: any) => {
    try {
      const { data } = await SegmentationService.createSegment({
        ...values,
        companyId: activeCompany,
      });
      setSegments([...segments, data]);
      setIsSegmentModalVisible(false);
    } catch (err) {
      console.error('Erro ao criar segmento:', err);
    }
  };

  const handleCustomerSubmit = async (values: any) => {
    const customerData = {
      ...values,
      lastContact: values.lastContact.toDate(),
      createdAt: values.createdAt?.toDate() || new Date(),
      tags: values.tags || [],
    };

    try {
      if (currentCustomer) {
        await CrmService.updateCustomer(currentCustomer.id, customerData);
        setCustomers(customers.map(c =>
          c.id === currentCustomer.id ? { ...c, ...customerData, id: currentCustomer.id } : c
        ));
      } else {
        const { data } = await CrmService.createCustomer(activeCompany, customerData);
        setCustomers([...customers, { ...customerData, id: data.id }]);
      }
      setIsCustomerModalVisible(false);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
    }
  };

  const calculateMetrics = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'customer').length;
    const totalValue = customers.reduce((sum, c) => sum + c.value, 0);
    const avgValue = totalCustomers > 0 ? totalValue / totalCustomers : 0;

    return { totalCustomers, activeCustomers, totalValue, avgValue };
  };

  const metrics = calculateMetrics();

  const fixedColumns: ColumnsType<any> = [
    {
      title: t('marketing.crm.status'),
      dataIndex: t('marketing.crm.status'),
      key: t('marketing.crm.status').toLowerCase(),
      render: (status: string) => {
        const color = {
          lead: 'blue',
          prospect: 'orange',
          customer: 'green',
          churned: 'red',
        }[status?.toLowerCase()] || 'gray';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: t('marketing.crm.source'),
      dataIndex: t('marketing.crm.source'),
      key: t('marketing.crm.source').toLowerCase(),
    },
    {
      title: t('marketing.crm.tags'),
      dataIndex: t('marketing.crm.tags'),
      key: t('marketing.crm.tags').toLowerCase(),
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: t('marketing.crm.createdAt'),
      dataIndex: t('marketing.crm.createdAt'),
      key: 'createdAt',
      render: (date: Date) => dayjs(date).format('DD/MM/YYYY'),
    },
  ];

  const extractJsonFields = (data: any[]): string[] => {
    const fields = new Set<string>();
    data.forEach(item => {
      if (item.jsonData) {
        Object.keys(item.jsonData).forEach(key => {
          if (key.toLowerCase() !== 'score' && key !== 'formId') {
            fields.add(key);
          }
        });
      }
    });
    return Array.from(fields);
  };

  const jsonFieldColumns: ColumnsType<any> = extractJsonFields(customers).map(field => ({
    title: field,
    dataIndex: ['jsonData', field],
    key: `jsonData-${field}`,
    render: (value: any) =>
      typeof value === 'string' || typeof value === 'number'
        ? value
        : JSON.stringify(value),
  }));

  return (
    <div style={{ padding: 24 }}>
      <Box sx={{display:'flex', marginTop:'30px', marginBottom:'35px'}}>
        <ArrowBackIos style={{cursor:'pointer', marginTop:'10px', marginRight:'20px'}} onClick={()=>{setModule('')}}/>
        <Typography variant="h4">
          {t("marketing.crmTitle")}
        </Typography>
      </Box>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card title={t('marketing.crm.totalCustomers')} style={{ flex: 1 }}>
          <h2>{metrics.totalCustomers}</h2>
        </Card>
        <Card title={t('marketing.crm.activeCustomers')} style={{ flex: 1 }}>
          <h2>{metrics.activeCustomers}</h2>
        </Card>
        <Card title={t('marketing.crm.totalValue')} style={{ flex: 1 }}>
          <h2>$ {metrics.totalValue.toLocaleString('pt-BR')}</h2>
        </Card>
        <Card title={t('marketing.crm.averageValue')} style={{ flex: 1 }}>
          <h2>$ {metrics.avgValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</h2>
        </Card>
      </div>

      {/* Barra de ferramentas */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Input
          placeholder={t('marketing.crm.searchPlaceholder')}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={handleSearch}
        />

        <Select
          placeholder={t('marketing.crm.selectSegment')}
          style={{ width: 250 }}
          value={selectedSegment}
          onChange={handleSegmentChange}
          options={segments.map(s => ({ value: s.id, label: s.name }))}
          allowClear
        />

        <Button
          icon={<FilterOutlined />}
          onClick={handleCreateSegment}
        >
          {t('marketing.crm.createSegment')}
        </Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateCustomer}
          style={{ marginLeft: 'auto' }}
        >
          {t('marketing.crm.createCustomer')}
        </Button>
      </div>

      <Table
        columns={[...jsonFieldColumns, ...fixedColumns]}
        dataSource={filteredCustomers}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
      />

      {/* Modal de Segmento */}
      <Modal
        title={t('marketing.crm.createSegment')}
        open={isSegmentModalVisible}
        onCancel={() => setIsSegmentModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={segmentForm} onFinish={handleSegmentSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Nome do Segmento"
            rules={[{ required: true, message: 'Segment Name' }]}
          >
            <Input />
          </Form.Item>

          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'field']}
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                      <Select placeholder="Campo">
                        <Select.Option value="name">Nome</Select.Option>
                        <Select.Option value="email">Email</Select.Option>
                        <Select.Option value="status">Status</Select.Option>
                        <Select.Option value="value">Valor</Select.Option>
                        <Select.Option value="tags">Tags</Select.Option>
                        <Select.Option value="source">Origem</Select.Option>
                        <Select.Option value="createdAt">Data de Criação</Select.Option>
                        <Select.Option value="lastContact">Último Contato</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'operator']}
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                      <Select placeholder="Operador">
                        <Select.Option value="eq">Igual a</Select.Option>
                        <Select.Option value="neq">Diferente de</Select.Option>
                        <Select.Option value="gt">Maior que</Select.Option>
                        <Select.Option value="lt">Menor que</Select.Option>
                        <Select.Option value="contains">Contém</Select.Option>
                        <Select.Option value="startsWith">Começa com</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      style={{ flex: 2 }}
                      rules={[{ required: true, message: 'Campo obrigatório' }]}
                    >
                      <Input placeholder="Valor" />
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Adicionar Condição
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Salvar Segmento
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Cliente */}
      <Modal
        title={currentCustomer ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
        open={isCustomerModalVisible}
        onCancel={() => setIsCustomerModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleCustomerSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor insira o nome do cliente' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor insira o email do cliente' },
              { type: 'email', message: 'Por favor insira um email válido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Por favor insira o telefone do cliente' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor selecione o status' }]}
          >
            <Select>
              <Select.Option value="lead">Lead</Select.Option>
              <Select.Option value="prospect">Prospect</Select.Option>
              <Select.Option value="customer">Customer</Select.Option>
              <Select.Option value="churned">Churned</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Valor"
            rules={[{ required: true, message: 'Por favor insira o valor' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="lastContact"
            label="Último Contato"
            rules={[{ required: true, message: 'Por favor selecione a data do último contato' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select mode="tags" placeholder="Adicione tags">
              {['VIP', 'Promoção', 'Recorrente', 'Novo'].map(tag => (
                <Select.Option key={tag} value={tag}>{tag}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="source"
            label="Origem"
          >
            <Select>
              <Select.Option value="website">Website</Select.Option>
              <Select.Option value="social">Social Media</Select.Option>
              <Select.Option value="referral">Indicação</Select.Option>
              <Select.Option value="event">Evento</Select.Option>
            </Select>
          </Form.Item>

          {currentCustomer && (
            <Form.Item
              name="createdAt"
              label="Data de Criação"
            >
              <DatePicker disabled style={{ width: '100%' }} />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentCustomer ? 'Atualizar Cliente' : 'Adicionar Cliente'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CRMApp;