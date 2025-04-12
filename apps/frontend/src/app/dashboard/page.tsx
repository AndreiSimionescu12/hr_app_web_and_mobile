'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { PieChart, Users, Building2, Settings, Shield } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { hasPermission: canManagePermissions } = useRequirePermission('permissions.read');
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Date statistice mock
  const stats = {
    companies: 12,
    users: 145,
    roles: 4,
    permissions: 48
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Companii</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
            <p className="text-xs text-muted-foreground">Companii active în sistem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Utilizatori înregistrați</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Roluri Sistem</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roles}</div>
            <p className="text-xs text-muted-foreground">Roluri configurate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Permisiuni</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.permissions}</div>
            <p className="text-xs text-muted-foreground">Permisiuni definite</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bun venit!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bine ai venit, {user?.email || 'utilizator'}!</p>
            <p className="mt-2">Rolul tău: <span className="font-semibold">{user?.role || 'Necunoscut'}</span></p>
          </CardContent>
        </Card>
        
        {isSuperAdmin && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Administrare Sistem</span>
              </CardTitle>
              <CardDescription>
                Ca Super Admin, ai acces complet la toate funcționalitățile sistemului
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="/admin/companies" 
                  className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Administrare Companii</span>
                </a>
                <a 
                  href="/admin/users" 
                  className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  <Users className="h-5 w-5" />
                  <span>Administrare Utilizatori</span>
                </a>
                <a 
                  href="/admin/permissions" 
                  className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  <Shield className="h-5 w-5" />
                  <span>Administrare Permisiuni</span>
                </a>
                <a 
                  href="/admin/system" 
                  className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  <Settings className="h-5 w-5" />
                  <span>Setări Sistem</span>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
        
        {canManagePermissions && !isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Administrare</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ai acces la administrarea permisiunilor în sistem.</p>
              
              <div className="mt-4">
                <a 
                  href="/admin/permissions" 
                  className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  Administrare Permisiuni
                </a>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Statistici</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Funcționalitate în curs de dezvoltare.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 