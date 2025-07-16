import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Trophy, 
  Shield, 
  Camera,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  IndianRupee
} from "lucide-react";

// Mock data based on your schema
const mockCaretaker = {
  _id: "64f1234567890abcdef12345",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@email.com",
  phone: "9876543210",
  location_city_id: "64f1234567890abcdef12346", // Mumbai
  city_name: "Mumbai",
  experience_years: 3,
  profilepicture_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  aadhaar_number: "1234", // Last 4 digits
  aadhaar_image_url: "https://th.bing.com/th/id/OIP.3U017h9GAnFM3aRkV-WLiwHaHa?w=191&h=190&c=7&r=0&o=7&pid=1.7&rm=3",
  selfie_with_aadhaar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  background_verified: true,
  verification_level: "aadhaar_selfie_verified",
  last_login: new Date("2024-01-15T10:30:00Z"),
  rating: 4.5,
  is_available: true,
  completed_bookings: 87,
  createdAt: new Date("2023-10-01T00:00:00Z"),
  updatedAt: new Date("2024-01-15T10:30:00Z")
};

const mockRecentBookings = [
  {
    id: "1",
    property_name: "Luxury Villa - Bandra",
    guest_name: "Mr. Sharma",
    date: "2024-01-15",
    time: "10:00 AM - 2:00 PM",
    status: "completed",
    rating: 5,
    earnings: 800
  },
  {
    id: "2",
    property_name: "Cozy Apartment - Andheri",
    guest_name: "Ms. Priya",
    date: "2024-01-14",
    time: "2:00 PM - 6:00 PM",
    status: "completed",
    rating: 4,
    earnings: 600
  },
  {
    id: "3",
    property_name: "Modern Studio - Powai",
    guest_name: "Mr. Verma",
    date: "2024-01-16",
    time: "9:00 AM - 1:00 PM",
    status: "upcoming",
    rating: null,
    earnings: 700
  }
];

export function CaretakerDashboard() {
  const [isAvailable, setIsAvailable] = useState(mockCaretaker.is_available);
  const [activeTab, setActiveTab] = useState("overview");

  const getVerificationBadge = () => {
    if (mockCaretaker.background_verified && mockCaretaker.verification_level === "aadhaar_selfie_verified") {
      return <Badge className="bg-gradient-success border-0"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
    }
    return <Badge variant="outline" className="text-warning border-warning"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-gradient-success border-0">Completed</Badge>;
      case "upcoming":
        return <Badge className="bg-gradient-primary border-0">Upcoming</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                UrbanSaarthi
              </div>
              <div className="text-sm text-muted-foreground">Caretaker Dashboard</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockCaretaker.profilepicture_url} />
                  <AvatarFallback>{mockCaretaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{mockCaretaker.name}</p>
                  <p className="text-muted-foreground">{mockCaretaker.city_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {mockCaretaker.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your caretaking services today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCaretaker.completed_bookings}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1 text-success" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {mockCaretaker.rating}
                <Star className="h-4 w-4 text-warning fill-warning ml-1" />
              </div>
              <p className="text-xs text-muted-foreground">Based on 87 reviews</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month Earnings</CardTitle>
              <IndianRupee className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹24,500</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1 text-success" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCaretaker.experience_years} Years</div>
              <p className="text-xs text-muted-foreground">Professional experience</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Availability Toggle */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Availability Status</span>
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                    className="data-[state=checked]:bg-gradient-success"
                  />
                </CardTitle>
                <CardDescription>
                  {isAvailable ? 
                    "You are currently available for new bookings" : 
                    "You are currently unavailable for new bookings"
                  }
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Recent Bookings */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest service assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{booking.property_name}</h3>
                        <p className="text-sm text-muted-foreground">Guest: {booking.guest_name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            ₹{booking.earnings}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {booking.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning fill-warning" />
                            <span className="text-sm">{booking.rating}</span>
                          </div>
                        )}
                        {getStatusBadge(booking.status)}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative">
                  <Avatar className="h-20 w-20 mx-auto shadow-elegant">
                    <AvatarImage src={mockCaretaker.profilepicture_url} />
                    <AvatarFallback className="text-lg">{mockCaretaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="outline" className="absolute -bottom-1 -right-1 rounded-full p-2 h-8 w-8">
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{mockCaretaker.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {mockCaretaker.city_name}
                </CardDescription>
                <div className="flex justify-center mt-2">
                  {getVerificationBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{mockCaretaker.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{mockCaretaker.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Aadhaar: ****{mockCaretaker.aadhaar_number}</span>
                  </div>
                </div>
                
                <Separator />
                
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Customer Satisfaction</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>On-time Performance</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Response Rate</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.5</div>
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(mockCaretaker.rating) ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}