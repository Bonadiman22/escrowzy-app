import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface EditTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: {
    name: string;
    visibility: string;
  };
  onSave: (data: { name: string; visibility: string }) => void;
}

export function EditTournamentDialog({
  open,
  onOpenChange,
  tournament,
  onSave,
}: EditTournamentDialogProps) {
  const [name, setName] = useState(tournament.name);
  const [isPublic, setIsPublic] = useState(tournament.visibility === "Público");
  const { toast } = useToast();

  const handleSave = () => {
    onSave({
      name,
      visibility: isPublic ? "Público" : "Privado",
    });
    toast({
      title: "Campeonato atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Campeonato</DialogTitle>
          <DialogDescription>
            Faça alterações nas configurações do campeonato.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Campeonato</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do campeonato"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="visibility">Campeonato Público</Label>
              <p className="text-sm text-muted-foreground">
                Permitir inscrições abertas
              </p>
            </div>
            <Switch
              id="visibility"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
