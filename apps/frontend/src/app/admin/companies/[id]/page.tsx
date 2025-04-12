'use client';

import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { Spinner } from '@/components/ui/Spinner';
import { 
  Building2, Users, Mail, Phone, MapPin, Calendar, Clock, ArrowLeft, Edit,
  Briefcase, CheckCircle, FileText, Download, Settings, User, Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/Table';

// Date mock pentru companie
const mockCompany = {
  id: '1',
  name: 'TechCorp SRL',
  cui: 'RO12345678',
  address: 'Strada Exemplu 123, București',
  employees: 45,
  active: true,
  onboardingStatus: 'completed',
  adminEmail: 'admin@techcorp.ro',
  phone: '+40 721 234 567',
  industry: 'IT & Software',
  foundedDate: '2015-03-12',
  website: 'https://techcorp.example.com',
  description: 'TechCorp este o companie specializată în dezvoltarea de software pentru industria financiară și oferă soluții inovative pentru bănci și instituții financiare.',
  contactPerson: 'Maria Popescu',
  contactPersonRole: 'Director HR',
  subscription: {
    plan: 'Business',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    price: 199,
    status: 'active'
  }
};

// Lista de companii mock
const companies = [
  { id: '1', name: 'TechCorp SRL' },
  { id: '2', name: 'InnovSystems SA' },
  { id: '3', name: 'ConsultPro SRL' },
  { id: '4', name: 'DataTech SRL' },
];

// Date mock pentru departamente
const mockDepartments = [
  { id: '1', name: 'IT & Development', employeeCount: 18, manager: 'Ion Popescu' },
  { id: '2', name: 'Marketing', employeeCount: 8, manager: 'Ana Ionescu' },
  { id: '3', name: 'HR', employeeCount: 5, manager: 'Maria Dumitrescu' },
  { id: '4', name: 'Finance', employeeCount: 6, manager: 'George Vasilescu' },
  { id: '5', name: 'Sales', employeeCount: 8, manager: 'Alexandru Stanescu' }
];

// Date mock pentru utilizatori
const mockUsers = [
  { id: '1', name: 'Maria Popescu', email: 'maria.popescu@techcorp.example.com', role: 'COMPANY_ADMIN', department: 'HR', status: 'active' },
  { id: '2', name: 'Ion Popescu', email: 'ion.popescu@techcorp.example.com', role: 'MANAGER', department: 'IT & Development', status: 'active' },
  { id: '3', name: 'Ana Ionescu', email: 'ana.ionescu@techcorp.example.com', role: 'MANAGER', department: 'Marketing', status: 'active' },
  { id: '4', name: 'Mihai Georgescu', email: 'mihai.georgescu@techcorp.example.com', role: 'EMPLOYEE', department: 'IT & Development', status: 'active' },
  { id: '5', name: 'Elena Vasilescu', email: 'elena.vasilescu@techcorp.example.com', role: 'EMPLOYEE', department: 'Finance', status: 'inactive' }
];

// Date mock pentru activitate
const mockActivity = [
  { id: '1', action: 'Utilizator adăugat', target: 'Mihai Georgescu', date: '2023-11-15T14:30:00', user: 'Maria Popescu' },
  { id: '2', action: 'Departament creat', target: 'Marketing', date: '2023-11-10T09:45:00', user: 'Maria Popescu' },
  { id: '3', action: 'Plan actualizat', target: 'Business → Enterprise', date: '2023-10-25T11:20:00', user: 'System' },
  { id: '4', action: 'Utilizator dezactivat', target: 'Elena Vasilescu', date: '2023-10-20T16:15:00', user: 'Maria Popescu' },
  { id: '5', action: 'Raport generat', target: 'Raport HR Octombrie', date: '2023-10-05T10:30:00', user: 'Ion Popescu' }
];

// Date mock pentru documente
const mockDocuments = [
  { id: '1', name: 'Contract abonament.pdf', type: 'Contract', size: '1.2MB', date: '2023-01-15T10:00:00', status: 'semnat' },
  { id: '2', name: 'Factură Ianuarie 2023.pdf', type: 'Factură', size: '0.8MB', date: '2023-01-15T10:05:00', status: 'plătit' },
  { id: '3', name: 'Factură Februarie 2023.pdf', type: 'Factură', size: '0.8MB', date: '2023-02-15T10:00:00', status: 'plătit' },
  { id: '4', name: 'Factură Martie 2023.pdf', type: 'Factură', size: '0.8MB', date: '2023-03-15T10:00:00', status: 'plătit' },
  { id: '5', name: 'Oferta actualizare plan.pdf', type: 'Ofertă', size: '1.5MB', date: '2023-10-20T14:30:00', status: 'în așteptare' }
];

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [company, setCompany] = useState(mockCompany);
  const [departments, setDepartments] = useState(mockDepartments);
  const [users, setUsers] = useState(mockUsers);
  const [activity, setActivity] = useState(mockActivity);
  const [documents, setDocuments] = useState(mockDocuments);
  const [loading, setLoading] = useState(true);
  
  const { hasPermission, loading: permissionLoading } = useRequirePermission('companies.read');
  
  useEffect(() => {
    // Simulare încărcare date
    const timer = setTimeout(() => {
      // Încărcăm datele corecte pentru companie în funcție de ID
      const companyId = params.id;
      const foundCompany = companies.find(c => c.id === companyId);
      
      if (foundCompany) {
        // În mod real aici ar fi un apel API care ar aduce datele companiei specifice
        setCompany({
          ...mockCompany,
          id: companyId,
          name: foundCompany.name
        });
      }
      
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [params.id]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleDownloadDocument = (id: string) => {
    // Simulare descărcare document
    const document = documents.find(doc => doc.id === id);
    if (document) {
      alert(`Descărcare document: ${document.name}`);
    }
  };
  
  const handleGenerateInvoice = () => {
    alert('Funcționalitate în dezvoltare: Generare factură');
  };
  
  if (permissionLoading || loading) {
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
              la detaliile companiilor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/admin/companies')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista companiilor
        </Button>
        
        <h1 className="text-3xl font-bold flex items-center">
          <Building2 className="mr-2 h-8 w-8" />
          {company.name}
        </h1>
        
        <Badge className={company.active ? 'bg-green-500' : 'bg-gray-500'}>
          {company.active ? 'Activă' : 'Inactivă'}
        </Badge>
        
        <div className="flex-1"></div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editează
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Informații Companie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">CUI</Label>
              <p className="font-medium">{company.cui}</p>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Industrie</Label>
              <p className="font-medium">{company.industry}</p>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Adresă</Label>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mr-1 mt-0.5" />
                <p>{company.address}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Contact</Label>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-1" />
                  <p>{company.phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-1" />
                  <p>{company.adminEmail}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Data înființării</Label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                <p>{formatDate(company.foundedDate)}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Persoană de contact</Label>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-1" />
                <p>{company.contactPerson} - {company.contactPersonRole}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Detalii Abonament
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Plan curent</Label>
              <p className="font-medium">{company.subscription.plan}</p>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Status</Label>
              <Badge className={company.subscription.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                {company.subscription.status === 'active' ? 'Activ' : 'În așteptare'}
              </Badge>
            </div>
            
            <div>
              <Label className="text-xs text-gray-500 dark:text-gray-400">Preț lunar</Label>
              <p className="font-medium">{company.subscription.price} EUR</p>
            </div>
            
            <div className="pt-2">
              <Label className="text-xs text-gray-500 dark:text-gray-400">Perioadă</Label>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  {formatDate(company.subscription.startDate)}
                </div>
                <div className="text-gray-500 dark:text-gray-400">→</div>
                <div className="text-sm">
                  {formatDate(company.subscription.endDate)}
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                onClick={handleGenerateInvoice}
              >
                Generează factură
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Statistici
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Angajați</Label>
                <p className="text-2xl font-semibold">{company.employees}</p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Departamente</Label>
                <p className="text-2xl font-semibold">{departments.length}</p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Utilizatori platformă</Label>
                <p className="text-2xl font-semibold">{users.length}</p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Documente</Label>
                <p className="text-2xl font-semibold">{documents.length}</p>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Structura departamente</h3>
              <div className="space-y-2">
                {departments.map(department => (
                  <div 
                    key={department.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{department.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{department.employeeCount} angajați</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="description">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Descriere</TabsTrigger>
          <TabsTrigger value="departments">Departamente</TabsTrigger>
          <TabsTrigger value="users">Utilizatori</TabsTrigger>
          <TabsTrigger value="documents">Documente</TabsTrigger>
          <TabsTrigger value="activity">Activitate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>Descriere Companie</CardTitle>
              <CardDescription>
                Detalii despre {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {company.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Departamente</CardTitle>
                <CardDescription>
                  Lista departamentelor din cadrul companiei
                </CardDescription>
              </div>
              <Button size="sm">
                Adaugă departament
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Denumire</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead className="text-right">Angajați</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map(department => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell className="text-right">{department.employeeCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Utilizatori</CardTitle>
                <CardDescription>
                  Utilizatorii platformei din cadrul companiei
                </CardDescription>
              </div>
              <Button size="sm">
                Adaugă utilizator
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Departament</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {user.role === 'COMPANY_ADMIN' && <Shield className="h-4 w-4 text-blue-500 mr-1" />}
                          {user.role === 'MANAGER' && <Users className="h-4 w-4 text-green-500 mr-1" />}
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                          {user.status === 'active' ? 'Activ' : 'Inactiv'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documente</CardTitle>
                <CardDescription>
                  Documente asociate companiei
                </CardDescription>
              </div>
              <Button size="sm">
                Încarcă document
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mărime</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map(document => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>{formatDate(document.date)}</TableCell>
                      <TableCell>
                        <Badge className={
                          document.status === 'semnat' 
                            ? 'bg-green-500' 
                            : document.status === 'plătit' 
                              ? 'bg-blue-500' 
                              : 'bg-yellow-500'
                        }>
                          {document.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{document.size}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadDocument(document.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activitate Recentă</CardTitle>
              <CardDescription>
                Istoricul activității din ultimele 30 de zile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {activity.map(item => (
                  <div key={item.id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                        {item.action.includes('Utilizator') && <User className="h-5 w-5 text-blue-500" />}
                        {item.action.includes('Departament') && <Users className="h-5 w-5 text-green-500" />}
                        {item.action.includes('Plan') && <Settings className="h-5 w-5 text-purple-500" />}
                        {item.action.includes('Raport') && <FileText className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="h-full w-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="space-y-1 pb-8">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">
                          {item.action}: <span className="font-semibold">{item.target}</span>
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatDateTime(item.date)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        de către {item.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 