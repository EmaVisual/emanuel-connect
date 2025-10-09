import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Zap, Link as LinkIcon, Globe, Github, Instagram, Facebook, Twitter, Youtube, Linkedin, Music, Mail, Phone } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

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

  const iconOptions = [
    { name: "Zap", Comp: Zap },
    { name: "Link", Comp: LinkIcon },
    { name: "Globe", Comp: Globe },
    { name: "Github", Comp: Github },
    { name: "Instagram", Comp: Instagram },
    { name: "Facebook", Comp: Facebook },
    { name: "Twitter", Comp: Twitter },
    { name: "Youtube", Comp: Youtube },
    { name: "Linkedin", Comp: Linkedin },
    { name: "Music", Comp: Music },
    { name: "Mail", Comp: Mail },
    { name: "Phone", Comp: Phone },
  ] as const;

  const getIconComp = (name?: string) => {
    const found = iconOptions.find(o => o.name === name);
    return (found?.Comp ?? Zap);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Links Personalizados</CardTitle>
        <CardDescription>Agrega y ordena tus enlaces personalizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link, index) => {
          const Preview = getIconComp(link.icon_name);
          return (
          <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end p-3 sm:p-0 border sm:border-0 rounded-lg">
            <div className="flex-1 space-y-2">
              <Label className="text-xs sm:text-sm">Título</Label>
              <Input
                value={link.title}
                onChange={(e) => updateLink(index, "title", e.target.value)}
                placeholder="Título del link"
                className="text-sm"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-xs sm:text-sm">URL</Label>
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                placeholder="https://..."
                className="text-sm"
              />
            </div>
            <div className="w-full sm:w-40 space-y-2">
              <Label className="text-xs sm:text-sm">Icono</Label>
              <Select value={link.icon_name} onValueChange={(v) => updateLink(index, "icon_name", v)}>
                <SelectTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <Preview className="w-4 h-4" />
                    <SelectValue placeholder="Selecciona" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(({ name, Comp }) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <Comp className="w-4 h-4" />
                        <span>{name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeLink(index)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span className="ml-2 sm:hidden">Eliminar</span>
            </Button>
          </div>
        )})}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={addLink} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Link
          </Button>
          <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
