import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Tag, Card, Form, Modal, Checkbox, Space } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, SettingOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Box, Typography } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import CrmService from '../../../../services/crm.service.ts';
import SegmentationService from '../../../../services/segmentation.service.ts';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastContact: Date;
  value: number;
  tags: string[];
  source: string;
  createdAt: Date;
  jsonData: Record<string, any>;
}

const CRMAppMobile: React.FC<{ activeCompany: any, setModule: (module: string) => void }> = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [segments, setSegments] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isSegmentModalVisible, setIsSegmentModalVisible] = useState(false);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const [segmentForm] = Form.useForm();
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [isColumnsModalVisible, setIsColumnsModalVisible] = useState(false);

  // Cores do tema
  const primaryColor = '#578acd';
  const backgroundColor = '#ffffff';
  const cardBackground = '#f8f9fa';
  const textColor = '#333333';

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
      const leads = leadRes.data?.map((lead: any) => {
        const parsedSource = typeof lead.source === 'string' ? JSON.parse(lead.source) : lead.source;
        return {
          id: lead.id,
          name: lead.jsonData?.nome || lead.jsonData?.name || '',
          email: lead.jsonData?.email || '',
          phone: lead.jsonData?.telefone || lead.jsonData?.phone || '',
          status: lead.status || 'LEAD',
          tags: lead.tags || [],
          source: parsedSource?.source || '',
          createdAt: new Date(lead.createdAt),
          lastContact: new Date(lead.updatedAt),
          value: lead.jsonData?.valor || lead.jsonData?.value || 0,
          jsonData: lead.jsonData || {}
        };
      });
      setCustomers(leads || []);
      setSegments(segmentRes.data || []);
      const fields = extractAllFields(leads || []);
      setAvailableFields(fields);
      setVisibleColumns(fields);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractJsonFields = (data: Customer[]): string[] => {
    const fields = new Set<string>();
    data.forEach(item => {
      if (item.jsonData) {
        Object.keys(item.jsonData).forEach(key => {
          if (!['score', 'formId', 'nome', 'name', 'email', 'telefone', 'phone', 'valor', 'value'].includes(key.toLowerCase())) {
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

  const extractAllFields = (data: Customer[]): string[] => {
    const base = ['name', 'email', 'phone', 'status', 'value', 'tags', 'source', 'createdAt', 'lastContact'];
    const dynamic = extractJsonFields(data);
    return dedupeFields([...base, ...dynamic]);
  };

  const formatFieldLabel = (label: string) => label.replace(/\s*\(.*?\)\s*/g, '').trim();


  const filterCustomers = () => {
    let result = [...customers];

      if (selectedSegment) {
        const segment = segments.find(s => String(s.id) === selectedSegment);
        if (segment) {
          const conditions = segment.filterConditions || [];
          result = result.filter(customer =>
            conditions.every((condition: any) => {
            const field = condition.field as string;
            const customerValue =
              (customer as any)[field] !== undefined
                ? (customer as any)[field]
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
                return typeof customerValue === 'string' && customerValue.toLowerCase().includes(String(condition.value).toLowerCase());
              case 'startsWith':
                return typeof customerValue === 'string' && customerValue.toLowerCase().startsWith(String(condition.value).toLowerCase());
              default:
                return true;
            }
          })
        );
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

  const renderStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      lead: { color: '#578acd', text: t('marketing.crm.statusLead') },
      prospect: { color: '#ffa940', text: t('marketing.crm.statusProspect') },
      customer: { color: '#52c41a', text: t('marketing.crm.statusCustomer') },
      churned: { color: '#f5222d', text: t('marketing.crm.statusChurned') },
    };

    const statusLower = status.toLowerCase();
    const statusInfo = statusMap[statusLower] || { color: '#d9d9d9', text: status.toUpperCase() };

    return (
      <Tag
        color={statusInfo.color}
        style={{
          margin: 0,
          borderRadius: 12,
          padding: '2px 8px',
          fontSize: 12,
        }}
      >
        {statusInfo.text}
      </Tag>
    );
  };

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

  const handleDeleteCustomer = async (id: string) => {
    Modal.confirm({
      title: t('marketing.crm.confirmDeleteTitle'),
      content: t('marketing.crm.confirmDeleteMessage'),
      async onOk() {
        try {
          await CrmService.deleteCustomer(id);
          setCustomers(customers.filter(c => c.id !== id));
        } catch (error) {
          console.error('Erro ao excluir cliente:', error);
        }
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
          c.id === currentCustomer.id ? { ...c, ...customerData } : c
        ));
      } else {
        const response = await CrmService.createCustomer(activeCompany, customerData);
        setCustomers([...customers, { ...customerData, id: response.data.id }]);
      }
      setIsCustomerModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const calculateMetrics = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status.toLowerCase() === 'customer').length;
    const totalValue = customers.reduce((sum, c) => sum + (c.value || 0), 0);
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

  return (
    <div style={{
      backgroundColor: backgroundColor,
      minHeight: '100vh',
      padding: '16px',
      marginBottom:'50px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '12px 0',
        borderBottom: `1px solid #f0f0f0`
      }}>
        <ArrowBackIos
          style={{
            cursor: 'pointer',
            marginRight: '16px',
            color: '#474747'
          }}
          onClick={() => setModule('')}
        />
        <Typography variant="h5" style={{
          color: textColor,
          fontWeight: '600',
          flex: 1
        }}>
          {t("marketing.crmTitle")}
        </Typography>
        <PlusOutlined
          style={{
            fontSize: '19px',
            color: 'white',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
            marginRight: '5px',
            background:'#578acd',
            padding: '6px',
            borderRadius: '5px',
          }}
          onClick={handleCreateCustomer}
        />
        <SettingOutlined
          style={{
            fontSize: '19px',
            color: 'white',
            cursor: 'pointer',
            background:'#578acd',
            padding: '6px',
            borderRadius: '5px',
            marginLeft: '8px'
          }}
          onClick={() => setIsColumnsModalVisible(true)}
        />
      </div>

      {/* Search & Segment */}
      <div style={{ display:'flex', gap:'8px', marginBottom: '16px' }}>
        <Input
          placeholder={t('marketing.crm.searchPlaceholder')}
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={handleSearch}
          style={{
            borderRadius: '20px',
            backgroundColor: cardBackground,
            border: 'none',
            padding: '8px 16px'
          }}
        />
        <Select
          placeholder={t('marketing.crm.selectSegment')}
          style={{ flex: 1 }}
          value={selectedSegment ?? undefined}
          onChange={handleSegmentChange}
          options={segments.map(s => ({ value: s.id, label: s.name }))}
          allowClear
        />
        <Button type="dashed" onClick={handleCreateSegment} icon={<PlusOutlined />} />
      </div>

      {/* Metrics Cards - Horizontal Scroll */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <Card
          style={{
            minWidth: '110px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            backgroundColor: cardBackground,
            border: 'none'
          }}
          bodyStyle={{ padding: '12px' }}
        >
          <div style={{ color: '#666', fontSize: '12px' }}>{t('marketing.crm.metricsTotal')}</div>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: primaryColor
          }}>
            {metrics.totalCustomers}
          </div>
        </Card>

        <Card
          style={{
            minWidth: '110px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            backgroundColor: cardBackground,
            border: 'none'
          }}
          bodyStyle={{ padding: '12px' }}
        >
          <div style={{ color: '#666', fontSize: '12px' }}>{t('marketing.crm.metricsActive')}</div>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: primaryColor
          }}>
            {/* {metrics.activeCustomers} */}
            {metrics.totalCustomers}
          </div>
        </Card>

        <Card
          style={{
            minWidth: '120px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            backgroundColor: cardBackground,
            border: 'none'
          }}
          bodyStyle={{ padding: '12px' }}
        >
          <div style={{ color: '#666', fontSize: '12px' }}>{t('marketing.crm.metricsTotalValue')}</div>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: primaryColor
          }}>
          ${String(metrics.totalValue).slice(0, 4)}
          </div>
        </Card>
      </div>

      <div>
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            style={{ marginBottom: '12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            bodyStyle={{ padding: '12px' }}
            onClick={() => handleEditCustomer(customer)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{customer.name || customer.email || customer.phone}</div>
              {renderStatusTag(customer.status)}
            </div>
            {visibleColumns.map((field) => {
              const value = (customer as any)[field] !== undefined ? (customer as any)[field] : customer.jsonData?.[field];
              if (value === undefined || value === null || value === '') return null;
              return (
                <div key={field} style={{ fontSize: '12px', marginBottom: 4 }}>
                  <strong>{formatFieldLabel(fieldLabels[field] || field)}:</strong> {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                </div>
              );
            })}
          </Card>
        ))}
      </div>

      <Modal
        title={t('marketing.crm.selectColumns')}
        open={isColumnsModalVisible}
        onOk={() => setIsColumnsModalVisible(false)}
        onCancel={() => setIsColumnsModalVisible(false)}
        bodyStyle={{ padding: '16px' }}
        width="90%"
        style={{ maxWidth: '400px' }}
      >
        <Checkbox.Group
          value={visibleColumns}
          onChange={(vals) => setVisibleColumns(vals as string[])}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {availableFields.map((field) => (
              <Checkbox key={field} value={field} style={{ width: '45%' }}>
                {formatFieldLabel(fieldLabels[field] || field)}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Modal>

      {/* Segment Modal */}
      <Modal
        title="Novo Segmento"
        open={isSegmentModalVisible}
        onCancel={() => setIsSegmentModalVisible(false)}
        footer={null}
        bodyStyle={{ padding: '16px' }}
        width="90%"
        style={{ maxWidth: '400px' }}
      >
        <Form form={segmentForm} onFinish={handleSegmentSubmit} layout="vertical">
          <Form.Item name="name" label={t('marketing.crm.name')} rules={[{ required: true, message: t('marketing.crm.requiredField') }]}> 
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
                        filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
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
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
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
            <Button type="primary" htmlType="submit" block>
              {t('marketing.crm.saveSegment')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Customer Modal */}
      <Modal
        title={currentCustomer ? t('marketing.crm.editCustomer') : t('marketing.crm.addCustomer')}
        open={isCustomerModalVisible}
        onCancel={() => setIsCustomerModalVisible(false)}
        footer={null}
        bodyStyle={{ padding: '16px' }}
        width="90%"
        style={{ maxWidth: '400px' }}
      >
        <Form form={form} onFinish={handleCustomerSubmit} layout="vertical">
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{ required: true }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder={t('marketing.crm.fieldName')} size="large" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder={t('marketing.crm.fieldValue')} size="large" />
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
            <Select size="large">
              <Select.Option value="LEAD">{t('marketing.crm.statusLead')}</Select.Option>
              <Select.Option value="PROSPECT">{t('marketing.crm.statusProspect')}</Select.Option>
              <Select.Option value="CUSTOMER">{t('marketing.crm.statusCustomer')}</Select.Option>
              <Select.Option value="CHURNED">{t('marketing.crm.statusChurned')}</Select.Option>
            </Select>
          </Form.Item>


          <Form.Item
            name="tags"
            label={t('marketing.crm.tags')}
          >
            <Select mode="tags" size="large" placeholder={t('marketing.crm.addTags')}>
              {['VIP', 'Promoção', 'Recorrente', 'Novo', 'Grande Conta', 'Potencial'].map(tag => (
                <Select.Option key={tag} value={tag}>{tag}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="source"
            label={t('marketing.crm.source')}
          >
            <Select size="large">
              <Select.Option value="website">{t('marketing.crm.website')}</Select.Option>
              <Select.Option value="social">{t('marketing.crm.socialMedia')}</Select.Option>
              <Select.Option value="referral">{t('marketing.crm.referral')}</Select.Option>
              <Select.Option value="event">{t('marketing.crm.event')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                height: '48px',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              {currentCustomer ? t('marketing.crm.update') : t('marketing.crm.add')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CRMAppMobile;
