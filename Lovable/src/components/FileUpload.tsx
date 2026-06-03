import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Upload, FileSpreadsheet, X, AlertCircle, Search, Loader2 } from "lucide-react";

const ACCEPTED_TYPES = [
  ".csv",
  ".xlsx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/vnd.ms-excel",
];

const ACCEPT_STRING = ".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.ms-excel";

function isValidFile(file: File): boolean {
  const ext = file.name.toLowerCase();
  const mime = file.type.toLowerCase();
  const validExt = ext.endsWith(".csv") || ext.endsWith(".xlsx");
  const validMime = ACCEPTED_TYPES.includes(mime);
  return validExt || validMime;
}

export function FileUpload() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("arquivo", selectedFile);

      const response = await fetch("http://localhost:8000/encontrar_cnpj/arquivo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Erro ao processar arquivo");
      }

      // Baixa o CSV resultado automaticamente
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resultado_cnpj.csv";
      a.click();
      window.URL.revokeObjectURL(url);

      navigate({ to: "/results" });
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com a API. Verifique se o servidor está rodando.");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, navigate]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError(`"${file.name}" não é um formato válido. Use apenas .csv ou .xlsx.`);
        setSelectedFile(null);
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError(`"${file.name}" não é um formato válido. Use apenas .csv ou .xlsx.`);
        setSelectedFile(null);
      }
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <div
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : selectedFile
              ? "border-success bg-success/5"
              : "border-border bg-card hover:border-primary/40 hover:bg-primary/[0.02]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_STRING}
          onChange={handleFileSelect}
          className="sr-only"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-3 w-3" /> Remover arquivo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {isDragging ? "Solte o arquivo aqui" : "Clique ou arraste o arquivo"}
            </p>
            <p className="text-xs text-muted-foreground">Formatos suportados: .csv e .xlsx</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleSearch}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Buscar CNPJs
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

