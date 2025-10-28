"use client";

import { useState } from "react";
import {
  useGetMessagesQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} from "@/lib/redux/services/messagesApi";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HomePage() {
  const {
    data: messages,
    isLoading,
    isFetching,
    isError,
  } = useGetMessagesQuery();
  // create
  const [createMessage, { isLoading: isCreating }] = useCreateMessageMutation();
  // update
  const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation();
  // delete
  const [removeMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  const [newContent, setNewContent] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    await createMessage({ content: newContent }).unwrap();
    setNewContent("");
  };

  const openEdit = (id: number, content: string) => {
    setEditId(id);
    setEditContent(content);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (editId == null || !editContent.trim()) return;
    await updateMessage({ id: editId, content: editContent }).unwrap();
    setEditOpen(false);
  };

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Aplikacja Wiadomości</h1>
        <p className="text-sm text-muted-foreground">
          Formularz dodawania + tabela (ID, Wiadomość, Akcje) – RTK Query +
          ShadCN.
        </p>
      </header>

      {}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Dodaj wiadomość</h2>
        <form onSubmit={submitCreate} className="grid gap-3">
          <Textarea
            placeholder="Wpisz wiadomość…"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Dodaję…" : "Dodaj wiadomość"}
            </Button>
          </div>
        </form>
      </section>

      {}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Lista wiadomości</h2>

        {isLoading ? (
          <div>Ładowanie…</div>
        ) : isError ? (
          <div className="text-red-600">
            Wystąpił błąd podczas pobierania wiadomości.
          </div>
        ) : (
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">ID</TableHead>
                  <TableHead>Wiadomość</TableHead>
                  <TableHead className="w-56 text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.id}</TableCell>
                    <TableCell className="whitespace-pre-wrap">
                      {m.content}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(m.id, m.content)}
                      >
                        Edytuj
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Usuń
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Usunąć wiadomość?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tej operacji nie można cofnąć.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anuluj</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeMessage(m.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Usuwam…" : "Usuń"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}

                {(!messages || messages.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground"
                    >
                      Brak wiadomości
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {isFetching && (
              <div className="p-2 text-sm text-muted-foreground text-center">
                Odświeżam…
              </div>
            )}
          </div>
        )}
      </section>

      {}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj wiadomość</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button onClick={saveEdit} disabled={isUpdating}>
              {isUpdating ? "Zapisuję…" : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
