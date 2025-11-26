import { useState, useEffect } from "react";
import { User, Mail, Phone, Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await apiRequest("PUT", `/api/users/${user.id}`, {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
      });
      // Invalidate user cache to sync across the site
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated and synced across the site.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("GET", "/api/logout");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold" data-testid="heading-profile">
              Profile
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your account settings
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Personal Information</CardTitle>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
                className="gap-2"
                data-testid={isEditing ? "button-save" : "button-edit"}
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    {isSaving ? "Saving..." : "Save"}
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl">
                    {firstName[0]}{lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" data-testid="button-change-avatar">
                    Change Avatar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-first-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="pl-10"
                      data-testid="input-phone"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Host Status</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.isHost ? "You are an active host" : "Start hosting charging stations to earn revenue"}
                  </p>
                </div>
                <Badge variant="outline" data-testid="badge-host-status">
                  {user?.isHost ? "Active Host" : "Not a Host"}
                </Badge>
              </div>
              {!user?.isHost && (
                <Button variant="outline" className="w-full" data-testid="button-become-host">
                  Become a Host
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout} data-testid="button-logout">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
