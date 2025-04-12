'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { CapabilityList } from '@/components/permissions/CapabilityList';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { Spinner } from '@/components/ui/Spinner';

// Această componentă va fi adăugată ulterior
const PermissionGroupList = () => <div>Grupuri de permisiuni (se va implementa)</div>;
// Această componentă va fi adăugată ulterior
const UserPermissions = () => <div>Permisiuni utilizatori (se va implementa)</div>;
// Această componentă va fi adăugată ulterior
const RolePermissions = () => <div>Permisiuni roluri (se va implementa)</div>;
// Această componentă va fi adăugată ulterior
const AuditLogs = () => <div>Jurnal de audit (se va implementa)</div>;

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState('capabilities');
  const { hasPermission, loading } = useRequirePermission('permissions.read');

  if (loading) {
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
              la administrarea permisiunilor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card className="bg-white dark:bg-dark-surface border-0 shadow">
        <CardHeader>
          <CardTitle>Administrare Permisiuni</CardTitle>
          <CardDescription>
            Gestionați capacitățile, grupurile și permisiunile utilizatorilor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="capabilities">Capacități</TabsTrigger>
              <TabsTrigger value="groups">Grupuri</TabsTrigger>
              <TabsTrigger value="users">Utilizatori</TabsTrigger>
              <TabsTrigger value="roles">Roluri</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>
            <TabsContent value="capabilities">
              <CapabilityList />
            </TabsContent>
            <TabsContent value="groups">
              <PermissionGroupList />
            </TabsContent>
            <TabsContent value="users">
              <UserPermissions />
            </TabsContent>
            <TabsContent value="roles">
              <RolePermissions />
            </TabsContent>
            <TabsContent value="audit">
              <AuditLogs />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 