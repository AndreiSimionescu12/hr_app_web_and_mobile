'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Separator } from '@/components/ui/Separator';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/Dialog';
import { Spinner } from '@/components/ui/Spinner';
import { 
  User, ArrowLeft, Save, ShieldCheck, Lock, Mail, 
  Building, Calendar, UserCog, MapPin, Key, AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';

// Roluri disponibile în sistem
const availableRoles = [
  { id: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Acces complet la toate funcționalitățile sistemului' },
  { id: 'COMPANY_ADMIN', name: 'Administrator Companie', description: 'Administrează utilizatorii și setările companiei' },
  { id: 'MANAGER', name: 'Manager', description: 'Gestionează angajații și departamentele' },
  { id: 'EMPLOYEE', name: 'Angajat', description: 'Acces de bază la funcționalitățile sistemului' }
];

// Date mock pentru utilizatorul actual
const mockUserData = {
  id: '1',
  name: 'Administrator Sistem',
  email: 'admin@test.com',
  role: 'SUPER_ADMIN',
  company: 'Sistem',
  companyId: 'system',
  position: 'Administrator Sistem',
  department: 'IT & Administrare',
  active: true,
  phone: '+40 721 234 567',
  address: 'Strada Exemplu 123, București',
  lastLogin: '2023-12-15T08:30:00',
  createdAt: '2023-01-01T00:00:00',
  capabilities: [
    'users.read', 'users.create', 'users.update', 'users.delete',
    'companies.read', 'companies.create', 'companies.update', 'companies.delete',
    'system.settings'
  ]
};

// Mock companii
const mockCompanies = [
  { id: 'system', name: 'Sistem' },
  { id: '1', name: 'TechCorp SRL' },
  { id: '2', name: 'InnovSystems SA' },
  { id: '3', name: 'ConsultPro SRL' }
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [userData, setUserData] = useState(mockUserData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  
  const { hasPermission, loading: permissionLoading } = useRequirePermission('users.read');
  const canEdit = useRequirePermission('users.update').hasPermission;
  const canDelete = useRequirePermission('users.delete').hasPermission;

  useEffect(() => {
    // Simulăm încărcarea datelor utilizatorului
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    setChangesMade(true);
  };

  const handleSwitchChange = (checked: boolean, field: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: checked
    }));
    setChangesMade(true);
  };

  const handleSaveUser = () => {
    setSaving(true);
    // Simulăm salvarea datelor
    setTimeout(() => {
      setSaving(false);
      setChangesMade(false);
      alert('Datele utilizatorului au fost salvate cu succes!');
    }, 1500);
  };

  const handleResetPassword = () => {
    // Simulăm resetarea parolei
    setTimeout(() => {
      setIsResetPasswordOpen(false);
      alert('Un email pentru resetarea parolei a fost trimis utilizatorului.');
    }, 1000);
  };

  const handleDeleteUser = () => {
    // Simulăm ștergerea utilizatorului
    setTimeout(() => {
      setIsDeleteDialogOpen(false);
      router.push('/admin/users');
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (permissionLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen py-12">
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
              la administrarea utilizatorilor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-4"
            onClick={() => router.push('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la lista utilizatorilor
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <User className="mr-2 h-8 w-8" />
              {userData.name}
              {userData.role === 'SUPER_ADMIN' && (
                <Badge className="ml-2 bg-red-500" variant="destructive">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Super Admin
                </Badge>
              )}
              {!userData.active && (
                <Badge className="ml-2" variant="secondary">Inactiv</Badge>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {userData.email} • {userData.position} la {userData.company}
            </p>
          </div>
        </div>
        
        <div className="space-x-2">
          {canEdit && (
            <Button 
              onClick={handleSaveUser} 
              disabled={saving || !changesMade}
              className="flex items-center"
            >
              {saving ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvează modificările
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Informații generale</TabsTrigger>
          <TabsTrigger value="security">Securitate & Acces</TabsTrigger>
          <TabsTrigger value="activity">Activitate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informații de bază
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume complet</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresă</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Informații profesionale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Companie</Label>
                  <select
                    id="company"
                    name="companyId"
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={userData.companyId}
                    onChange={handleInputChange}
                    disabled={!canEdit || userData.role === 'SUPER_ADMIN'}
                  >
                    {mockCompanies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Funcție</Label>
                  <Input 
                    id="position"
                    name="position"
                    value={userData.position}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departament</Label>
                  <Input 
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                </div>
                
                <div className="mt-4 flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={userData.active}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'active')}
                    disabled={!canEdit}
                  />
                  <Label htmlFor="active">
                    {userData.active ? 'Utilizator activ' : 'Utilizator inactiv'}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCog className="h-5 w-5 mr-2" />
                  Rol și permisiuni
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol în sistem</Label>
                  <select
                    id="role"
                    name="role"
                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    value={userData.role}
                    onChange={handleInputChange}
                    disabled={!canEdit || userData.id === '1'} // Nu permitem schimbarea rolului pentru admin principal
                  >
                    {availableRoles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Descriere rol:
                  </p>
                  <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    {availableRoles.find(r => r.id === userData.role)?.description || 'Rol necunoscut'}
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label>Capabilități</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {userData.capabilities.map((capability, index) => (
                        <Badge key={index} variant="secondary">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Securitate cont
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Parolă</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Parolele sunt stocate criptat și nu pot fi văzute
                      </p>
                    </div>
                  </div>
                  
                  {canEdit && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setIsResetPasswordOpen(true)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Trimite link pentru resetare parolă
                    </Button>
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Informații autentificare</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-gray-500">Ultima conectare:</span>
                      <span>{formatDate(userData.lastLogin)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-gray-500">Cont creat la:</span>
                      <span>{formatDate(userData.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {canDelete && (
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Șterge utilizatorul
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Istoricul activității
              </CardTitle>
              <CardDescription>
                Ultimele acțiuni efectuate de utilizator în sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <UserCheck className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Funcționalitate în dezvoltare.</p>
                <p>Istoricul activității va fi disponibil în curând.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog pentru resetarea parolei */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resetare parolă</DialogTitle>
            <DialogDescription>
              Un email cu link pentru resetarea parolei va fi trimis la adresa utilizatorului.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Utilizatorul va trebui să-și configureze o nouă parolă prin link-ul primit.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Email pentru resetare</Label>
              <Input value={userData.email} disabled />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleResetPassword}>
              Trimite email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pentru ștergerea utilizatorului */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmare ștergere</DialogTitle>
            <DialogDescription>
              Această acțiune va șterge definitiv utilizatorul și nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md mb-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  Toate datele asociate cu <strong>{userData.name}</strong> vor fi șterse definitiv din sistem.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Utilizator</Label>
              <Input value={`${userData.name} (${userData.email})`} disabled />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Da, șterge utilizatorul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 