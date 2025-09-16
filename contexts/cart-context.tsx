"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Product, CartItem, CartContextType } from "@/lib/types"

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find((item) => item.id === action.product.id)
      if (existingItem) {
        return state.map((item) => (item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...state, { ...action.product, quantity: 1 }]
    }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.productId)
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return state.filter((item) => item.id !== action.productId)
      }
      return state.map((item) => (item.id === action.productId ? { ...item, quantity: action.quantity } : item))
    case "CLEAR_CART":
      return []
    case "LOAD_CART":
      return action.items
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", items: parsedCart })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", product })
  }

  const removeFromCart = (productId: number) => {
    dispatch({ type: "REMOVE_FROM_CART", productId })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
