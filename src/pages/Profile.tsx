import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Calendar, Shield, Mail, Phone, UserCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserBookings } from "@/components/UserBookings";

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface UserRole {
  role: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    username: "",
    phone: "",
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!loading && searchParams.get('scrollTo') === 'bookings') {
      setTimeout(() => {
        bookingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [loading, searchParams]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserEmail(user.email || "");
    await fetchProfile(user.id);
    await fetchUserRole(user.id);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Erro ao carregar perfil");
      return;
    }

    setProfile(data);
    setEditForm({
      full_name: data.full_name || "",
      username: data.username || "",
      phone: data.phone || "",
    });
  };

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching role:", error);
      return;
    }

    setUserRole(data.role);
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editForm.full_name,
        username: editForm.username,
        phone: editForm.phone,
      })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
      return;
    }

    toast.success("Perfil atualizado com sucesso!");
    setIsEditDialogOpen(false);
    fetchProfile(profile.id);
  };

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: "Administrador",
      user: "Cliente",
      moderator: "Moderador",
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "admin") return "default";
    return "secondary";
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-muted-foreground" />
                    <CardTitle>Informações Pessoais</CardTitle>
                  </div>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                        <DialogDescription>
                          Atualize suas informações pessoais
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Nome Completo</Label>
                          <Input
                            id="full_name"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Nome de Usuário</Label>
                          <Input
                            id="username"
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            placeholder="Seu nome de usuário"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full">
                        Salvar Alterações
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm text-muted-foreground">Nome Completo</Label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile.full_name || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Nome de Usuário</Label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile.username}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Telefone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p className="text-base font-medium text-foreground">
                          {profile.phone || "Não informado"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-base font-medium text-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Tipo de Conta</Label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {getRoleLabel(userRole)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <Badge variant={getRoleBadgeVariant(userRole)}>
                      {getRoleLabel(userRole)}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Membro desde</span>
                    <span className="font-semibold text-foreground">
                      {format(new Date(profile.created_at), "yyyy")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* User Bookings */}
              <div ref={bookingsRef}>
                <UserBookings />
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/acomodacoes")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Acomodações
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/contato")}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Entrar em Contato
                  </Button>
                  {userRole === "admin" && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/admin")}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Painel Admin
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
