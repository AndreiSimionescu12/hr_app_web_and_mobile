'use client';

import { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRequirePermission } from '@/lib/permissions/useRequirePermission';
import { Spinner } from '@/components/ui/Spinner';
import {
  Settings, Save, RefreshCw, Database, Shield, Server, 
  HardDrive, AlarmClock, Mail
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function SystemSettingsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const { loading: permissionLoading } = useRequirePermission('users.read');
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'HR Management System',
    maintenanceMode: false,
    debugMode: false,
    allowRegistration: true,
    sessionTimeout: 30,
    defaultLanguage: 'ro'
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@hrsystem.com',
    smtpPassword: '••••••••••••',
    senderEmail: 'no-reply@hrsystem.com',
    senderName: 'HR System',
    enableEmailNotifications: true
  });
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '03:00',
    backupRetention: 7,
    backupLocation: '/storage/backups',
    lastBackup: '2023-12-14T03:00:00'
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulăm salvarea setărilor
    setTimeout(() => {
      setLoading(false);
      alert('Setările generale au fost salvate cu succes!');
    }, 1000);
  };
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulăm salvarea setărilor
    setTimeout(() => {
      setLoading(false);
      alert('Setările de email au fost salvate cu succes!');
    }, 1000);
  };
  
  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulăm salvarea setărilor
    setTimeout(() => {
      setLoading(false);
      alert('Setările de backup au fost salvate cu succes!');
    }, 1000);
  };
  
  const triggerManualBackup = () => {
    setLoading(true);
    
    // Simulăm procesul de backup
    setTimeout(() => {
      setLoading(false);
      const now = new Date().toISOString();
      setBackupSettings({
        ...backupSettings,
        lastBackup: now
      });
      alert('Backup manual realizat cu succes!');
    }, 2000);
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

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Spinner />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Acces interzis</CardTitle>
            <CardDescription>
              Doar Super Administratorii pot accesa setările sistemului.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Contactați administratorul sistemului dacă aveți nevoie de acces
              la această secțiune.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Settings className="h-8 w-8 mr-2" />
        <div>
          <h1 className="text-3xl font-bold">Setări Sistem</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configurează parametrii globali ai sistemului
          </p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Generale</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restaurare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleGeneralSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Setări Generale
                </CardTitle>
                <CardDescription>
                  Configurează parametrii de bază ai sistemului
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Numele Sistemului</Label>
                    <Input 
                      id="siteName" 
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Limba Implicită</Label>
                    <select 
                      id="defaultLanguage"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      value={generalSettings.defaultLanguage}
                      onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                    >
                      <option value="ro">Română</option>
                      <option value="en">Engleză</option>
                      <option value="hu">Maghiară</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout Sesiune (minute)</Label>
                    <Input 
                      id="sessionTimeout" 
                      type="number"
                      value={generalSettings.sessionTimeout}
                      onChange={(e) => setGeneralSettings({...generalSettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="maintenanceMode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked: boolean) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                    />
                    <Label htmlFor="maintenanceMode">Mod Mentenanță</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="debugMode"
                      checked={generalSettings.debugMode}
                      onCheckedChange={(checked: boolean) => setGeneralSettings({...generalSettings, debugMode: checked})}
                    />
                    <Label htmlFor="debugMode">Mod Debug</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allowRegistration"
                      checked={generalSettings.allowRegistration}
                      onCheckedChange={(checked: boolean) => setGeneralSettings({...generalSettings, allowRegistration: checked})}
                    />
                    <Label htmlFor="allowRegistration">Permite Înregistrarea Utilizatorilor</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="flex items-center">
                  {loading ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvează Setări
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <form onSubmit={handleEmailSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Configurare Email
                </CardTitle>
                <CardDescription>
                  Configurează setările pentru trimiterea notificărilor prin email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Switch 
                    id="enableEmailNotifications"
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked: boolean) => setEmailSettings({...emailSettings, enableEmailNotifications: checked})}
                  />
                  <Label htmlFor="enableEmailNotifications">Activează Notificările prin Email</Label>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Server SMTP</Label>
                    <Input 
                      id="smtpServer" 
                      value={emailSettings.smtpServer}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                      disabled={!emailSettings.enableEmailNotifications}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port SMTP</Label>
                    <Input 
                      id="smtpPort" 
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      disabled={!emailSettings.enableEmailNotifications}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Utilizator SMTP</Label>
                    <Input 
                      id="smtpUsername" 
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                      disabled={!emailSettings.enableEmailNotifications}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Parolă SMTP</Label>
                    <Input 
                      id="smtpPassword" 
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      disabled={!emailSettings.enableEmailNotifications}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Email Expeditor</Label>
                    <Input 
                      id="senderEmail" 
                      value={emailSettings.senderEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
                      disabled={!emailSettings.enableEmailNotifications}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Nume Expeditor</Label>
                    <Input 
                      id="senderName" 
                      value={emailSettings.senderName}
                      onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
                      disabled={!emailSettings.enableEmailNotifications}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="flex items-center">
                  {loading ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvează Setări
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <form onSubmit={handleBackupSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  Backup și Restaurare
                </CardTitle>
                <CardDescription>
                  Configurează setările pentru backup automat al bazei de date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Switch 
                    id="autoBackup"
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked: boolean) => setBackupSettings({...backupSettings, autoBackup: checked})}
                  />
                  <Label htmlFor="autoBackup">Activează Backup Automat</Label>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frecvență Backup</Label>
                    <select 
                      id="backupFrequency"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      value={backupSettings.backupFrequency}
                      onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})}
                      disabled={!backupSettings.autoBackup}
                    >
                      <option value="hourly">Orar</option>
                      <option value="daily">Zilnic</option>
                      <option value="weekly">Săptămânal</option>
                      <option value="monthly">Lunar</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupTime">Ora Backup</Label>
                    <Input 
                      id="backupTime" 
                      type="time"
                      value={backupSettings.backupTime}
                      onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                      disabled={!backupSettings.autoBackup || backupSettings.backupFrequency === 'hourly'}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">Perioadă Retenție (zile)</Label>
                    <Input 
                      id="backupRetention" 
                      type="number"
                      value={backupSettings.backupRetention}
                      onChange={(e) => setBackupSettings({...backupSettings, backupRetention: parseInt(e.target.value)})}
                      disabled={!backupSettings.autoBackup}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupLocation">Locație Backup</Label>
                    <Input 
                      id="backupLocation" 
                      value={backupSettings.backupLocation}
                      onChange={(e) => setBackupSettings({...backupSettings, backupLocation: e.target.value})}
                      disabled={!backupSettings.autoBackup}
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium">Ultimul Backup</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {backupSettings.lastBackup ? formatDate(backupSettings.lastBackup) : 'Nu există'}
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={triggerManualBackup}
                      disabled={loading}
                      className="flex items-center"
                    >
                      {loading ? <Spinner className="h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Backup Manual
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => alert('Funcționalitatea de restaurare este în dezvoltare.')}
                >
                  Restaurează din Backup
                </Button>
                <Button type="submit" disabled={loading} className="flex items-center">
                  {loading ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvează Setări
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 