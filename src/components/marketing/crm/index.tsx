import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Button, Select, Tag, Card, Form, Modal, DatePicker, Checkbox, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, MinusCircleOutlined } from '@ant-design/icons';
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
  jsonData: Record<string, any>;
}

interface Segment {
  id: string;
  name: string;
  conditions: FilterCondition[];
  customerCount: number;
}

interface FilterCondition {
  field: string;
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
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [isColumnsModalVisible, setIsColumnsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [segmentForm] = Form.useForm();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchText, selectedSegment, customers]);

  useEffect(() => {
    const fields = extractAllFields(customers);
    setAvailableFields(fields);
    setVisibleColumns(fields);
  }, [customers]);

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
      setAvailableFields(extractAllFields(leads));
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };



  // Filtra clientes baseado no segmento selecionado e texto de busca
  const filterCustomers = () => {
    let result = [...customers];

    if (selectedSegment) {
      const segment = segments.find(s => String(s.id) === selectedSegment);
      if (segment) {
        const conditions = segment.conditions || [];
        result = result.filter(customer => {
          return conditions.every((condition: any) => {
            const field = condition.field;
            let customerValue = (customer as any)[field];

            if (customerValue === undefined && customer.jsonData) {
              customerValue = customer.jsonData[field];
            }

            if (customerValue === undefined || customerValue === null) {
              return false;
            }

            const conditionValue = String(condition.value);
            const customerValueStr = String(customerValue).toLowerCase();

            switch (condition.operator) {
              case 'eq':
                return customerValueStr === conditionValue.toLowerCase();
              case 'neq':
                return customerValueStr !== conditionValue.toLowerCase();
              case 'gt':
                return !isNaN(Number(customerValue)) && !isNaN(Number(conditionValue)) &&
                  Number(customerValue) > Number(conditionValue);
              case 'lt':
                return !isNaN(Number(customerValue)) && !isNaN(Number(conditionValue)) &&
                  Number(customerValue) < Number(conditionValue);
              case 'contains':
                return customerValueStr.includes(conditionValue.toLowerCase());
              case 'startsWith':
                return customerValueStr.startsWith(conditionValue.toLowerCase());
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
          (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
          (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
          (customer.status && customer.status.toLowerCase().includes(searchLower)) ||
          (customer.tags?.some(tag => tag.toLowerCase().includes(searchLower))) ||
          Object.values(customer.jsonData || {}).some(value =>
            value && typeof value === 'string' && value.toLowerCase().includes(searchLower)
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

  const handleSegmentChange = (segmentId: string | number | null) => {
    setSelectedSegment(segmentId !== null && segmentId !== undefined ? String(segmentId) : null);
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
      title: t('marketing.crm.confirmDeleteTitle'),
      content: t('marketing.crm.confirmDeleteMessage'),
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
    const dynamicData = (values.fields || []).reduce((acc: any, cur: any) => {
      if (cur && cur.key) acc[cur.key] = cur.value;
      return acc;
    }, {} as Record<string, any>);

    const customerData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      value: values.value,
      lastContact: values.lastContact?.toDate?.() || values.lastContact,
      status: values.status,
      tags: values.tags || [],
      source: values.source,
      jsonData: {
        ...(currentCustomer?.jsonData || {}),
        ...dynamicData,
      },
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

  const fieldLabels: Record<string, string> = {
    name: t('marketing.crm.name'),
    email: t('marketing.crm.email'),
    phone: t('marketing.crm.phone'),
    status: t('marketing.crm.status'),
    value: t('marketing.crm.value'),
    tags: t('marketing.crm.tags'),
    source: t('marketing.crm.source'),
    createdAt: t('marketing.crm.createdAt'),
    lastContact: t('marketing.crm.lastContact'),
  };

  const fixedColumns: ColumnsType<any> = [
    {
      title: t('marketing.crm.status'),
      dataIndex: 'status',
      key: 'status',
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
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: t('marketing.crm.tags'),
      dataIndex: 'tags',
      key: 'tags',
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
      dataIndex: 'createdAt',
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

  const dedupeFields = (fields: string[]): string[] => {
    const seen = new Set<string>();
    return fields.filter(f => {
      const key = f.trim().toLowerCase();
      if (key === 'companyid' || key === 'jsondata') return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const extractAllFields = (data: any[]): string[] => {
    const base = ['name', 'email', 'phone', 'status', 'value', 'tags', 'source', 'createdAt'];
    const dynamic = extractJsonFields(data);
    return dedupeFields([...base, ...dynamic]);
  };

  const formatFieldLabel = (label: string) => label.replace(/\s*\(.*?\)\s*/g, '').trim();

  const normalizeField = (field: string) => field.trim().toLowerCase();

  const jsonFields = extractJsonFields(customers).map(normalizeField);
  const uniqueJsonFields = Array.from(new Set(jsonFields));

  const jsonFieldColumns: ColumnsType<any> = uniqueJsonFields.map(field => ({
    title: (fieldLabels[field] || field).length > 14
      ? (fieldLabels[field] || field).slice(0, 14) + '...'
      : (fieldLabels[field] || field),
    dataIndex: ['jsonData', field],
    key: field,
    render: (_: any, record: any) => {
      const matchingKeys = Object.keys(record.jsonData || {}).filter(
        key => normalizeField(key) === field
      );
      const value = matchingKeys.map(k => record.jsonData[k]).find(v => v !== undefined && v !== null && v !== '');
      return typeof value === 'string' || typeof value === 'number'
        ? value
        : JSON.stringify(value);
    },
  }));
  const getFieldName = (col: any) => Array.isArray(col.dataIndex) ? col.dataIndex[1] : col.dataIndex;
  const fixedFieldNames = fixedColumns.map(col => normalizeField(getFieldName(col)));

  const filteredJsonFieldColumns = jsonFieldColumns.filter(
    col => !fixedFieldNames.includes(normalizeField(getFieldName(col)))
  );

  const tableColumns = [...filteredJsonFieldColumns, ...fixedColumns].filter(col =>
    visibleColumns.includes(getFieldName(col))
  );

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
          icon={<SettingOutlined />}
          onClick={() => setIsColumnsModalVisible(true)}
        >
          {t('marketing.crm.columns')}
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
        columns={tableColumns}
        dataSource={filteredCustomers}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
      />

      <Modal
        title={t('marketing.crm.selectColumns')}
        open={isColumnsModalVisible}
        onOk={() => setIsColumnsModalVisible(false)}
        onCancel={() => setIsColumnsModalVisible(false)}
      >
        <Checkbox.Group
          value={visibleColumns}
          onChange={(vals) => setVisibleColumns(vals as string[])}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {availableFields.map((field) => (
              <Checkbox key={field} value={field} style={{ width: '30%' }}>
                {formatFieldLabel(fieldLabels[field] || field)}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Modal>

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
                      rules={[{ required: true, message: t('marketing.crm.requiredField') }]}
                    >
                      <Select
                        placeholder={t('marketing.crm.field')}
                        showSearch
                        options={availableFields.map(f => ({ label: formatFieldLabel(f), value: f }))}
                        filterOption={(input, option) =>
                          (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'operator']}
                      style={{ flex: 1 }}
                      rules={[{ required: true, message: t('marketing.crm.requiredField') }]}
                    >
                      <Select placeholder={t('marketing.crm.operator')}>
                        <Select.Option value="eq">{t('marketing.crm.equals')}</Select.Option>
                        <Select.Option value="neq">{t('marketing.crm.notEquals')}</Select.Option>
                        <Select.Option value="gt">{t('marketing.crm.greaterThan')}</Select.Option>
                        <Select.Option value="lt">{t('marketing.crm.lessThan')}</Select.Option>
                        <Select.Option value="contains">{t('marketing.crm.contains')}</Select.Option>
                        <Select.Option value="startsWith">{t('marketing.crm.startsWith')}</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      style={{ flex: 2 }}
                      rules={[{ required: true, message: t('marketing.crm.requiredField') }]}
                    >
                      <Input placeholder={t('marketing.crm.valuePlaceholder')} />
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
                    {t('marketing.crm.addCondition')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('marketing.crm.saveSegment')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Cliente */}
      <Modal
        title={currentCustomer ? t('marketing.crm.editCustomer') : t('marketing.crm.addCustomer')}
        open={isCustomerModalVisible}
        onCancel={() => setIsCustomerModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleCustomerSubmit} layout="vertical">
          <Form.Item name="name" label={t('marketing.crm.name')}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={t('marketing.crm.email')}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label={t('marketing.crm.phone')}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label={t('marketing.crm.value')}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="lastContact" label={t('marketing.crm.lastContact')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder={t('marketing.crm.fieldName')} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true }]}
                    >
                      <Input placeholder={t('marketing.crm.fieldValue')} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    {t('marketing.crm.addField')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="status"
            label={t('marketing.crm.status')}
            rules={[{ required: true, message: t('marketing.crm.pleaseSelectStatus') }]}
          >
            <Select>
              <Select.Option value="lead">{t('marketing.crm.statusLead')}</Select.Option>
              <Select.Option value="prospect">{t('marketing.crm.statusProspect')}</Select.Option>
              <Select.Option value="customer">{t('marketing.crm.statusCustomer')}</Select.Option>
              <Select.Option value="churned">{t('marketing.crm.statusChurned')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label={t('marketing.crm.tags')}
          >
            <Select mode="tags" placeholder={t('marketing.crm.addTags')}>
              {['VIP', 'Promoção', 'Recorrente', 'Novo'].map(tag => (
                <Select.Option key={tag} value={tag}>{tag}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="source"
            label={t('marketing.crm.source')}
          >
            <Select>
              <Select.Option value="website">{t('marketing.crm.website')}</Select.Option>
              <Select.Option value="social">{t('marketing.crm.socialMedia')}</Select.Option>
              <Select.Option value="referral">{t('marketing.crm.referral')}</Select.Option>
              <Select.Option value="event">{t('marketing.crm.event')}</Select.Option>
            </Select>
          </Form.Item>

          {currentCustomer && (
          <Form.Item
            name="createdAt"
            label={t('marketing.crm.createdAt')}
          >
            <DatePicker disabled style={{ width: '100%' }} />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {currentCustomer ? t('marketing.crm.updateCustomer') : t('marketing.crm.createCustomer')}
          </Button>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CRMApp;
