'use client';

import { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/Card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Pencil, Trash, Building2, CheckCircle2, KeyRound, UserPlus, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';

// Date mock pentru companii
const mockCompanies = [
  { 
    id: '1', 
    name: 'TechCorp SRL', 
    cui: 'RO12345678', 
    address: 'Strada Exemplu 123, București', 
    employees: 45,
    active: true,
    onboardingStatus: 'completed', // completed, pending, setup_required
    adminEmail: 'admin@techcorp.ro'
  },
  { 
    id: '2', 
    name: 'InnovSystems SA', 
    cui: 'RO87654321', 
    address: 'Bulevardul Test 45, Cluj-Napoca', 
    employees: 78,
    active: true,
    onboardingStatus: 'pending',
    adminEmail: 'admin@innovsystems.ro'
  },
  { 
    id: '3', 
    name: 'ConsultPro SRL', 
    cui: 'RO11223344', 
    address: 'Aleea Demonstrativă 78, Iași', 
    employees: 23,
    active: true,
    onboardingStatus: 'setup_required',
    adminEmail: null
  },
  { 
    id: '4', 
    name: 'DataTech SRL', 
    cui: 'RO44332211', 
    address: 'Calea Exemplificare 90, Timișoara', 
    employees: 15,
    active: false,
    onboardingStatus: 'completed',
    adminEmail: 'manager@datatech.ro'
  },
];

// Componenta pentru status badge
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';
  
  switch (status) {
    case 'completed':
      bgColor = 'bg-green-100 dark:bg-green-900';
      textColor = 'text-green-800 dark:text-green-200';
      label = 'Finalizat';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100 dark:bg-yellow-900';
      textColor = 'text-yellow-800 dark:text-yellow-200';
      label = 'În așteptare';
      break;
    case 'setup_required':
      bgColor = 'bg-blue-100 dark:bg-blue-900';
      textColor = 'text-blue-800 dark:text-blue-200';
      label = 'Configurare necesară';
      break;
    default:
      bgColor = 'bg-gray-100 dark:bg-gray-800';
      textColor = 'text-gray-800 dark:text-gray-300';
      label = status;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

interface CompanyFormData {
  name: string;
  cui: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  foundedDate: string;
  industry: string;
  vatNumber: string;
  registrationNumber: string;
  bankAccount: string;
  bankName: string;
  subscriptionPlan: string;
  contractStartDate: string;
  contractEndDate: string;
  billingCycle: string;
  notes: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPosition: string;
}

export default function CompaniesAdminPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState(mockCompanies);
  const [loading, setLoading] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<string | null>(null);
  const [isAssignAdminOpen, setIsAssignAdminOpen] = useState(false);
  const [isManualStep, setIsManualStep] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    cui: '',
    address: '',
    city: '',
    county: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    foundedDate: '',
    industry: '',
    vatNumber: '',
    registrationNumber: '',
    bankAccount: '',
    bankName: '',
    subscriptionPlan: '',
    contractStartDate: '',
    contractEndDate: '',
    billingCycle: '',
    notes: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPosition: '',
  });
  
  const { hasPermission, loading: permissionLoading } = useRequirePermission('companies.read');
  const { hasPermission: canCreateCompany } = useRequirePermission('companies.create');

  const handleAddCompany = () => {
    setFormData({
      name: '',
      cui: '',
      address: '',
      city: '',
      county: '',
      postalCode: '',
      phone: '',
      email: '',
      website: '',
      foundedDate: '',
      industry: '',
      vatNumber: '',
      registrationNumber: '',
      bankAccount: '',
      bankName: '',
      subscriptionPlan: '',
      contractStartDate: '',
      contractEndDate: '',
      billingCycle: '',
      notes: '',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      adminPosition: '',
    });
    setFormStep(1);
    setIsAddCompanyOpen(true);
  };

  const handleEditCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      alert(`Funcționalitate în dezvoltare: Editare companie ${company.name}`);
    }
  };

  const handleDeleteCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      if (confirm(`Sigur doriți să ștergeți compania ${company.name}?`)) {
        setLoading(true);
        // Simulare ștergere
        setTimeout(() => {
          setCompanies(companies.filter(c => c.id !== id));
          setLoading(false);
        }, 1000);
      }
    }
  };

  const handleViewCompany = (id: string) => {
    window.location.href = `/admin/companies/${id}`;
  };

  const handleSetupCompany = (id: string) => {
    setCurrentCompany(id);
    setIsManualStep(true);
  };

  const handleAssignAdmin = (id: string) => {
    setCurrentCompany(id);
    setIsAssignAdminOpen(true);
  };

  const handleAssignAdminSubmit = () => {
    setLoading(true);
    
    // Simulare proces
    setTimeout(() => {
      const updatedCompanies = companies.map(company => {
        if (company.id === currentCompany) {
          return {
            ...company,
            adminEmail: 'new.admin@example.com',
            onboardingStatus: 'pending'
          };
        }
        return company;
      });
      
      setCompanies(updatedCompanies);
      setIsAssignAdminOpen(false);
      setCurrentCompany(null);
      setLoading(false);
    }, 1500);
  };

  const handleFormSubmit = () => {
    if (formStep < 4) {
      setFormStep(formStep + 1);
      return;
    }
    
    setLoading(true);
    
    // Simulare proces de creare companie
    setTimeout(() => {
      // Construim un obiect complet cu toate datele companiei
      const newCompany = {
        id: `${companies.length + 1}`,
        name: formData.name,
        cui: formData.cui,
        address: `${formData.address}, ${formData.city}, ${formData.county}, ${formData.postalCode}`,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        industry: formData.industry,
        foundedDate: formData.foundedDate,
        vatNumber: formData.vatNumber,
        registrationNumber: formData.registrationNumber,
        bankDetails: {
          bankName: formData.bankName,
          bankAccount: formData.bankAccount
        },
        subscription: {
          plan: formData.subscriptionPlan,
          startDate: formData.contractStartDate,
          endDate: formData.contractEndDate,
          billingCycle: formData.billingCycle
        },
        admin: {
          name: formData.adminName,
          email: formData.adminEmail,
          phone: formData.adminPhone,
          position: formData.adminPosition
        },
        employees: 0,
        active: true,
        onboardingStatus: 'pending',
        adminEmail: formData.adminEmail,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };
      
      // Într-o implementare reală, aici ar trebui să trimitem datele către backend
      // const response = await api.companies.create(newCompany);
      
      // Actualizăm lista locală de companii cu noua companie
      setCompanies([...companies, newCompany]);
      setIsAddCompanyOpen(false);
      setLoading(false);
      
      // Afișăm mesaj de confirmare
      alert(`Compania ${formData.name} a fost creată cu succes!\n\nUn email de invitație a fost trimis la adresa ${formData.adminEmail} pentru a finaliza procesul de onboarding.`);
      
      // Într-o implementare reală, aici am putea:
      // 1. Genera și trimite contractul automat
      // 2. Crea și trimite prima factură
      // 3. Configura automat spațiul de stocare pentru companie
      // 4. Genera credențialele inițiale pentru admin
    }, 2000);
  };

  const handleGenerateOffer = () => {
    setLoading(true);
    
    // Simulare generare ofertă
    setTimeout(() => {
      setLoading(false);
      alert('Oferta a fost generată și poate fi descărcată.');
    }, 1000);
  };

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Spinner />
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Acces interzis</CardTitle>
            <CardDescription>
              Nu aveți permisiunea de a accesa această pagină.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Contactați administratorul sistemului dacă aveți nevoie de acces
              la administrarea companiilor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCompanyData = currentCompany ? companies.find(c => c.id === currentCompany) : null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Building2 className="mr-2 h-8 w-8" />
            Administrare Companii
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestionează companiile înregistrate în sistem
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateOffer}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Generează Ofertă
          </Button>
          
          {canCreateCompany && (
            <Button onClick={handleAddCompany} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Companie
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Companiilor</CardTitle>
          <CardDescription>
            {companies.length} companii înregistrate, {companies.filter(c => c.active).length} active
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume Companie</TableHead>
                  <TableHead>CUI</TableHead>
                  <TableHead>Adresă</TableHead>
                  <TableHead>Angajați</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Nu există companii înregistrate
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow 
                      key={company.id}
                      className={!company.active ? 'opacity-60' : ''}
                    >
                      <TableCell className="font-medium">
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewCompany(company.id);
                          }}
                          className="text-primary hover:underline"
                        >
                          {company.name}
                        </a>
                      </TableCell>
                      <TableCell>{company.cui}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{company.address}</TableCell>
                      <TableCell>{company.employees}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            company.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {company.active ? 'Activă' : 'Inactivă'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={company.onboardingStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {company.onboardingStatus === 'setup_required' && (
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleAssignAdmin(company.id)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditCompany(company.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteCompany(company.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog pentru adăugare companie nouă */}
      <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              {formStep === 1 && 'Date de bază companie'}
              {formStep === 2 && 'Informații juridice și fiscale'}
              {formStep === 3 && 'Detalii abonament'}
              {formStep === 4 && 'Administrator companie'}
            </DialogTitle>
            <DialogDescription>
              {formStep === 1 && 'Completați informațiile de bază despre companie'}
              {formStep === 2 && 'Completați informațiile juridice și fiscale ale companiei'}
              {formStep === 3 && 'Selectați planul de abonament și perioada contractuală'}
              {formStep === 4 && 'Specificați detaliile administratorului care va gestiona compania'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2 max-h-[60vh] overflow-y-auto pr-2">
            {formStep === 1 ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="company-name">Numele Companiei</Label>
                  <Input 
                    id="company-name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: TechCorp SRL"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="company-cui">CUI</Label>
                    <Input 
                      id="company-cui" 
                      value={formData.cui}
                      onChange={(e) => setFormData({...formData, cui: e.target.value})}
                      placeholder="Ex: RO12345678"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-industry">Industrie</Label>
                    <select
                      id="company-industry"
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="">Selectați industria</option>
                      <option value="IT">IT & Software</option>
                      <option value="Manufacturing">Producție</option>
                      <option value="Healthcare">Sănătate</option>
                      <option value="Retail">Retail & Comerț</option>
                      <option value="FinancialServices">Servicii Financiare</option>
                      <option value="Education">Educație</option>
                      <option value="Construction">Construcții</option>
                      <option value="Consulting">Consultanță</option>
                      <option value="Other">Altele</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="company-address">Adresă</Label>
                  <Input 
                    id="company-address" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Ex: Strada Exemplu 123"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="company-city">Oraș</Label>
                    <Input 
                      id="company-city" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Ex: București"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-county">Județ</Label>
                    <Input 
                      id="company-county" 
                      value={formData.county}
                      onChange={(e) => setFormData({...formData, county: e.target.value})}
                      placeholder="Ex: București"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-postal">Cod Poștal</Label>
                    <Input 
                      id="company-postal" 
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      placeholder="Ex: 012345"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="company-phone">Telefon</Label>
                    <Input 
                      id="company-phone" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ex: +40 721 234 567"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-email">Email</Label>
                    <Input 
                      id="company-email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Ex: contact@companie.ro"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="company-website">Website (opțional)</Label>
                  <Input 
                    id="company-website" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="Ex: https://www.companie.ro"
                  />
                </div>
              </div>
            ) : formStep === 2 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="company-vat">Număr TVA</Label>
                    <Input 
                      id="company-vat" 
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({...formData, vatNumber: e.target.value})}
                      placeholder="Ex: RO12345678"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-reg">Număr Registru Comerțului</Label>
                    <Input 
                      id="company-reg" 
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                      placeholder="Ex: J40/123/2015"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="company-founded">Data înființării</Label>
                  <Input 
                    id="company-founded" 
                    type="date"
                    value={formData.foundedDate}
                    onChange={(e) => setFormData({...formData, foundedDate: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="company-bank">Nume Bancă</Label>
                    <Input 
                      id="company-bank" 
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      placeholder="Ex: Banca Transilvania"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-account">Cont Bancar (IBAN)</Label>
                    <Input 
                      id="company-account" 
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                      placeholder="Ex: RO49AAAA1B31007593840000"
                    />
                  </div>
                </div>
              </div>
            ) : formStep === 3 ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="company-plan">Plan Abonament</Label>
                  <select
                    id="company-plan"
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})}
                  >
                    <option value="">Selectați planul</option>
                    <option value="Basic">Basic - 99 EUR/lună</option>
                    <option value="Business">Business - 199 EUR/lună</option>
                    <option value="Enterprise">Enterprise - 399 EUR/lună</option>
                    <option value="Custom">Custom - Preț personalizat</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="company-billing">Ciclu de facturare</Label>
                  <select
                    id="company-billing"
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({...formData, billingCycle: e.target.value})}
                  >
                    <option value="">Selectați ciclul de facturare</option>
                    <option value="Monthly">Lunar</option>
                    <option value="Quarterly">Trimestrial</option>
                    <option value="Biannual">Semestrial</option>
                    <option value="Annual">Anual</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="company-contract-start">Data început contract</Label>
                    <Input 
                      id="company-contract-start" 
                      type="date"
                      value={formData.contractStartDate}
                      onChange={(e) => setFormData({...formData, contractStartDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="company-contract-end">Data încheiere contract</Label>
                    <Input 
                      id="company-contract-end" 
                      type="date"
                      value={formData.contractEndDate}
                      onChange={(e) => setFormData({...formData, contractEndDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="company-notes">Note (opțional)</Label>
                  <textarea
                    id="company-notes"
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 min-h-[80px]"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Note adiționale despre contract sau companie..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-2">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Administratorul companiei va primi un email pentru a finaliza configurarea contului și a invita alți utilizatori.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="admin-name">Numele Administratorului</Label>
                    <Input 
                      id="admin-name" 
                      value={formData.adminName}
                      onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                      placeholder="Ex: Ion Popescu"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="admin-position">Funcție</Label>
                    <Input 
                      id="admin-position" 
                      value={formData.adminPosition}
                      onChange={(e) => setFormData({...formData, adminPosition: e.target.value})}
                      placeholder="Ex: Director General"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="admin-email">Email Administrator</Label>
                    <Input 
                      id="admin-email" 
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      placeholder="Ex: admin@companie.ro"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="admin-phone">Telefon Administrator</Label>
                    <Input 
                      id="admin-phone" 
                      value={formData.adminPhone}
                      onChange={(e) => setFormData({...formData, adminPhone: e.target.value})}
                      placeholder="Ex: +40 721 234 567"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                if (formStep === 1) {
                  setIsAddCompanyOpen(false);
                } else {
                  setFormStep(formStep - 1);
                }
              }}
            >
              {formStep === 1 ? 'Anulează' : 'Înapoi'}
            </Button>
            <Button onClick={handleFormSubmit} disabled={loading}>
              {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
              {formStep < 4 ? 'Continuă' : 'Adaugă Companie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pentru asociere admin la o companie existentă */}
      <Dialog open={isAssignAdminOpen} onOpenChange={setIsAssignAdminOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Atribuire Administrator
            </DialogTitle>
            <DialogDescription>
              {currentCompanyData 
                ? `Atribuiți un administrator pentru compania "${currentCompanyData.name}"` 
                : 'Atribuiți un administrator pentru companie'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Administrator</Label>
              <Input 
                id="admin-email" 
                type="email"
                placeholder="Ex: admin@companie.ro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nume Administrator (opțional)</Label>
              <Input 
                id="admin-name" 
                placeholder="Ex: Ion Popescu"
              />
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Un email va fi trimis la adresa specificată cu instrucțiuni pentru activarea contului de administrator.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignAdminOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleAssignAdminSubmit} disabled={loading}>
              {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
              Trimite Invitație
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pentru etapele manuale de setup */}
      <Dialog open={isManualStep} onOpenChange={setIsManualStep}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <KeyRound className="h-5 w-5 mr-2" />
              Activare Manuală Companie
            </DialogTitle>
            <DialogDescription>
              {currentCompanyData 
                ? `Generați chei de acces pentru compania "${currentCompanyData.name}"` 
                : 'Generați chei de acces pentru companie'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md mb-2">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Notă:</strong> Acest proces este pentru situații speciale, când procesul automat de onboarding nu este posibil.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h3 className="font-medium mb-2">Cheie de Acces</h3>
              <div className="flex items-center">
                <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 font-mono text-sm">
                  API_3f5d7a20e89b1c35d92a
                </code>
                <Button variant="outline" size="sm" className="ml-2" onClick={() => alert('Cheie copiată!')}>
                  Copiază
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h3 className="font-medium mb-2">Secret</h3>
              <div className="flex items-center">
                <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex-1 font-mono text-sm">
                  SEC_b67d9e2a09c8f34d12e78f9ab
                </code>
                <Button variant="outline" size="sm" className="ml-2" onClick={() => alert('Secret copiat!')}>
                  Copiază
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-2">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> Aceste chei permit acces complet la datele companiei. Comunicați-le în mod securizat reprezentantului autorizat.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualStep(false)}>
              Închide
            </Button>
            <Button 
              onClick={() => {
                alert('Email trimis cu succes!');
                setIsManualStep(false);
              }} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              Trimite prin Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 