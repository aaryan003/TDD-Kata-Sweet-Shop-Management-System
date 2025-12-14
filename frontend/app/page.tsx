"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, Candy, LogOut, Plus, Loader2 } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { AdminPanel } from "@/components/admin-panel"
import { authService } from "@/services/auth.service"
import { sweetService } from "@/services/sweet.service"
import { Sweet } from "@/types"
import { toast } from "sonner"
import { getSweetImage } from "@/lib/utils"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ["all", "chocolate", "gummy", "caramel", "hard candy", "marshmallow", "sour"]

  useEffect(() => {
    checkAuth()
    loadSweets()
  }, [])

  const checkAuth = () => {
    const authenticated = authService.isAuthenticated()
    const admin = authService.isAdmin()
    setIsLoggedIn(authenticated)
    setIsAdmin(admin)
  }

  const loadSweets = async () => {
    try {
      setLoading(true)
      const data = await sweetService.getAll()
      setSweets(data)
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error("Failed to load sweets")
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch =
      sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sweet.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || sweet.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleLoginSuccess = () => {
    checkAuth()
    setShowLogin(false)
    loadSweets()
  }

  const handleRegisterSuccess = () => {
    checkAuth()
    setShowRegister(false)
    loadSweets()
  }

  const handleLogout = () => {
    authService.logout()
    setIsLoggedIn(false)
    setIsAdmin(false)
    setShowAdmin(false)
    toast.success("Logged out successfully")
  }

  const handlePurchase = async (sweetId: string) => {
    try {
      await sweetService.purchase(sweetId, 1)
      toast.success("Purchase successful! 🎉")
      loadSweets()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Purchase failed")
    }
  }

  if (showLogin) {
    return (
      <LoginForm
        onLogin={handleLoginSuccess}
        onBack={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
      />
    )
  }

  if (showRegister) {
    return (
      <RegisterForm
        onRegister={handleRegisterSuccess}
        onBack={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
      />
    )
  }

  if (showAdmin && isAdmin) {
    return (
      <AdminPanel
        onBack={() => {
          setShowAdmin(false)
          loadSweets()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Candy className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-balance">Sweet Shop</h1>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Button onClick={() => setShowAdmin(true)} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {"Admin Panel"}
                  </Button>
                )}
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  {"Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowLogin(true)} variant="ghost" size="sm">
                  {"Login"}
                </Button>
                <Button onClick={() => setShowRegister(true)} size="sm">
                  {"Sign Up"}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance lg:text-5xl">{"Indulge in Sweetness"}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {
              "Discover our delightful collection of handcrafted sweets, from rich chocolates to tangy sours. Every treat is made with love and the finest ingredients."
            }
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for your favorite sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">{"No sweets found matching your search."}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSweets.map((sweet) => (
              <Card key={sweet._id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={getSweetImage(sweet.name)}
                    alt={sweet.name}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-balance">{sweet.name}</CardTitle>
                    <Badge variant={sweet.quantity > 0 ? "default" : "destructive"}>
                      {sweet.quantity > 0 ? `${sweet.quantity} left` : "Out of stock"}
                    </Badge>
                  </div>
                  <CardDescription className="text-pretty capitalize">{sweet.category}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${sweet.price.toFixed(2)}</span>
                  <Button
                    onClick={() => handlePurchase(sweet._id)}
                    disabled={sweet.quantity === 0 || !isLoggedIn}
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isLoggedIn ? "Purchase" : "Login to Buy"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/50 py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>{"© 2025 Sweet Shop. All rights reserved."}</p>
          <p className="mt-2">{"Made with ❤️ and lots of sugar"}</p>
        </div>
      </footer>
    </div>
  )
}