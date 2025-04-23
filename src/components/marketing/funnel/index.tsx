import React, { useState, useEffect } from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  stage: 'awareness' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase';
  score: number;
  lastContact: Date;
  notes: string[];
}

interface FunnelMetrics {
  totalLeads: number;
  conversionRate: number;
  averageTimeInFunnel: number;
  stageDistribution: Record<string, number>;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: 'welcome' | 'follow-up' | 'abandoned-cart' | 'conversion';
}

const SalesFunnel: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<FunnelMetrics>({
    totalLeads: 0,
    conversionRate: 0,
    averageTimeInFunnel: 0,
    stageDistribution: {}
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'templates' | 'analytics'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  // Sample data initialization
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const sampleLeads: Lead[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        company: 'Acme Inc',
        stage: 'interest',
        score: 65,
        lastContact: new Date(),
        notes: ['Interested in pricing plans', 'Asked about integrations']
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        stage: 'consideration',
        score: 80,
        lastContact: new Date(Date.now() - 86400000 * 2),
        notes: ['Downloaded whitepaper', 'Requested demo']
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        company: 'XYZ Corp',
        stage: 'evaluation',
        score: 90,
        lastContact: new Date(Date.now() - 86400000),
        notes: ['Completed demo', 'Asked for contract details']
      }
    ];

    const sampleTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to Our SaaS Platform!',
        body: 'Hi {name}, thank you for signing up! Here are some resources to get started...',
        trigger: 'welcome'
      },
      {
        id: '2',
        name: 'Follow-Up After Demo',
        subject: 'Follow-Up on Your Demo',
        body: 'Hi {name}, I hope you enjoyed your demo. Do you have any questions?',
        trigger: 'follow-up'
      }
    ];

    setLeads(sampleLeads);
    setFilteredLeads(sampleLeads);
    setEmailTemplates(sampleTemplates);
    calculateMetrics(sampleLeads);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter((lead) =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    if (stageFilter !== 'all') {
      filtered = filtered.filter(lead => lead.stage === stageFilter);
    }

    setFilteredLeads(filtered);
    calculateMetrics(filtered);
  }, [searchTerm, stageFilter, leads]);

  const calculateMetrics = (leadsToCalculate: Lead[]) => {
    const total = leadsToCalculate.length;
    const purchased = leadsToCalculate.filter(l => l.stage === 'purchase').length;
    const conversionRate = total > 0 ? (purchased / total) * 100 : 0;

    const stageDistribution: Record<string, number> = {};
    leadsToCalculate.forEach(lead => {
      stageDistribution[lead.stage] = (stageDistribution[lead.stage] || 0) + 1;
    });

    setMetrics({
      totalLeads: total,
      conversionRate,
      averageTimeInFunnel: 7, // This would be calculated from actual data
      stageDistribution
    });
  };

  const updateLeadStage = (leadId: string, newStage: Lead['stage']) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, stage: newStage } : lead
      )
    );
  };

  const addNoteToLead = (leadId: string, note: string) => {
    if (!note.trim()) return;

    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId
          ? { ...lead, notes: [...lead.notes, note], lastContact: new Date() }
          : lead
      )
    );

    if (selectedLead?.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        notes: [...selectedLead.notes, note],
        lastContact: new Date()
      });
    }

    setNewNote('');
  };

  const sendEmail = (templateId: string, leadId: string) => {
    // In a real app, this would call your email service
    const template = emailTemplates.find(t => t.id === templateId);
    const lead = leads.find(l => l.id === leadId);

    if (template && lead) {
      alert(`Email sent to ${lead.name} with template: ${template.name}`);
      addNoteToLead(leadId, `Sent email: ${template.subject}`);
    }
  };

  const renderStageBadge = (stage: string) => {
    const stageClasses: Record<string, string> = {
      awareness: 'bg-blue-100 text-blue-800',
      interest: 'bg-purple-100 text-purple-800',
      consideration: 'bg-yellow-100 text-yellow-800',
      evaluation: 'bg-orange-100 text-orange-800',
      intent: 'bg-red-100 text-red-800',
      purchase: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stageClasses[stage]}`}>
        {stage.charAt(0).toUpperCase() + stage.slice(1)}
      </span>
    );
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
        <p className="text-2xl font-bold">{metrics.totalLeads}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
        <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Avg. Time in Funnel</h3>
        <p className="text-2xl font-bold">{metrics.averageTimeInFunnel} days</p>
      </div>

      <div className="md:col-span-3 bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium mb-2">Funnel Stages</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(metrics.stageDistribution).map(([stage, count]) => (
            <div key={stage} className="flex items-center">
              {renderStageBadge(stage)}
              <span className="ml-2 text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLeadsList = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-8 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            className="border rounded-lg px-4 py-2"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="awareness">Awareness</option>
            <option value="interest">Interest</option>
            <option value="consideration">Consideration</option>
            <option value="evaluation">Evaluation</option>
            <option value="intent">Intent</option>
            <option value="purchase">Purchase</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStageBadge(lead.stage)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            lead.score > 75 ? 'bg-green-500' :
                            lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${lead.score}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => updateLeadStage(lead.id, 'purchase')}
                      className="text-green-600 hover:text-green-900"
                      disabled={lead.stage === 'purchase'}
                    >
                      Convert
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLeadDetail = () => {
    if (!selectedLead) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedLead.name}</h2>
                <p className="text-gray-600">{selectedLead.email}</p>
                {selectedLead.company && <p className="text-gray-600">{selectedLead.company}</p>}
                {selectedLead.phone && <p className="text-gray-600">{selectedLead.phone}</p>}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Lead Score</h3>
                <p className="text-2xl font-bold mt-1">{selectedLead.score}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Current Stage</h3>
                <div className="mt-1">{renderStageBadge(selectedLead.stage)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Last Contact</h3>
                <p className="text-lg mt-1">{new Date(selectedLead.lastContact).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Update Stage</h3>
              <div className="flex flex-wrap gap-2">
                {['awareness', 'interest', 'consideration', 'evaluation', 'intent', 'purchase'].map((stage) => (
                  <button
                    key={stage}
                    onClick={() => updateLeadStage(selectedLead.id, stage as Lead['stage'])}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedLead.stage === stage
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Send Email</h3>
              <div className="flex flex-wrap gap-2">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => sendEmail(template.id, selectedLead.id)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <div className="space-y-3 mb-4">
                {selectedLead.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{note}</p>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add a note..."
                  className="flex-1 border rounded-l-lg px-4 py-2"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNoteToLead(selectedLead.id, newNote)}
                />
                <button
                  onClick={() => addNoteToLead(selectedLead.id, newNote)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={() => setSelectedLead(null)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailTemplates = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Templates</h3>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Create Template
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {emailTemplates.map((template) => (
          <div key={template.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                  {template.trigger}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Funnel Analytics</h3>
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Funnel visualization chart would appear here</p>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Conversion by Stage</h4>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Bar chart would appear here</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Time in Funnel</h4>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Line chart would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sales Funnel</h1>
        <p className="text-gray-600 mt-2">Track and manage your leads through the sales process</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email Templates
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'leads' && renderLeadsList()}
          {activeTab === 'templates' && renderEmailTemplates()}
          {activeTab === 'analytics' && renderAnalytics()}
        </>
      )}

      {selectedLead && renderLeadDetail()}
    </div>
  );
};

export default SalesFunnel;