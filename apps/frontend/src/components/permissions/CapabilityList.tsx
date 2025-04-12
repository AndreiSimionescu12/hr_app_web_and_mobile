'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Capability, PermissionApiService } from '@/lib/permissions/permissionApiService';
import { AlertDialog } from '@/components/ui/AlertDialog';
import { Spinner } from '@/components/ui/Spinner';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';

// Date mock pentru testare
const mockCapabilities: Capability[] = [
  {
    id: '1',
    name: 'permissions.read',
    description: 'Permite vizualizarea permisiunilor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'permissions.create',
    description: 'Permite crearea de noi permisiuni',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'permissions.update',
    description: 'Permite actualizarea permisiunilor existente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'permissions.delete',
    description: 'Permite ștergerea permisiunilor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'users.read',
    description: 'Permite vizualizarea utilizatorilor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'users.create',
    description: 'Permite crearea de noi utilizatori',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function CapabilityList() {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State pentru dialog de adăugare/editare
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Adaugă capacitate');
  const [editingCapability, setEditingCapability] = useState<Capability | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  // State pentru dialog de confirmare ștergere
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [capabilityToDelete, setCapabilityToDelete] = useState<Capability | null>(null);

  // Verificăm permisiunile utilizatorului
  const { hasPermission: canCreate } = useRequirePermission('permissions.create');
  const { hasPermission: canUpdate } = useRequirePermission('permissions.update');
  const { hasPermission: canDelete } = useRequirePermission('permissions.delete');

  // Încărcăm lista de capacități
  useEffect(() => {
    loadCapabilities();
  }, []);

  const loadCapabilities = async () => {
    setLoading(true);
    try {
      // În loc să apelăm API-ul, folosim datele mock
      // În implementarea reală, am folosi:
      // const data = await PermissionApiService.getAllCapabilities();
      
      // Simulăm un delay pentru a simula încărcarea
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCapabilities(mockCapabilities);
      setError(null);
    } catch (err) {
      console.error('Eroare la încărcarea capacităților:', err);
      setError('Nu s-au putut încărca capacitățile. Încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setDialogTitle('Adaugă capacitate');
    setFormData({ name: '', description: '' });
    setEditingCapability(null);
    setShowDialog(true);
  };

  const handleEdit = (capability: Capability) => {
    setDialogTitle('Editează capacitate');
    setFormData({
      name: capability.name,
      description: capability.description,
    });
    setEditingCapability(capability);
    setShowDialog(true);
  };

  const handleDelete = (capability: Capability) => {
    setCapabilityToDelete(capability);
    setShowDeleteDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingCapability) {
        // Simulăm editarea capacității
        const updatedCapabilities = capabilities.map(cap => 
          cap.id === editingCapability.id 
            ? { ...cap, ...formData, updatedAt: new Date().toISOString() } 
            : cap
        );
        setCapabilities(updatedCapabilities);
      } else {
        // Simulăm adăugarea unei noi capacități
        const newCapability: Capability = {
          id: `${Date.now()}`, // Generăm un ID unic
          name: formData.name,
          description: formData.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCapabilities([...capabilities, newCapability]);
      }
      
      setShowDialog(false);
    } catch (err) {
      console.error('Eroare la salvarea capacității:', err);
      setError('Nu s-a putut salva capacitatea. Încercați din nou.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!capabilityToDelete) return;
    
    try {
      // Simulăm ștergerea capacității
      const filteredCapabilities = capabilities.filter(cap => cap.id !== capabilityToDelete.id);
      setCapabilities(filteredCapabilities);
      setShowDeleteDialog(false);
      setCapabilityToDelete(null);
    } catch (err) {
      console.error('Eroare la ștergerea capacității:', err);
      setError('Nu s-a putut șterge capacitatea. Încercați din nou.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Spinner /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Capacități (Permisiuni)</h2>
        {canCreate && (
          <Button onClick={handleAddNew}>Adaugă capacitate</Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Descriere</TableHead>
            <TableHead className="w-[150px]">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {capabilities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                Nu există capacități definite
              </TableCell>
            </TableRow>
          ) : (
            capabilities.map(capability => (
              <TableRow key={capability.id}>
                <TableCell>{capability.name}</TableCell>
                <TableCell>{capability.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {canUpdate && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(capability)}
                      >
                        Editare
                      </Button>
                    )}
                    {canDelete && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(capability)}
                      >
                        Ștergere
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Dialog pentru adăugare/editare */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nume
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Introdu numele capacității"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descriere
              </label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Introdu descrierea capacității"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Anulare
            </Button>
            <Button onClick={handleSave}>Salvare</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmare ștergere */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Ești sigur?</AlertDialog.Title>
            <AlertDialog.Description>
              Această acțiune nu poate fi anulată. Aceasta va șterge permanent
              capacitatea <strong>{capabilityToDelete?.name}</strong>.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Anulare
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Ștergere
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  );
} 