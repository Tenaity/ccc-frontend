import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ChatbotTest() {
  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
          <CardDescription>Testing if Card component works</CardDescription>
        </CardHeader>
        <CardContent>
          <p>If you see this, Card component is working!</p>
          <Button className="mt-4">Test Button</Button>
        </CardContent>
      </Card>
    </div>
  )
}