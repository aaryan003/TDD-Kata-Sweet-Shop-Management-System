"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Pencil, Trash2, Candy, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { sweetService } from "@/services/sweet.service"
import { Sweet } from "@/types"
import { toast } from "sonner"

interface AdminPanelProps {
  onBack: () => void
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  })

  useEffect(() => {
    loadSweets()
  }, [])

  const loadSweets = async () => {
    try {
      setLoading(true)
      const data = await sweetService.getAll()
      setSweets(data)
    } catch (error) {
      toast.error("Failed to load sweets")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      }

      if (editingId) {
        await sweetService.update(editingId, sweetData)
        toast.success("Sweet updated successfully")
      } else {
        await sweetService.create(sweetData)
        toast.success("Sweet added successfully")
      }

      setFormData({ name: "", price: "", quantity: "", category: "" })
      setShowForm(false)
      setEditingId(null)
      loadSweets()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed")
    }
  }

  const handleEdit = (sweet: Sweet) => {
    setFormData({
      name: sweet.name,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      category: sweet.category,
    })
    setEditingId(sweet._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return

    try {
      await sweetService.delete(id)
      toast.success("Sweet deleted successfully")
      loadSweets()
    } catch (error) {
      toast.error("Failed to delete sweet")
    }
  }

  const handleRestock = async (id: string) => {
    const quantity = prompt("Enter quantity to restock:")
    if (!quantity || isNaN(Number(quantity))) return

    try {
      await sweetService.restock(id, parseInt(quantity))
      toast.success("Sweet restocked successfully")
      loadSweets()
    } catch (error) {
      toast.error("Failed to restock sweet")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Candy className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{"Admin Panel"}</h1>
          </div>
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {"Back to Shop"}
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-balance">{"Manage Sweets"}</h2>
            <p className="text-muted-foreground">{"Add, edit, or remove sweets from your inventory"}</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({ name: "", price: "", quantity: "", category: "" })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {"Add Sweet"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Sweet" : "Add New Sweet"}</CardTitle>
              <CardDescription>
                {editingId ? "Update the sweet details" : "Fill in the details for the new sweet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{"Name"}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{"Category"}</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">{"Price ($)"}</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{"Quantity"}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Update" : "Add"} {"Sweet"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({ name: "", price: "", quantity: "", category: "" })
                    }}
                  >
                    {"Cancel"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {sweets.map((sweet) => (
              <Card key={sweet._id}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{sweet.name}</h3>
                      <Badge variant={sweet.quantity > 0 ? "default" : "destructive"}>
                        {sweet.quantity} in stock
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {sweet.category}
                      </Badge>
                    </div>
                    <p className="mt-1 font-semibold">${sweet.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleRestock(sweet._id)} variant="secondary" size="sm">
                      {"Restock"}
                    </Button>
                    <Button onClick={() => handleEdit(sweet)} variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(sweet._id)} variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}