import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface CustomLinksFormProps {
  userId: string;
}

interface CustomLink {
  id?: string;
  title: string;
  url: string;
  icon_name: string;
  order_index: number;
}

export const CustomLinksForm = ({ userId }: CustomLinksFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<CustomLink[]>([]);

  useEffect(() => {
    loadCustomLinks();
  }, [userId]);

  const loadCustomLinks = async () => {
    const { data, error } = await supabase
      .from("custom_links")
      .select("*")
      .eq("user_id", userId)
      .order("order_index");

    if (data) {
      setLinks(data);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.id) {
        await supabase
          .from("custom_links")
          .update({
            title: link.title,
            url: link.url,
            icon_name: link.icon_name,
            order_index: i,
          })
          .eq("id", link.id);
      } else {
        await supabase.from("custom_links").insert({
          user_id: userId,
          title: link.title,
          url: link.url,
          icon_name: link.icon_name,
          order_index: i,
        });
      }
    }

    toast({
      title: "Guardado",
      description: "Links actualizados exitosamente",
    });

    setLoading(false);
    loadCustomLinks();
  };

  const addLink = () => {
    setLinks([
      ...links,
      {
        title: "",
        url: "",
        icon_name: "Zap",
        order_index: links.length,
      },
    ]);
  };

  const removeLink = async (index: number) => {
    const link = links[index];
    if (link.id) {
      await supabase.from("custom_links").delete().eq("id", link.id);
    }
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links Personalizados</CardTitle>
        <CardDescription>Agrega y ordena tus enlaces personalizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>Título</Label>
              <Input
                value={link.title}
                onChange={(e) => updateLink(index, "title", e.target.value)}
                placeholder="Título del link"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>URL</Label>
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="w-32 space-y-2">
              <Label>Icono</Label>
              <Input
                value={link.icon_name}
                onChange={(e) => updateLink(index, "icon_name", e.target.value)}
                placeholder="Zap"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeLink(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={addLink}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Link
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
