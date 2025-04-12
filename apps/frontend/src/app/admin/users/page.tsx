'use client';

import { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/Card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/Table';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Pencil, Trash, Users, ShieldCheck, CheckCircle } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';

// Date mock pentru utilizatori
const mockUsers = [
  { 
    id: '1', 
    name: 'Administrator Sistem', 
    email: 'admin@test.com',
    role: 'SUPER_ADMIN',
    company: 'Sistem',
    active: true,
    lastLogin: '2023-12-15T08:30:00'
  },
  { 
    id: '2', 
    name: 'Administrator TechCorp', 
    email: 'company@test.com',
    role: 'COMPANY_ADMIN',
    company: 'TechCorp SRL',
    active: true,
    lastLogin: '2023-12-14T14:20:00'
  },
  { 
    id: '3', 
    name: 'Manager HR', 
    email: 'manager@test.com',
    role: 'MANAGER',
    company: 'TechCorp SRL',
    active: true,
    lastLogin: '2023-12-13T09:45:00'
  },
  { 
    id: '4', 
    name: 'Angajat Test', 
    email: 'employee@test.com',
    role: 'EMPLOYEE',
    company: 'TechCorp SRL',
    active: true,
    lastLogin: '2023-12-10T16:15:00'
  },
  { 
    id: '5', 
    name: 'Manager Inactiv', 
    email: 'inactive@example.com',
    role: 'MANAGER',
    company: 'InnovSystems SA',
    active: false,
    lastLogin: '2023-11-20T10:30:00'
  },
];

// Traduceri pentru roluri
const roleTranslations: Record<string, string> = {
  'SUPER_ADMIN': 'Super Administrator',
  'COMPANY_ADMIN': 'Administrator Companie',
  'MANAGER': 'Manager',
  'EMPLOYEE': 'Angajat'
};

// Mock companii
const mockCompanies = [
  { id: 'system', name: 'Sistem' },
  { id: '1', name: 'TechCorp SRL' },
  { id: '2', name: 'InnovSystems SA' },
  { id: '3', name: 'ConsultPro SRL' }
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addUserSuccess, setAddUserSuccess] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    companyId: '',
    position: '',
    department: '',
    phone: '',
    sendInvitation: true
  });

  const { hasPermission, loading: permissionLoading } = useRequirePermission('users.read');
  const canCreate = useRequirePermission('users.create').hasPermission;

  const handleAddUser = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'EMPLOYEE',
      companyId: '',
      position: '',
      department: '',
      phone: '',
      sendInvitation: true
    });
    setIsAddUserOpen(true);
    setAddUserSuccess(false);
  };

  const handleEditUser = (id: string) => {
    alert(`Funcționalitate în dezvoltare: Editare utilizator ${id}`);
  };

  const handleDeleteUser = (id: string) => {
    alert(`Funcționalitate în dezvoltare: Ștergere utilizator ${id}`);
  };

  const handleViewUser = (id: string) => {
    window.location.href = `/admin/users/${id}`;
  };

  const handleNewUserSubmit = () => {
    setLoading(true);
    
    // Simulăm adăugarea utilizatorului
    setTimeout(() => {
      const newId = (parseInt(users[users.length - 1].id) + 1).toString();
      
      const createdUser = {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: mockCompanies.find(c => c.id === newUser.companyId)?.name || '',
        active: true,
        lastLogin: new Date().toISOString()
      };
      
      setUsers([...users, createdUser]);
      setLoading(false);
      setAddUserSuccess(true);
      
      // Închidem dialogul după feedback
      setTimeout(() => {
        setIsAddUserOpen(false);
      }, 2000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean, field: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: checked
    }));
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
              la administrarea utilizatorilor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-2 h-8 w-8" />
            Administrare Utilizatori
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestionează utilizatorii înregistrați în sistem
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleAddUser} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Utilizator
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista Utilizatorilor</CardTitle>
          <CardDescription>
            {users.length} utilizatori înregistrați, {users.filter(u => u.active).length} activi
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
                  <TableHead>Nume</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Companie</TableHead>
                  <TableHead>Ultima conectare</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Nu există utilizatori înregistrați
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow 
                      key={user.id}
                      className={!user.active ? 'opacity-60' : ''}
                    >
                      <TableCell className="font-medium">
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewUser(user.id);
                          }}
                          className="text-primary hover:underline"
                        >
                          {user.name}
                        </a>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {user.role === 'SUPER_ADMIN' && <ShieldCheck className="text-red-500 mr-1 h-4 w-4" />}
                          {roleTranslations[user.role] || user.role}
                        </div>
                      </TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {user.active ? 'Activ' : 'Inactiv'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
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

      {/* Dialog pentru adăugare utilizator nou */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Adaugă utilizator nou
            </DialogTitle>
            <DialogDescription>
              Completați informațiile necesare pentru crearea unui cont nou de utilizator.
            </DialogDescription>
          </DialogHeader>
          
          {addUserSuccess ? (
            <div className="py-6 flex flex-col items-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-full p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Utilizator adăugat cu succes!</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Un email de invitație a fost trimis la adresa {newUser.email}.
              </p>
            </div>
          ) : (
            <>
              <div className="py-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nume complet *</Label>
                      <Input 
                        id="name"
                        name="name"
                        placeholder="Ex: Ion Popescu"
                        value={newUser.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Ex: ion.popescu@email.com"
                        value={newUser.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        placeholder="Ex: +40 721 234 567"
                        value={newUser.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol *</Label>
                      <select
                        id="role"
                        name="role"
                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                        value={newUser.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selectează un rol</option>
                        <option value="COMPANY_ADMIN">Administrator Companie</option>
                        <option value="MANAGER">Manager</option>
                        <option value="EMPLOYEE">Angajat</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyId">Companie *</Label>
                    <select
                      id="companyId"
                      name="companyId"
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      value={newUser.companyId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selectează o companie</option>
                      {mockCompanies.filter(c => c.id !== 'system').map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Funcție</Label>
                      <Input 
                        id="position"
                        name="position"
                        placeholder="Ex: Manager HR"
                        value={newUser.position}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Departament</Label>
                      <Input 
                        id="department"
                        name="department"
                        placeholder="Ex: Resurse Umane"
                        value={newUser.department}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      id="sendInvitation"
                      checked={newUser.sendInvitation}
                      onCheckedChange={(checked) => handleSwitchChange(checked, 'sendInvitation')}
                    />
                    <Label htmlFor="sendInvitation">
                      Trimite invitație prin email
                    </Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Anulează
                </Button>
                <Button 
                  onClick={handleNewUserSubmit} 
                  disabled={!newUser.name || !newUser.email || !newUser.role || !newUser.companyId || loading}
                >
                  {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                  Adaugă utilizator
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 