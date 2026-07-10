import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, ShieldCheck, Copy, Check } from "lucide-react";
import { VAULT_CATEGORIES } from "./vaultCategories";

export default function VaultItemCard({ item, onDecrypt, onDelete }) {
  const [plaintext, setPlaintext] = useState(null);
  const [copied, setCopied] = useState(false);
  const cat = VAULT_CATEGORIES.find((c) => c.id === item.category) || VAULT_CATEGORIES[4];

  const toggle = async () => {
    if (plaintext !== null) { setPlaintext(null); return; }
    const text = await onDecrypt(item);
    if (text !== null) setPlaintext(text);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
            <CardTitle className="text-base truncate">{item.title}</CardTitle>
          </div>
          <Badge className={cat.color}>{cat.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {plaintext !== null ? (
          <pre className="text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">{plaintext}</pre>
        ) : (
          <p className="text-sm text-slate-400 italic mb-3">Contenu chiffré — cliquez sur l'œil pour déchiffrer</p>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={toggle}>
            {plaintext !== null ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          {plaintext !== null && (
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
          <Button size="sm" variant="outline" className="ml-auto text-red-600 hover:bg-red-50" onClick={() => onDelete(item)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}