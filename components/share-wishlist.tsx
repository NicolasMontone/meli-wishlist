"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWishlist } from "@/hooks/use-wishlist";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { ShareIcon } from "lucide-react";

export function ShareWishlist() {
  const { wishlist } = useWishlist();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [savedUsername, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [takenUsernames, setTakenUsernames] = useState<string[]>([]);

  useEffect(() => {
    const fetchTakenUsernames = async () => {
      const response = await fetch("/api/wishlist/taken-usernames");
      const data = await response.json();
      setTakenUsernames(data);
    };
    fetchTakenUsernames();
  }, []);

  const handleSaveWishlist = async () => {
    setLoading(true);
    if (takenUsernames.includes(username)) {
      toast({
        title: `"${username}" ya está en uso`,
        description: "Intenta con otro nombre de usuario",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre de usuario",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (takenUsernames.includes(username)) {
      toast({
        title: "Error",
        description: "Este nombre de usuario ya está en uso",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          urls: wishlist.map((item) => item.url),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save wishlist");
      }

      const data = await response.json();
      toast({
        title: "Lista guardada",
        description: `Tu lista ha sido guardada con el usuario: ${username}`,
      });
      setSaved(username);
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal al guardar tu lista",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: "Lista de Deseos",
        text: "Lista de deseos compartida con vos",
        url: `${window.location.origin}/${savedUsername}`,
      });
    } else {
      console.error("Web Share API not supported on this browser");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparte Tu Lista de Deseos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de Usuario</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu nombre de usuario"
          />
        </div>
        <Button
          onClick={handleSaveWishlist}
          className="w-full"
          disabled={!username.trim()}
        >
          {loading ? "Guardando..." : "Guardar Lista"}
        </Button>
        {savedUsername && (
          <>
            <div className="space-y-2">
              <Label htmlFor="share-url">URL para compartir</Label>
              <Input
                id="share-url"
                type="text"
                value={`${window.location.origin}/${savedUsername}`}
                readOnly
              />
            </div>
            <Button onClick={share} className="w-full">
              Compartir <ShareIcon className="w-4 h-4 ml-2" />
            </Button>
            <div className="space-y-2">
              <Label>Código QR</Label>
              <div className="flex justify-center">
                <QRCodeCanvas
                  value={`${window.location.origin}/${savedUsername}`}
                  size={200}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
