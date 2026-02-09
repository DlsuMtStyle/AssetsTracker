import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ArrowDownCircle, ArrowUpCircle, Wallet, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type TransactionType = "expense" | "income";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Education",
  "Travel",
  "Other",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
  "Other",
];

const ACCOUNTS = ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Digital Wallet"];

const ExpenseForm = () => {
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !account || !amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in category, account, and amount.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: `${type === "expense" ? "Expense" : "Income"} saved!`,
      description: `${format(date, "PPP")} — ${category} — $${amount}`,
    });
    setCategory("");
    setAccount("");
    setAmount("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="mx-auto max-w-md">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Wallet className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your money, effortlessly.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-6 flex gap-2 rounded-xl bg-secondary p-1.5">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategory(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
              type === "expense"
                ? "bg-destructive text-destructive-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType("income"); setCategory(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200",
              type === "income"
                ? "bg-income text-income-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowUpCircle className="h-4 w-4" />
            Income
          </button>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Amount — hero field */}
          <div className="text-center">
            <Label htmlFor="amount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Amount
            </Label>
            <div className="mt-2 flex items-center justify-center gap-1">
              <span className="text-3xl font-bold text-foreground">$</span>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-40 border-none bg-transparent text-center text-4xl font-bold text-foreground outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Account</Label>
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {ACCOUNTS.map((acc) => (
                  <SelectItem key={acc} value={acc}>
                    {acc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              <FileText className="mr-1 inline h-3.5 w-3.5" />
              Notes
            </Label>
            <Textarea
              placeholder="Add a description…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className={cn(
              "w-full py-6 text-base font-semibold shadow-md transition-all duration-200",
              type === "expense"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-income text-income-foreground hover:bg-income/90"
            )}
          >
            Save {type === "expense" ? "Expense" : "Income"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
